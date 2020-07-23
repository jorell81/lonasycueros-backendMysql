const mysql = require('../mysql/mysql');


// ===============================================
// Obtener todos los productos activos
// ===============================================
const getProductos = async(req, resp) => {
    try {
        let tipoOperacion = 1;
        let estado = (req.params.estado > 0) ? req.params.estado : null; // si llega cero se obtienen todos los productos
        let myParams = `null, null,${estado},${ tipoOperacion}`;
        await mysql.default.ejecutarQuery('call PA_PRODUCTO_CONSULTAR(' + myParams + ')', (err, productos) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error cargando Productos',
                    errors: err
                });
            }

            resp.json({
                ok: true,
                productos: productos[0]
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
// Crear un Producto
// ===============================================
const crearProducto = async(req, resp) => {
    try {
        let tipoOperacion = 1;
        let nombre = (req.body.nombre).toUpperCase() + ' - ' + (req.body.talla).toUpperCase() + ' - ' + (req.body.color).toUpperCase();
        let codigoBarras = null;
        let marca = (req.body.marca).toUpperCase();
        let valorEntrada = req.body.valorEntrada;
        let valorSalida = req.body.valorSalida;
        let talla = (req.body.talla).toUpperCase();
        let color = (req.body.color).toUpperCase();
        let bodega = req.body.bodega;
        let genero = (req.body.genero).toUpperCase();
        let idSubCategoria = req.body.idSubCategoria;
        let idCategoria = req.body.idCategoria;
        let myParams = `'${nombre}', '${marca}',${valorEntrada},${valorSalida},'${talla}','${color}',${bodega},'${genero}',${idSubCategoria},${tipoOperacion},@Resultado`;
        await mysql.default.ejecutarQuery('set @Resultado = 0;call PA_PRODUCTO_INSERTAR(' + myParams + ');select @Resultado;', async(err, productos) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error creando Productos',
                    errors: err
                });
            }
            let id = productos[2][0];
            codigoBarras = '1' + idCategoria.toString().padStart(4, '0') + idSubCategoria.toString().padStart(5, '0') + id['@Resultado'].toString().padStart(6, '0');
            // Se debe insertar el codigo de barras
            await insertarCodigoBarras(id['@Resultado'], codigoBarras, (productoDB) => {
                resp.json({
                    ok: true,
                    productos: productoDB
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
// Actualizar una SubCategoría
// ===============================================
const actualizarProducto = async(req, resp) => {
    let idProducto = req.params.id;
    try {

        consultarProductoxId(idProducto, (productoBD) => {
            const proNuevo = {};
            if (!productoBD) {
                return resp.status(404).json({
                    ok: true,
                    msg: 'No existe una producto con ese id',
                });
            } else {

                proNuevo.nombre = req.body.nombre !== productoBD.nombre ? (req.body.nombre).toUpperCase() + ' - ' + (req.body.talla).toUpperCase() + ' - ' + (req.body.color).toUpperCase() : req.body.nombre;
                proNuevo.marca = (req.body.marca).toUpperCase();
                proNuevo.valorEntrada = req.body.valorEntrada;
                proNuevo.valorSalida = req.body.valorSalida;
                proNuevo.talla = (req.body.talla).toUpperCase();
                proNuevo.color = (req.body.color).toUpperCase();
                proNuevo.bodega = req.body.bodega;
                proNuevo.genero = (req.body.genero).toUpperCase();
                proNuevo.idSubCategoria = req.body.idSubCategoria;
                proNuevo.estado = req.body.estado;

            }

            if (Object.keys(proNuevo).length > 0) {
                let tipoOperacion = 1;
                let myParams = `${idProducto},'${proNuevo.nombre}',null,'${proNuevo.marca}',${proNuevo.valorEntrada},${proNuevo.valorSalida},'${proNuevo.talla}','${proNuevo.color}',${proNuevo.bodega},'${proNuevo.genero}',${proNuevo.idSubCategoria},${proNuevo.estado},${tipoOperacion},@Resultado`;
                let query = 'call PA_PRODUCTO_ACTUALIZAR(' + myParams + ')';
                mysql.default.ejecutarQuery(query, (err, productoActualizado) => {
                    if (err) {
                        return resp.status(400).json({
                            ok: false,
                            msg: 'Error al actualizar producto',
                            errors: err
                        });
                    }
                    insertarAuditoria(idProducto, productoBD, proNuevo, 'UPDATE', async(auditoriaBD) => {
                        resp.json({
                            ok: true,
                            msg: 'Producto actualizado'
                        });
                    });

                });
            }
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
// Actualizar una SubCategoría
// ===============================================
const eliminarProducto = async(req, resp) => {
    let idProducto = req.params.id;
    try {

        await consultarProductoxId(idProducto, async(productoBD) => {
            const proNuevo = {};
            if (!productoBD) {
                return resp.status(404).json({
                    ok: true,
                    msg: 'No existe una producto con ese id',
                });
            } else {
                proNuevo.nombre = productoBD.nombre;
                proNuevo.marca = productoBD.marca;
                proNuevo.valorEntrada = productoBD.valorEntrada;
                proNuevo.valorSalida = productoBD.valorSalida;
                proNuevo.talla = productoBD.talla;
                proNuevo.color = productoBD.color;
                proNuevo.bodega = productoBD.bodega;
                proNuevo.genero = productoBD.genero;
                proNuevo.idSubCategoria = productoBD.idSubCategoria;
                proNuevo.estado = 0;
            }

            let tipoOperacion = 1;
            let estado = 0;
            let myParams = `${idProducto},null,null,null,null,null,null,null,null,null,null,${estado},${tipoOperacion},@Resultado`;
            let query = 'call PA_PRODUCTO_ACTUALIZAR(' + myParams + ')';
            await mysql.default.ejecutarQuery(query, (err, productoEliminado) => {


                insertarAuditoria(idProducto, productoBD, proNuevo, 'DELETE', async(auditoriaBD) => {
                    resp.json({
                        ok: true,
                        msg: 'Producto eliminado'
                    });
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

const consultarProductoxId = async(id, callback) => {
    let tipoOperacion = 2;
    let myParams = `${id},null,null,${tipoOperacion}`;
    await mysql.default.ejecutarQuery('call PA_PRODUCTO_CONSULTAR(' + myParams + ')', (err, productoBD) => {
        if (err) {
            callback(err)
        } else {
            callback(productoBD[0][0]);
        }

    });
};

const insertarCodigoBarras = async(idProducto, codigo, callback) => {
    let tipoOperacion = 1;
    let myParams = `${idProducto},null,${codigo},null,null,null,null,null,null,null,null,null,${tipoOperacion},@Resultado`;
    await mysql.default.ejecutarQuery('call PA_PRODUCTO_ACTUALIZAR(' + myParams + ')', (err, productoBD) => {
        if (err) {
            callback(err);
        } else {
            callback(productoBD);
        }
    });
};

const insertarAuditoria = async(idProducto, productoAnterior, productoNuevo, accion, callback) => {
    let tipoOperacion = 1;
    let myParams = `${parseInt(idProducto)},'${JSON.stringify(productoAnterior)}','${JSON.stringify(productoNuevo)}','${accion}',${tipoOperacion},@Resultado`;
    await mysql.default.ejecutarQuery('call PA_AUDITORIA_INSERTAR(' + myParams + ')', (err, auditoriaBD) => {
        if (err) {
            callback(err);
        } else {
            callback(auditoriaBD);
        }
    });
};


module.exports = {
    getProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};