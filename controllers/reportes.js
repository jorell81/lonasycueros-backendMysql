const mysql = require('../mysql/mysql');


// ===============================================
// Obtener todos los Reportes
// ===============================================
const getReporte = async(req, resp) => {
    try {
        const { idUsuario, fechaInicial, fechaFinal } = req.body;
        let tipoOperacion = 1;
        let myParams = `${idUsuario},'${fechaInicial}','${fechaFinal}',${ tipoOperacion}`;
        await mysql.default.ejecutarQuery('call PA_REPORTES_CONSULTAR(' + myParams + ')', (err, reporte) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error cargando Reportes',
                    errors: err
                });
            }

            resp.json({
                ok: true,
                reporte: reporte[0]
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
// Obtener Inventario de productos
// ===============================================
const getInventario = async(req, resp) => {
    try {
        let tipoOperacion = 2;
        let myParams = `null,null,null,${ tipoOperacion}`;
        await mysql.default.ejecutarQuery('call PA_REPORTES_CONSULTAR(' + myParams + ')', (err, inventario) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error cargando Inventario',
                    errors: err
                });
            }

            resp.json({
                ok: true,
                inventario: inventario[0]
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
    getReporte,
    getInventario
};