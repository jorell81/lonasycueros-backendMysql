const mysql = require('../mysql/mysql');
const { getProductos } = require('../controllers/productos');


// ===============================================
// Obtener todos los Descuentos
// ===============================================
const getDescuentos = async(req, resp) => {
    try {
        let tipoOperacion = 1;
        let myParams = `null, null,${ tipoOperacion}`;
        await mysql.default.ejecutarQuery('call PA_DESCUENTO_CONSULTAR(' + myParams + ')', (err, descuentos) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error cargando Descuentos',
                    errors: err
                });
            }

            resp.json({
                ok: true,
                descuentos: descuentos[0]
            });
        });
    } catch (error) {
        resp.status(500).json({
            ok: true,
            msg: 'Error inesperado en la BD.',
            error: error
        });
    }
};

// ===============================================
// Crear un Descuento
// ===============================================
const crearDescuento = async(req, resp) => {
    try {
        let tipoOperacion = 1;
        let nombre = (req.body.nombre).toUpperCase();
        let fechaInicio = req.body.fechaInicio;
        let fechaFin = req.body.fechaFin;
        let valorDescuento = req.body.valorDescuento;
        let idProducto = req.body.idProducto;

        let myParams = `'${nombre}','${fechaInicio}','${fechaFin}',${valorDescuento},${idProducto},${tipoOperacion},@Resultado`;
        await mysql.default.ejecutarQuery('set @Resultado = 0;call PA_DESCUENTO_INSERTAR(' + myParams + ');select @Resultado;', (err, decuentos) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error creando Descuento',
                    errors: err
                });
            }
            let idInsertado = decuentos[2][0];
            resp.json({
                ok: true,
                decuentos: idInsertado['@Resultado']
            });
        });
    } catch (error) {
        resp.status(500).json({
            ok: true,
            msg: 'Error inesperado en la BD.',
            error: error
        });
    }
};

// ===============================================
// Crear Decuento todos los productos
// ===============================================
const crearDescuentoTodos = async(req, resp) => {
    try {
        let tipoOperacion = 1;
        let myParams = `null, null,1,${ tipoOperacion}`;
        await mysql.default.ejecutarQuery('call PA_PRODUCTO_CONSULTAR(' + myParams + ')', (err, productos) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error cargando Productos',
                    errors: err
                });
            }
            let tipoOperacion = 1;
            let nombre = (req.body.nombre).toUpperCase();
            let fechaInicio = req.body.fechaInicio;
            let fechaFin = req.body.fechaFin;
            let valorDescuento = req.body.valorDescuento;
            let totalDescuentos = 0;

            productos[0].forEach(element => {
                let idProducto = element.idProducto;
                let myParams = `'${nombre}','${fechaInicio}','${fechaFin}',${valorDescuento},${idProducto},${tipoOperacion},@Resultado`;
                mysql.default.ejecutarQuery('set @Resultado = 0;call PA_DESCUENTO_INSERTAR(' + myParams + ');select @Resultado;', (err, decuentos) => {
                    if (err) {
                        return resp.status(500).json({
                            ok: false,
                            msg: 'Error creando Descuento',
                            errors: err
                        });

                    }
                    totalDescuentos = totalDescuentos + 1;
                    if (productos[0].indexOf(element) === productos[0].length - 1) {

                        resp.json({
                            ok: true,
                            decuentos: totalDescuentos
                        });
                    }
                });
            });
        });

    } catch (error) {
        resp.status(500).json({
            ok: true,
            msg: 'Error inesperado en la BD.',
            error: error
        });
    }
};

// ===============================================
// Actualizar un Descuento
// ===============================================
const actualizarDescuento = async(req, resp) => {
    let idDescuento = req.params.id;
    let nombre = (req.body.nombre).toUpperCase();
    let fechaInicio = req.body.fechaInicio;
    let fechaFin = req.body.fechaFin;
    let valorDescuento = req.body.valorDescuento;
    let idProducto = req.body.idProducto;
    try {

        consultarDescuentoxId(idDescuento, (descuentoDB) => {
            if (!descuentoDB) {
                return resp.status(404).json({
                    ok: true,
                    msg: 'No existe un descuento con ese id',
                });
            }
            let tipoOperacion = 1;
            let myParams = `${idDescuento},'${nombre}','${fechaInicio}','${fechaFin}',${valorDescuento},${idProducto},${tipoOperacion},@Resultado`;
            let query = 'call PA_DESCUENTO_ACTUALIZAR(' + myParams + ')';
            mysql.default.ejecutarQuery(query, (err, descuentoActualizada) => {
                if (err) {
                    return resp.status(400).json({
                        ok: false,
                        msg: 'Error al actualizar descuento',
                        errors: err
                    });
                }
                resp.json({
                    ok: true,
                    msg: 'Descuento actualizado'
                });
            });
        });

    } catch (error) {
        resp.status(500).json({
            ok: true,
            msg: 'Error inesperado en la BD.',
            error: error
        });
    }
};

// ===============================================
// Eliminar un Cliente
// ===============================================
// const eliminarCliente = async(req, resp) => {
//     let idCliente = req.params.id;
//     try {
//         consultarClientexId(idCliente, (clienteDB) => {
//             if (!clienteDB) {
//                 return resp.status(404).json({
//                     ok: true,
//                     msg: 'No existe un cliente con ese id',
//                 });
//             }

//             let tipoOperacion = 1;
//             let myParams = `${ idSubCategoria },null,null,null,0,${tipoOperacion},@Resultado`;
//             let query = 'call PA_SUBCATEGORIA_ACTUALIZAR(' + myParams + ')';
//             mysql.default.ejecutarQuery(query, (err, subcategoriaActualizada) => {
//                 if (err) {
//                     return resp.status(400).json({
//                         ok: false,
//                         msg: 'Error al eliminar sub categoría',
//                         errors: err
//                     });
//                 }
//                 resp.json({
//                     ok: true,
//                     msg: ' Sub ategoria eliminada'
//                 });
//             });

//         });
//     } catch (error) {
//         resp.status(500).json({
//             ok: true,
//             msg: 'Error inesperado en la BD.',
//             error: error
//         });
//     }
// };

const consultarDescuentoxId = async(id, callback) => {
    let tipoOperacion = 1;
    let myParams = `${id},null,${tipoOperacion}`;
    await mysql.default.ejecutarQuery('call PA_CLIENTE_CONSULTAR(' + myParams + ')', (err, clienteBD) => {
        callback(clienteBD);
    });
};

module.exports = {
    getDescuentos,
    crearDescuento,
    crearDescuentoTodos,
    actualizarDescuento
};