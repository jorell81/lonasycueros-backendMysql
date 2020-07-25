const mysql = require('../mysql/mysql');

const busqueda = async(req, resp) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;

    var promesa;

    switch (tabla) {
        case 'usuario':
            await buscarUsuarios(busqueda, async(usuariosBD) => {
                resp.status(200).json({
                    ok: true,
                    [tabla]: usuariosBD
                });
            });
            break;
        case 'categoria':
            await buscarCategorias(busqueda, async(categoriasBD) => {
                resp.status(200).json({
                    ok: true,
                    [tabla]: categoriasBD
                });
            });
            break;
        case 'subcategoria':
            await buscarSubCategorias(busqueda, async(subcategoriasBD) => {
                resp.status(200).json({
                    ok: true,
                    [tabla]: subcategoriasBD
                });
            });
            break;
        case 'producto':
            await buscarProductos(busqueda, async(productosBD) => {
                resp.status(200).json({
                    ok: true,
                    [tabla]: productosBD
                });
            });
            break;
        case 'cliente':
            await buscarClientes(busqueda, async(clientesBD) => {
                resp.status(200).json({
                    ok: true,
                    [tabla]: clientesBD
                });
            });
            break;
        case 'descuento':
            await buscarDescuentos(busqueda, async(descuentosBD) => {
                resp.status(200).json({
                    ok: true,
                    [tabla]: descuentosBD
                });
            });
            break;
        default:
            resp.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, categorías, subcategorías y productos',
                error: { message: 'Tipo tabla/coleccion no válido' }
            });
    }

    /* promesa.then(data => {
        resp.status(200).json({
            ok: true,
            [tabla]: data
        });
    }); */

};


const buscarUsuarios = async(busqueda, callback) => {

    let tipoOperacion = 1;
    await mysql.default.ejecutarQuery(`call PA_BUSQUEDA_CONSULTAR('${ busqueda }', ${ tipoOperacion})`, (err, usuariosBD) => {
        callback(usuariosBD[0]);

    });
};


const buscarCategorias = async(busqueda, callback) => {

    let tipoOperacion = 2;
    await mysql.default.ejecutarQuery(`call PA_BUSQUEDA_CONSULTAR('${ busqueda }', ${ tipoOperacion})`, (err, categoriasBD) => {
        callback(categoriasBD[0]);
    });
};

const buscarSubCategorias = async(busqueda, callback) => {

    let tipoOperacion = 3;
    await mysql.default.ejecutarQuery(`call PA_BUSQUEDA_CONSULTAR('${ busqueda }', ${ tipoOperacion})`, (err, subcategoriasBD) => {
        callback(subcategoriasBD[0]);
    });
};

const buscarProductos = async(busqueda, callback) => {

    let tipoOperacion = 4;
    await mysql.default.ejecutarQuery(`call PA_BUSQUEDA_CONSULTAR('${ busqueda }', ${ tipoOperacion})`, (err, productosBD) => {
        callback(productosBD[0]);
    });
};

const buscarClientes = async(busqueda, callback) => {
    let tipoOperacion = 5;
    await mysql.default.ejecutarQuery(`call PA_BUSQUEDA_CONSULTAR('${ busqueda }', ${ tipoOperacion})`, (err, clientesBD) => {
        callback(clientesBD[0]);
    });
};

const buscarDescuentos = async(busqueda, callback) => {
    let tipoOperacion = 6;
    await mysql.default.ejecutarQuery(`call PA_BUSQUEDA_CONSULTAR('${ busqueda }', ${ tipoOperacion})`, (err, descuentosBD) => {
        callback(descuentosBD[0]);
    });
};

module.exports = {
    busqueda
};