const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getSubCategorias, crearSubCategoria, actualizarSubCategoria, eliminarSubCategoria, consultaSubCatxidCategoria } = require('../controllers/subcategorias');
const { validarJWT, validarADMIN_ROLE } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:estado', [validarJWT, validarADMIN_ROLE], getSubCategorias);

router.get('/:id/:estado', [validarJWT, validarADMIN_ROLE], consultaSubCatxidCategoria);

router.post('/', [
    validarJWT,
    validarADMIN_ROLE,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('idCategoria', 'El id Categoria es obligatorio').not().isEmpty(),
    validarCampos
], crearSubCategoria);

router.put('/:id', [
    validarJWT,
    validarADMIN_ROLE,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('idCategoria', 'El id Categoria es obligatorio').not().isEmpty(),
    check('estado', 'El estado es obligatorio').not().isEmpty(),
    validarCampos
], actualizarSubCategoria);

router.delete('/:id', [validarJWT, validarADMIN_ROLE], eliminarSubCategoria);



module.exports = router;