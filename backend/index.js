const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Importar modelos y sequelize
const { sequelize, Rol } = require('./models');

// Importar rutas
const authRoutes = require('./routes/auth');
const certRoutes = require('./routes/certificados');

// Montar rutas en el servidor
app.use('/auth', authRoutes);
app.use('/certificados', certRoutes);

// Sincronizar modelos con la base de datos y luego iniciar servidor
const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: false })  // alter: false para no alterar tablas existentes (usar true solo en desarrollo)
  .then(async () => {
    console.log('Base de datos sincronizada');
    // Inicializar datos por defecto si es necesario (roles, etc.)
    const rolesCount = await Rol.count();
    if (rolesCount === 0) {
      await Rol.bulkCreate([
        { nombre: 'ADMIN' },
        { nombre: 'INSTITUCION' },
        { nombre: 'EMPRESA' }
      ]);
      console.log('Roles iniciales creados');
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });
