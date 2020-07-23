const mysql = require('../mysql/mysql');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { getMenuUsuario } = require('../helpers/menu-usuario');
const { consultarUsuarioxId } = require('../controllers/usuarios');

const login = async(req, resp) => {

    const { email, contrasena } = req.body;

    try {

        let tipoOperacion = 1;
        let myParams = `null, '${ email }', null, ${ tipoOperacion}`;
        mysql.default.ejecutarQuery('call PA_USUARIO_CONSULTAR(' + myParams + ')', async(err, usuarioDB) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error cargando usuarios',
                    errors: err
                });
            }
            if (usuarioDB[0] <= 0) {
                return resp.status(404).json({
                    ok: false,
                    msg: 'Credenciales no validas - 1'
                });

            }

            //Generar el TOKEN - JWT
            const token = await generarJWT(usuarioDB[0][0].idUsuario);
            // Verificar credenciales
            const validContrasena = bcrypt.compareSync(contrasena, usuarioDB[0][0].contrasena);
            if (!validContrasena) {
                return resp.status(400).json({
                    ok: false,
                    msg: 'Credenciales no validas - 2'
                });
            }

            resp.json({
                ok: true,
                token: token,
                usuario: usuarioDB[0][0],
                menu: getMenuUsuario(usuarioDB[0][0].rol)
            });
        });
    } catch (error) {
        resp.status(500).json({
            ok: true,
            msg: 'Error inesperado en la BD.',
            error: error
        });
    }
};

const renewToken = async(req, resp) => {
    const idUsuario = req.idUsuario;

    //Generar el TOKEN - JWT
    const token = await generarJWT(idUsuario);

    await consultarUsuarioxId(idUsuario, (usuarioDB) => {
        if (!usuarioDB) {
            return resp.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        resp.json({
            ok: true,
            token: token,
            usuario: usuarioDB[0],
            menu: getMenuUsuario(usuarioDB[0].rol)
        });
    });
};

module.exports = {
    login,
    renewToken
};