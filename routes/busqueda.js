const { Router } = require('express');
const { validarJWT, validarADMIN_ROLE } = require('../middlewares/validar-jwt');
const { busqueda } = require('../controllers/busqueda');

const router = Router();

router.get('/:tabla/:busqueda', [validarJWT, validarADMIN_ROLE], busqueda);


module.exports = router;