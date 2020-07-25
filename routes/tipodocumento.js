const { Router } = require('express');
const { validarJWT, validarADMIN_ROLE } = require('../middlewares/validar-jwt');

const { getTipoDocumento } = require('../controllers/tipoDocumento');

const router = Router();


router.get('/', [validarJWT, validarADMIN_ROLE], getTipoDocumento);



module.exports = router;