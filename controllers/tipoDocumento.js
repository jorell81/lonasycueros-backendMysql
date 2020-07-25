const mysql = require('../mysql/mysql');


// ===============================================
// Obtener todos los Tipos de Documentos
// ===============================================
const getTipoDocumento = async(req, resp) => {
    try {
        let tipoOperacion = 1;
        let myParams = `null,${ tipoOperacion}`;
        await mysql.default.ejecutarQuery('call PA_TIPODOCUMENTO_CONSULTAR(' + myParams + ')', (err, tipoDocumento) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error cargando Tipos de documento',
                    errors: err
                });
            }

            resp.json({
                ok: true,
                tipoDocumentos: tipoDocumento[0]
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


module.exports = {
    getTipoDocumento
};