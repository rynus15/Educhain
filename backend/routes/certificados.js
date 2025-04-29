const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { Certificado, Estudiante, CertificadoBlockchain, Verificacion, AlertaFraude, ActividadSistema, Usuario } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_jwt';

// Middleware de autenticación JWT para proteger rutas de emisión
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Autorización requerida' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded; // attach payload info (usuarioId, rolId, institucionId, etc.)
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// Registrar/emisión de un nuevo certificado (requiere autenticación)
router.post('/', verificarToken, async (req, res) => {
  try {
    const { titulo, descripcion, fechaEmision, estudiante } = req.body;
    // estudiante debe ser un objeto con nombre, apellido, identificacion (y opcional email)
    if (!titulo || !estudiante || !estudiante.nombre || !estudiante.apellido) {
      return res.status(400).json({ error: 'Datos de certificado o estudiante incompletos' });
    }

    // Solo usuarios con rol Institucion o Admin pueden emitir certificados
    // Suponemos que rolId correspondiente a Institucion está definido (p.ej., se seedearon roles)
    // (Este chequeo podría ser más robusto buscando el rol por nombre)
    if (!req.usuario || (!req.usuario.institucionId && !req.usuario.rolId === 'ADMIN')) {
      return res.status(403).json({ error: 'No tiene permisos para emitir certificados' });
    }

    // Obtener o crear estudiante
    let estudianteId;
    if (estudiante.identificacion) {
      // Si viene un identificador único, buscar por él
      const estudianteExistente = await Estudiante.findOne({ where: { identificacion: estudiante.identificacion } });
      if (estudianteExistente) {
        estudianteId = estudianteExistente.id;
      } else {
        const nuevoEst = await Estudiante.create({
          nombre: estudiante.nombre,
          apellido: estudiante.apellido,
          identificacion: estudiante.identificacion,
          email: estudiante.email || null
        });
        estudianteId = nuevoEst.id;
      }
    } else {
      // Si no hay identificación, crear un nuevo estudiante igualmente
      const nuevoEst = await Estudiante.create({
        nombre: estudiante.nombre,
        apellido: estudiante.apellido,
        email: estudiante.email || null
      });
      estudianteId = nuevoEst.id;
    }

    // Determinar la institución o empresa emisora según el usuario
    let institucionId = req.usuario.institucionId || null;
    let empresaId = req.usuario.empresaId || null;
    // Si el rol es ADMIN y proporciona institucionId en la petición, podría usarse. 
    // (Por simplicidad, omitimos ese caso aquí, suponiendo que un admin podría usar otra ruta específica.)

    if (!institucionId && !empresaId) {
      return res.status(400).json({ error: 'El usuario no está asociado a ninguna institución o empresa emisora' });
    }

    // Crear certificado
    const certificado = await Certificado.create({
      titulo,
      descripcion: descripcion || '',
      fechaEmision: fechaEmision || new Date(),
      estudianteId,
      institucionId,
      empresaId
    });

    // Generar hash del certificado para almacenar en blockchain (simulado)
    const datosParaHash = `${certificado.titulo}|${certificado.descripcion}|${certificado.fechaEmision.toISOString()}|${estudiante.nombre}|${estudiante.apellido}|${estudiante.identificacion || ''}|${institucionId ? 'institucion:' + institucionId : 'empresa:' + empresaId}`;
    const hash = crypto.createHash('sha256').update(datosParaHash).digest('hex');
    await CertificadoBlockchain.create({
      certificadoId: certificado.id,
      hash
      // Aquí podría invocarse una función para almacenar el hash en una blockchain real, obteniendo un transactionId.
    });

    // Registrar actividad en el sistema
    await ActividadSistema.create({
      accion: 'EMITIR_CERTIFICADO',
      descripcion: `Certificado ${certificado.id} emitido para Estudiante ${estudianteId}`,
      usuarioId: req.usuario.usuarioId
    });

    return res.status(201).json({ mensaje: 'Certificado creado exitosamente', certificadoId: certificado.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error del servidor al registrar certificado' });
  }
});

// Verificación de certificado (público, no requiere autenticación)
router.get('/verificar/:id', async (req, res) => {
  try {
    const certId = req.params.id;
    // Buscar el certificado con sus datos relacionados
    const certificado = await Certificado.findOne({ 
      where: { id: certId },
      include: [
        { model: Estudiante },
        // Opcional: podría incluir Institucion/Empresa si se quiere mostrar info de emisor
        // { model: Institucion }, { model: Empresa }
      ]
    });
    if (!certificado) {
      // Registrar intento de verificacion fallido
      await Verificacion.create({
        resultado: 'fallido',
        certificadoId: null,
        descripcion: `Certificado con id ${certId} no encontrado`
      });
      return res.status(404).json({ valido: false, mensaje: 'Certificado no encontrado' });
    }

    // Obtener el registro de blockchain
    const registroBC = await CertificadoBlockchain.findOne({ where: { certificadoId: certId } });
    let valido = false;
    let motivoFalla = '';

    if (registroBC) {
      // Recalcular hash con los datos actuales del certificado
      const estudiante = certificado.Estudiante;
      const datosParaHash = `${certificado.titulo}|${certificado.descripcion}|${new Date(certificado.fechaEmision).toISOString()}|${estudiante.nombre}|${estudiante.apellido}|${estudiante.identificacion || ''}|${certificado.institucionId ? 'institucion:' + certificado.institucionId : 'empresa:' + certificado.empresaId}`;
      const hashActual = crypto.createHash('sha256').update(datosParaHash).digest('hex');
      if (hashActual === registroBC.hash) {
        valido = true;
      } else {
        valido = false;
        motivoFalla = 'El certificado no coincide con su registro blockchain (posible alteración)';
      }
    } else {
      // Si por alguna razón no existe registro blockchain, se considera no válido
      valido = false;
      motivoFalla = 'Certificado no registrado en blockchain';
    }

    // Registrar el intento de verificación
    await Verificacion.create({
      resultado: valido ? 'exitoso' : 'fallido',
      certificadoId: certificado.id,
      descripcion: valido ? 'Verificación exitosa' : (motivoFalla || 'Fallo de verificación desconocido')
    });

    if (!valido) {
      // Generar alerta de fraude si corresponde
      await AlertaFraude.create({
        motivo: 'VERIFICACION_FALLIDA',
        detalles: motivoFalla || 'No coinciden los datos con blockchain',
        certificadoId: certificado.id
      });
      return res.json({ valido: false, mensaje: motivoFalla || 'Certificado inválido' });
    }

    // Si es válido, devolver información básica del certificado
    return res.json({
      valido: true,
      certificado: {
        id: certificado.id,
        titulo: certificado.titulo,
        descripcion: certificado.descripcion,
        fechaEmision: certificado.fechaEmision,
        estudiante: {
          nombre: certificado.Estudiante.nombre,
          apellido: certificado.Estudiante.apellido,
          identificacion: certificado.Estudiante.identificacion
        },
        institucionId: certificado.institucionId,
        empresaId: certificado.empresaId
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error del servidor al verificar certificado' });
  }
});

module.exports = router;
