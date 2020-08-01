const mysql = require('../mysql/mysql');


// ===============================================
// Obtener todas los Clientes
// ===============================================
const getClientes = async(req, resp) => {
    try {
        let tipoOperacion = 1;
        let myParams = `null, null,${ tipoOperacion}`;
        await mysql.default.ejecutarQuery('call PA_CLIENTE_CONSULTAR(' + myParams + ')', (err, clientes) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error cargando Clientes',
                    errors: err
                });
            }

            resp.json({
                ok: true,
                clientes: clientes[0]
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
// Obtener Cliente x ID
// ===============================================
const getClientexNumDocumento = async(req, resp) => {
    try {
        let numeroDocumento = req.params.numDocumento;
        let tipoOperacion = 1;
        let myParams = `null,${numeroDocumento},${ tipoOperacion}`;
        await mysql.default.ejecutarQuery('call PA_CLIENTE_CONSULTAR(' + myParams + ')', (err, cliente) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error cargando Cliente',
                    errors: err
                });
            }

            resp.json({
                ok: true,
                cliente: cliente[0]
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
// Crear un Cliente
// ===============================================
const crearCliente = async(req, resp) => {
    try {
        let tipoOperacion = 1;
        let nombre = (req.body.nombre).toUpperCase();
        let apellido = (req.body.apellido).toUpperCase();
        let idTipoDocumento = req.body.idTipoDocumento;
        let numeroDocumento = req.body.numeroDocumento;
        let telefono = req.body.telefono;

        let myParams = `'${nombre}','${apellido}',${idTipoDocumento},'${numeroDocumento}','${telefono}',${tipoOperacion},@Resultado`;
        await mysql.default.ejecutarQuery('set @Resultado = 0;call PA_CLIENTE_INSERTAR(' + myParams + ');select @Resultado;', (err, clientes) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error creando Cliente',
                    errors: err
                });
            }
            let idInsertado = clientes[2][0];
            resp.json({
                ok: true,
                clientes: idInsertado['@Resultado']
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
// Actualizar un Cliente
// ===============================================
const actualizarCliente = async(req, resp) => {
    let idCliente = req.params.id;
    let nombre = (req.body.nombre).toUpperCase();
    let apellido = (req.body.apellido).toUpperCase();
    let idTipoDocumento = req.body.idTipoDocumento;
    let numeroDocumento = req.body.numeroDocumento;
    let telefono = req.body.telefono;
    try {

        consultarClientexId(idCliente, (clienteDB) => {
            if (!clienteDB) {
                return resp.status(404).json({
                    ok: true,
                    msg: 'No existe un cliente con ese id',
                });
            }
            let tipoOperacion = 1;
            let myParams = `${idCliente},'${nombre}','${apellido}',${idTipoDocumento},'${numeroDocumento}','${telefono}',${tipoOperacion},@Resultado`;
            let query = 'call PA_CLIENTE_ACTUALIZAR(' + myParams + ')';
            mysql.default.ejecutarQuery(query, (err, clienteActualizada) => {
                if (err) {
                    return resp.status(400).json({
                        ok: false,
                        msg: 'Error al actualizar cliente',
                        errors: err
                    });
                }
                resp.json({
                    ok: true,
                    msg: 'Cliente actualizado'
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

const consultarClientexId = async(id, callback) => {
    let tipoOperacion = 1;
    let myParams = `${id},null,${tipoOperacion}`;
    await mysql.default.ejecutarQuery('call PA_CLIENTE_CONSULTAR(' + myParams + ')', (err, clienteBD) => {
        callback(clienteBD);
    });
};

module.exports = {
    getClientes,
    crearCliente,
    actualizarCliente,
    getClientexNumDocumento
};