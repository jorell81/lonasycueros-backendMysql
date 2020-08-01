const mysql = require('../mysql/mysql');


// ===============================================
// Crear una venta
// ===============================================
const crearVenta = async(req, resp) => {
    try {
        const { idCliente, idUsuario, valorTotalVenta, detalleVenta } = req.body;
        let tipoOperacion = 1;
        let myParams = `${idCliente},${idUsuario},${valorTotalVenta},${ tipoOperacion},@Resultado`;
        await mysql.default.ejecutarQuery('set @Resultado = 0;call PA_VENTA_INSERTAR(' + myParams + ');select @Resultado;', (err, venta) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error creando venta',
                    errors: err
                });
            }
            let idInsertado = venta[2][0];
            let idVenta = idInsertado['@Resultado'];
            detalleVenta.forEach(dv => {
                let myParamsDetalle = `${dv.idProducto},${idVenta},${dv.descuento},${dv.iva},${dv.cantidad},${dv.subTotal},${tipoOperacion},@Resultado`;
                mysql.default.ejecutarQuery('set @Resultado = 0;call PA_DETALLEVENTA_INSERTAR(' + myParamsDetalle + ');select @Resultado;', (err, detalleVenta) => {
                    if (err) {
                        return resp.status(500).json({
                            ok: false,
                            msg: 'Error creando detalle de venta',
                            errors: err
                        });
                    }


                });
            });
            resp.json({
                ok: true,
                venta: idVenta
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
    crearVenta
};