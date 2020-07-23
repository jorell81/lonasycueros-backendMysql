const jwt = require('jsonwebtoken');
const { consultarUsuarioxId } = require('../controllers/usuarios');

const validarJWT = (req, resp, next) => {

    //Leer token
    const token = req.header('Bearer');
    if (!token) {
        return resp.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { idUsuario } = jwt.verify(token, process.env.JWT_SECRET);
        req.idUsuario = idUsuario; // Pasar el idUsuario al controlador de usuario
        next();
    } catch (error) {
        return resp.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

};

const validarADMIN_ROLE = async(req, resp, next) => {

    const idUsuario = req.idUsuario;

    try {

        await consultarUsuarioxId(idUsuario, (usuarioDB) => {
            if (!usuarioDB) {
                return resp.status(404).json({
                    ok: false,
                    msg: 'Usuario no existe'
                });
            }
            let usuario = JSON.parse(JSON.stringify(usuarioDB));
            if (usuario[0].rol !== 'ADMIN_ROLE') {
                return resp.status(403).json({
                    ok: false,
                    msg: 'No tiene privilegios para esta acción'
                });
            }
            next();


        });

    } catch (error) {
        return resp.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador'
        });
    }

};

const validarADMIN_ROLE_o_MismoUsuario = async(req, resp, next) => {

    const idUsuario = req.idUsuario;
    const id = req.params.id;

    try {


        await consultarUsuarioxId(idUsuario, (usuarioDB) => {
            if (!usuarioDB) {
                return resp.status(404).json({
                    ok: false,
                    msg: 'Usuario no existe'
                });
            }
            let usuario = JSON.parse(JSON.stringify(usuarioDB));
            if (usuario[0].rol === 'ADMIN_ROLE' || idUsuario == id) {
                next();
            } else {
                return resp.status(403).json({
                    ok: false,
                    msg: 'No tiene privilegios para esta acción'
                });
            }


        });

    } catch (error) {
        return resp.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador'
        });
    }

};


module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
};