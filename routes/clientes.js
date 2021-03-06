const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getClientes, crearCliente, actualizarCliente, getClientexNumDocumento } = require('../controllers/clientes');
const { validarJWT, validarADMIN_ROLE } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJWT], getClientes);

router.get('/:numDocumento', [validarJWT], getClientexNumDocumento);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('idTipoDocumento', 'El id TipoDocumento es obligatorio').not().isEmpty(),
    check('numeroDocumento', 'El número de documento  es obligatorio').not().isEmpty(),
    check('telefono', 'El Teléfono es obligatorio').not().isEmpty(),
    validarCampos
], crearCliente);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('idTipoDocumento', 'El id TipoDocumento es obligatorio').not().isEmpty(),
    check('numeroDocumento', 'El nnúmero de documento  es obligatorio').not().isEmpty(),
    check('telefono', 'El Teléfono es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCliente);

// router.delete('/:id', [validarJWT, validarADMIN_ROLE], eliminarSubCategoria);



module.exports = router;