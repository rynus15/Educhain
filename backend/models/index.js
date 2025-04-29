const sequelize = require('../config/database');

const Rol = require('./Rol');
const Usuario = require('./Usuario');
const Institucion = require('./Institucion');
const Empresa = require('./Empresa');
const Estudiante = require('./Estudiante');
const Certificado = require('./Certificado');
const CertificadoBlockchain = require('./CertificadoBlockchain');
const Verificacion = require('./Verificacion');
const AlertaFraude = require('./AlertaFraude');
const ActividadSistema = require('./ActividadSistema');

// Associations

// Rol 1 - N Usuario
Rol.hasMany(Usuario, { foreignKey: 'id_rol' });
Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });

// Usuario 1 - N Institucion
Usuario.hasMany(Institucion, { foreignKey: 'id_usuario' });
Institucion.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Usuario 1 - N Empresa
Usuario.hasMany(Empresa, { foreignKey: 'id_usuario' });
Empresa.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Usuario 1 - N Estudiante
Usuario.hasMany(Estudiante, { foreignKey: 'id_usuario' });
Estudiante.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Institucion 1 - N Certificado
Institucion.hasMany(Certificado, { foreignKey: 'id_institucion' });
Certificado.belongsTo(Institucion, { foreignKey: 'id_institucion' });

// Estudiante 1 - N Certificado
Estudiante.hasMany(Certificado, { foreignKey: 'id_estudiante' });
Certificado.belongsTo(Estudiante, { foreignKey: 'id_estudiante' });

// Certificado 1 - 1 CertificadoBlockchain
Certificado.hasOne(CertificadoBlockchain, { foreignKey: 'id_certificado' });
CertificadoBlockchain.belongsTo(Certificado, { foreignKey: 'id_certificado' });

// Certificado 1 - N Verificacion
Certificado.hasMany(Verificacion, { foreignKey: 'id_certificado' });
Verificacion.belongsTo(Certificado, { foreignKey: 'id_certificado' });

// Certificado 1 - N AlertaFraude
Certificado.hasMany(AlertaFraude, { foreignKey: 'id_certificado' });
AlertaFraude.belongsTo(Certificado, { foreignKey: 'id_certificado' });

// Usuario 1 - N Verificacion (verificador)
Usuario.hasMany(Verificacion, { foreignKey: 'id_usuario_verificador' });
Verificacion.belongsTo(Usuario, { foreignKey: 'id_usuario_verificador' });

// Usuario 1 - N AlertaFraude (reportador)
Usuario.hasMany(AlertaFraude, { foreignKey: 'id_usuario_reportador' });
AlertaFraude.belongsTo(Usuario, { foreignKey: 'id_usuario_reportador' });

// Usuario 1 - N ActividadSistema
Usuario.hasMany(ActividadSistema, { foreignKey: 'id_usuario' });
ActividadSistema.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = {
  sequelize,
  Rol,
  Usuario,
  Institucion,
  Empresa,
  Estudiante,
  Certificado,
  CertificadoBlockchain,
  Verificacion,
  AlertaFraude,
  ActividadSistema
};
