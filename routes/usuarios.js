const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getUsuarios, crearUsuario, actualizarUsuario, EliminarUsuario, getUsuarioxEmail } = require('../controllers/usuarios');
const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();



router.get('/', [validarJWT], getUsuarios);

router.get('/:email', [validarJWT], getUsuarioxEmail);

router.post('/', [
    validarJWT,
    validarADMIN_ROLE,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('contrasena', 'La contraseña es obligatoria').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('rol', 'El rol es obligatorio').not().isEmpty(),
    validarCampos
], crearUsuario);

router.put('/:id/:cc', [
    validarJWT,
    validarADMIN_ROLE_o_MismoUsuario,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('rol', 'El rol es obligatorio').not().isEmpty(),
    check('estado', 'El estado es obligatorio').not().isEmpty(),
    validarCampos
], actualizarUsuario);

router.delete('/:id', [validarJWT, validarADMIN_ROLE], EliminarUsuario);




module.exports = router;