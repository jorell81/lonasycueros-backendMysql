// Requires
const express = require('express');
const bodyParser = require('body-parser');
const Mysql = require('./mysql/mysql');

const Enviroment = (process.env.PORT || '').length > 0 ? '/ServMysql' : '';
const Port = process.env.PORT || 3000;



// Inicializar constiables
const app = express();


const cors = require('cors');

app.use(cors());





// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const appRoutes = require('./routes/app');
// const usuarioRoutes = require('./routes/usuario');
// const loginRoutes = require('./routes/login');
// const categoriaRoutes = require('./routes/categoria');
// const subcategoriaRoutes = require('./routes/subcategoria');
// const productoRoutes = require('./routes/producto');
// const descuentoRoutes = require('./routes/descuento');
// const clienteRoutes = require('./routes/cliente');
// const busquedaRoutes = require('./routes/busqueda');
// const auditoriaProductoRoutes = require('./routes/auditoriaProducto');
// const tipoDocumentoRoutes = require('./routes/tipoDocumento');




// Rutas
// app.use(Enviroment + '/usuario', usuarioRoutes);
// app.use(Enviroment + '/login', loginRoutes);
// app.use(Enviroment + '/categoria', categoriaRoutes);
// app.use(Enviroment + '/subcategoria', subcategoriaRoutes);
// app.use(Enviroment + '/producto', productoRoutes);
// app.use(Enviroment + '/descuento', descuentoRoutes);
// app.use(Enviroment + '/cliente', clienteRoutes);
// app.use(Enviroment + '/busqueda', busquedaRoutes);
// app.use(Enviroment + '/auditoriaProducto', auditoriaProductoRoutes);
// app.use(Enviroment + '/tipoDocumento', tipoDocumentoRoutes);
app.use(Enviroment + '/', appRoutes);
/* app.get('/', (req, resp, next) => {
    resp.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
}); */





// Escuchar peticiones
app.listen(Port, () => {
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});