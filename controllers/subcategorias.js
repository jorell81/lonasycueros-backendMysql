const mysql = require('../mysql/mysql');


// ===============================================
// Obtener todas las SubCategorías activas
// ===============================================
const getSubCategorias = async(req, resp) => {
    try {
        let tipoOperacion = 1;
        let estado = (req.params.estado > 0) ? req.params.estado : null; // si llega cero se obtienen todas las subcategorias
        let myParams = `null, null,${estado},${ tipoOperacion}`;
        await mysql.default.ejecutarQuery('call PA_SUBCATEGORIA_CONSULTAR(' + myParams + ')', (err, subcategorias) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error cargando Sub categorías',
                    errors: err
                });
            }

            resp.json({
                ok: true,
                subcategorias: subcategorias[0]
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
// Obtener las SubCategorías por idCategoria
// ===============================================
const consultaSubCatxidCategoria = async(req, resp) => {
    try {
        let tipoOperacion = 1;
        let idCategoria = req.params.id;
        let estado = (req.params.estado > 0) ? req.params.estado : null; // si llega cero se obtienen todas las subcategorias
        let myParams = `null,${idCategoria},${estado},${ tipoOperacion}`;
        await mysql.default.ejecutarQuery('call PA_SUBCATEGORIA_CONSULTAR(' + myParams + ')', (err, subcategorias) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error cargando Sub categorías',
                    errors: err
                });
            }

            resp.json({
                ok: true,
                subcategorias: subcategorias[0]
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
// Crear una SubCategoría
// ===============================================
const crearSubCategoria = async(req, resp) => {
    try {
        let tipoOperacion = 1;
        let nombre = (req.body.nombre).toUpperCase();
        let descripcion = (req.body.descripcion).toUpperCase();
        let idCategoria = req.body.idCategoria;
        let myParams = `'${nombre}', '${descripcion}',${idCategoria},${tipoOperacion},@Resultado`;
        await mysql.default.ejecutarQuery('call PA_SUBCATEGORIA_INSERTAR(' + myParams + ')', (err, subcategorias) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error creando Sub categoría',
                    errors: err
                });
            }
            resp.json({
                ok: true,
                subcategorias: subcategorias.affectedRows
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
const actualizarSubCategoria = async(req, resp) => {
    let idSubCategoria = req.params.id;
    let nombre = (req.body.nombre).toUpperCase();
    let descripcion = (req.body.descripcion).toUpperCase();
    let idCategoria = req.body.idCategoria;
    let estado = req.body.estado;
    try {

        consultarSubCategoriaxId(idSubCategoria, (subcategoriaDB) => {
            if (!subcategoriaDB) {
                return resp.status(404).json({
                    ok: true,
                    msg: 'No existe una sub categoría con ese id',
                });
            }
            let tipoOperacion = 1;
            let myParams = `${ idSubCategoria },'${nombre}','${descripcion}',${ idCategoria },${estado}, ${tipoOperacion},@Resultado`;
            let query = 'call PA_SUBCATEGORIA_ACTUALIZAR(' + myParams + ')';
            mysql.default.ejecutarQuery(query, (err, categoriaActualizada) => {
                if (err) {
                    return resp.status(400).json({
                        ok: false,
                        msg: 'Error al actualizar sub categoría',
                        errors: err
                    });
                }
                resp.json({
                    ok: true,
                    msg: 'Sub categoria actualizada'
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
// Eliminar una SubCategoría
// ===============================================
const eliminarSubCategoria = async(req, resp) => {
    let idSubCategoria = req.params.id;
    try {
        consultarSubCategoriaxId(idSubCategoria, (subcategoriaDB) => {
            if (!subcategoriaDB) {
                return resp.status(404).json({
                    ok: true,
                    msg: 'No existe una sub categoría con ese id',
                });
            }

            let tipoOperacion = 1;
            let myParams = `${ idSubCategoria },null,null,null,0,${tipoOperacion},@Resultado`;
            let query = 'call PA_SUBCATEGORIA_ACTUALIZAR(' + myParams + ')';
            mysql.default.ejecutarQuery(query, (err, subcategoriaActualizada) => {
                if (err) {
                    return resp.status(400).json({
                        ok: false,
                        msg: 'Error al eliminar sub categoría',
                        errors: err
                    });
                }
                resp.json({
                    ok: true,
                    msg: ' Sub ategoria eliminada'
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

const consultarSubCategoriaxId = async(id, callback) => {
    let tipoOperacion = 1;
    let myParams = `${id},null,null,${tipoOperacion}`;
    await mysql.default.ejecutarQuery('call PA_SUBCATEGORIA_CONSULTAR(' + myParams + ')', (err, subcategoriaBD) => {
        callback(subcategoriaBD);
    });
};

module.exports = {
    getSubCategorias,
    consultaSubCatxidCategoria,
    crearSubCategoria,
    actualizarSubCategoria,
    eliminarSubCategoria
};