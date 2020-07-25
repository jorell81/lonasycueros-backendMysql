const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getDescuentos, crearDescuento, actualizarDescuento, crearDescuentoTodos } = require('../controllers/descuentos');
const { validarJWT, validarADMIN_ROLE } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJWT, validarADMIN_ROLE], getDescuentos);

router.post('/', [
    validarJWT,
    validarADMIN_ROLE,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('fechaInicio', 'La fechaInicio es obligatoria').not().isEmpty(),
    check('fechaFin', 'La fechaFin es obligatoria').not().isEmpty(),
    check('valorDescuento', 'El valorDescuento es obligatorio').not().isEmpty(),
    check('idProducto', 'El idProducto es obligatorio').not().isEmpty(),
    validarCampos
], crearDescuento);

router.post('/todos', [
    validarJWT,
    validarADMIN_ROLE,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('fechaInicio', 'La fechaInicio es obligatoria').not().isEmpty(),
    check('fechaFin', 'La fechaFin es obligatoria').not().isEmpty(),
    check('valorDescuento', 'El valorDescuento es obligatorio').not().isEmpty(),
    validarCampos
], crearDescuentoTodos);

router.put('/:id', [
    validarJWT,
    validarADMIN_ROLE,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('fechaInicio', 'La fechaInicio es obligatoria').not().isEmpty(),
    check('fechaFin', 'La fechaFin es obligatoria').not().isEmpty(),
    check('valorDescuento', 'El valorDescuento es obligatorio').not().isEmpty(),
    check('idProducto', 'El idProducto es obligatorio').not().isEmpty(),
    validarCampos
], actualizarDescuento);

// router.delete('/:id', [validarJWT, validarADMIN_ROLE], eliminarSubCategoria);



module.exports = router;