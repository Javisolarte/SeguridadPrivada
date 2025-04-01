const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');

// Configura Sequelize con los valores del contenedor
const sequelize = new Sequelize('seguridad_db', 'postgres', 'postgres', {
  host: 'db', // Nombre del servicio de la base de datos en docker-compose
  dialect: 'postgres',
  logging: false, // Puedes poner true si quieres ver las consultas SQL en la consola
});

app.get('/test-connection', async (req, res) => {
  try {
    await sequelize.authenticate(); // Intenta hacer una conexión de prueba
    res.status(200).send('Conexión exitosa a la base de datos!');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    res.status(500).send('Error de conexión a la base de datos');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
