const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { validarJWT, validarADMIN_ROLE } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:estado', [validarJWT, validarADMIN_ROLE], getCategorias);

router.post('/', [
    validarJWT,
    validarADMIN_ROLE,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    validarCampos
], crearCategoria);

router.put('/:id', [
    validarJWT,
    validarADMIN_ROLE,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('estado', 'El estado es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

router.delete('/:id', [validarJWT, validarADMIN_ROLE], eliminarCategoria);



module.exports = router;