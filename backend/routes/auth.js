const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Importar modelos necesarios
const { Usuario, Rol, Institucion, Empresa } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_jwt'; // Clave JWT desde variables de entorno

// Registro de nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, contrasenia, rolNombre, institucionNombre, empresaNombre } = req.body;

    // Validar datos requeridos
    if (!nombre || !email || !contrasenia) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    // Determinar rol (por defecto, Institución si no se especifica)
    let rol;
    if (rolNombre) {
      rol = await Rol.findOne({ where: { nombre: rolNombre.toUpperCase() } });
    } else {
      rol = await Rol.findOne({ where: { nombre: 'INSTITUCION' } });
    }
    if (!rol) {
      return res.status(400).json({ error: 'Rol especificado no válido' });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(contrasenia, saltRounds);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      contrasenia: passwordHash,
      rolId: rol.id
    });

    // Si el rol es Institucion o Empresa, crear la entidad correspondiente y vincularla
    if (rol.nombre === 'INSTITUCION') {
      if (!institucionNombre) {
        return res.status(400).json({ error: 'Debe proporcionar el nombre de la institución' });
      }
      const nuevaInst = await Institucion.create({ nombre: institucionNombre });
      // Asignar institucion al usuario
      nuevoUsuario.institucionId = nuevaInst.id;
      await nuevoUsuario.save();
    } else if (rol.nombre === 'EMPRESA') {
      if (!empresaNombre) {
        return res.status(400).json({ error: 'Debe proporcionar el nombre de la empresa' });
      }
      const nuevaEmp = await Empresa.create({ nombre: empresaNombre });
      nuevoUsuario.empresaId = nuevaEmp.id;
      await nuevoUsuario.save();
    }

    return res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El email ya está en uso' });
    }
    return res.status(500).json({ error: 'Error del servidor al registrar usuario' });
  }
});

// Inicio de sesión (login)
router.post('/login', async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    if (!email || !contraseña) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Comparar contraseña
    const passwordMatch = await bcrypt.compare(contraseña, usuario.contrasenia);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Generar token JWT
    const token = jwt.sign(
      { usuarioId: usuario.id, rolId: usuario.rolId, institucionId: usuario.institucionId, empresaId: usuario.empresaId },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error del servidor al iniciar sesión' });
  }
});

module.exports = router;
