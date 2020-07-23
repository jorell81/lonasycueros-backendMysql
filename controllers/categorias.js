const mysql = require('../mysql/mysql');


// ===============================================
// Obtener todas las categorías activas
// ===============================================
const getCategorias = async(req, resp) => {
    try {
        let tipoOperacion = 1;
        let estado = (req.params.estado > 0) ? req.params.estado : null;
        let myParams = `null,${estado},${ tipoOperacion}`;
        await mysql.default.ejecutarQuery('call PA_CATEGORIA_CONSULTAR(' + myParams + ')', (err, categorias) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error cargando categorías',
                    errors: err
                });
            }

            resp.json({
                ok: true,
                categorias: categorias[0]
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
// Crear una Categoría
// ===============================================
const crearCategoria = async(req, resp) => {
    try {
        let tipoOperacion = 1;
        let nombre = (req.body.nombre).toUpperCase();
        let descripcion = (req.body.descripcion).toUpperCase();
        let myParams = `'${nombre}', '${descripcion}',${tipoOperacion},@Resultado`;
        await mysql.default.ejecutarQuery('call PA_CATEGORIA_INSERTAR(' + myParams + ')', (err, categorias) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error creando categoría',
                    errors: err
                });
            }
            resp.json({
                ok: true,
                categorias: categorias.affectedRows
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
// Actualizar una Categoría
// ===============================================
const actualizarCategoria = async(req, resp) => {
    let idCategoria = req.params.id;
    let nombre = (req.body.nombre).toUpperCase();
    let descripcion = (req.body.descripcion).toUpperCase();
    let estado = req.body.estado;

    try {

        consultarCategoriaxId(idCategoria, async(categoriaDB) => {
            if (!categoriaDB) {
                return resp.status(404).json({
                    ok: true,
                    msg: 'No existe una categoría con ese id',
                });
            }
            let tipoOperacion = 1;
            let myParams = `${ idCategoria },'${nombre}','${descripcion}',${estado}, ${tipoOperacion},@Resultado`;
            let query = 'call PA_CATEGORIA_ACTUALIZAR(' + myParams + ')';
            await mysql.default.ejecutarQuery(query, (err, categoriaActualizada) => {
                if (err) {
                    return resp.status(400).json({
                        ok: false,
                        msg: 'Error al actualizar categoría',
                        errors: err
                    });
                }
                resp.json({
                    ok: true,
                    msg: 'Categoria actualizada'
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
// Eliminar una Categoría
// ===============================================
const eliminarCategoria = async(req, resp) => {
    let idCategoria = req.params.id;
    try {
        consultarCategoriaxId(idCategoria, async(categoriaDB) => {
            if (!categoriaDB) {
                return resp.status(404).json({
                    ok: true,
                    msg: 'No existe una categoría con ese id',
                });
            }

            let tipoOperacion = 1;
            let myParams = `${ idCategoria },null,null,0,${tipoOperacion},@Resultado`;
            let query = 'call PA_CATEGORIA_ACTUALIZAR(' + myParams + ')';
            await mysql.default.ejecutarQuery(query, (err, categoriaActualizada) => {
                if (err) {
                    return resp.status(400).json({
                        ok: false,
                        msg: 'Error al eliminar categoría',
                        errors: err
                    });
                }
                resp.json({
                    ok: true,
                    msg: 'Categoria eliminada'
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

const consultarCategoriaxId = async(id, callback) => {
    let tipoOperacion = 1;
    let myParams = `${id}, null,${tipoOperacion}`;
    await mysql.default.ejecutarQuery('call PA_CATEGORIA_CONSULTAR(' + myParams + ')', (err, categoriaBD) => {
        callback(categoriaBD);
    });
};

module.exports = {
    getCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};