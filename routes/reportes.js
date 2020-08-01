const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarADMIN_ROLE } = require('../middlewares/validar-jwt');

const { getReporte, getInventario } = require('../controllers/reportes');

const router = Router();



router.get('/', [validarJWT, validarADMIN_ROLE], getInventario);

router.post('/', [
    validarJWT,
    check('fechaInicial', 'La fechaInicio es obligatoria').not().isEmpty(),
    check('fechaFinal', 'La fechaFin es obligatoria').not().isEmpty(),
    validarCampos
], getReporte);




module.exports = router;