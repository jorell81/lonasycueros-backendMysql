const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getProductos, getProductoxCodigoBarras, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { validarJWT, validarADMIN_ROLE } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:estado', [validarJWT, validarADMIN_ROLE], getProductos);

router.get('/codigo/:codigo', [validarJWT], getProductoxCodigoBarras);



router.post('/', [
    validarJWT,
    validarADMIN_ROLE,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('marca', 'La marca es obligatoria').not().isEmpty(),
    check('valorEntrada', 'El valorEntrada es obligatorio').not().isEmpty(),
    check('valorSalida', 'El valorSalida es obligatorio').not().isEmpty(),
    check('talla', 'La talla es obligatoria').not().isEmpty(),
    check('color', 'El color es obligatorio').not().isEmpty(),
    check('bodega', 'La bodega obligatoria').not().isEmpty(),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('idSubCategoria', 'El idSubCategoria es obligatorio').not().isEmpty(),
    check('idCategoria', 'El idCategoria es obligatorio').not().isEmpty(),
    validarCampos
], crearProducto);

router.put('/:id', [
    validarJWT,
    validarADMIN_ROLE,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('marca', 'La marca es obligatoria').not().isEmpty(),
    check('valorEntrada', 'El valorEntrada es obligatorio').not().isEmpty(),
    check('valorSalida', 'El valorSalida es obligatorio').not().isEmpty(),
    check('talla', 'La talla es obligatoria').not().isEmpty(),
    check('color', 'El color es obligatorio').not().isEmpty(),
    check('bodega', 'La bodega obligatoria').not().isEmpty(),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('idSubCategoria', 'El idSubCategoria es obligatorio').not().isEmpty(),
    check('estado', 'El estado es obligatorio').not().isEmpty(),
    validarCampos
], actualizarProducto);

router.delete('/:id', [validarJWT, validarADMIN_ROLE], eliminarProducto);

module.exports = router;