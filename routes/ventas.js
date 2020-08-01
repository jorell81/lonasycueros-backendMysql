const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { crearVenta } = require('../controllers/ventas');

const router = Router();


router.post('/', [
    validarJWT,
    // Venta
    check('idCliente', 'El genero es obligatorio').not().isEmpty(),
    check('idUsuario', 'El idSubCategoria es obligatorio').not().isEmpty(),
    check('valorTotalVenta', 'El idCategoria es obligatorio').not().isEmpty(),
    // DetalleVenta
    check('detalleVenta', 'El idCategoria es obligatorio').not().isEmpty(),
    validarCampos
], crearVenta);



module.exports = router;