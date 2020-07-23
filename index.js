const express = require('express');
require('dotenv').config();
const MySQL = require('./mysql/mysql');
const cors = require('cors');

const Enviroment = (process.env.PORT || '').length > 0 ? '/ServLonasyCueros' : '';
const Port = process.env.PORT || 3000;

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());


app.use(Enviroment + '/api/usuarios', require('./routes/usuarios'));
app.use(Enviroment + '/api/categorias', require('./routes/categorias'));
app.use(Enviroment + '/api/subcategorias', require('./routes/subcategorias'));
app.use(Enviroment + '/api/productos', require('./routes/productos'));
app.use(Enviroment + '/api/busqueda', require('./routes/busqueda'));
app.use(Enviroment + '/api/login', require('./routes/auth'));




app.listen(Port, () => {
    console.log('Servidor escuchando por el puerto ' + 3000);
});