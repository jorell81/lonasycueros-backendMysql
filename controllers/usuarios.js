const mysql = require('../mysql/mysql');
const bcrypt = require('bcryptjs');
// const { generarJWT } = require('../helpers/jwt');

// ===============================================
// Obtener todos los usuarios
// ===============================================
const getUsuarios = async(req, resp) => {

    try {
        let tipoOperacion = 2;
        let myParams = `null, null, null, ${ tipoOperacion}`;
        mysql.default.ejecutarQuery('call PA_USUARIO_CONSULTAR(' + myParams + ')', (err, usuarios) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    msg: 'Error cargando usuarios',
                    errors: err
                });
            }

            resp.json({
                ok: true,
                usuarios: usuarios[0]
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

// ===============================================
// Crear un nuevo usuario
// ===============================================
const crearUsuario = async(req, resp) => {

    const { nombre, apellido, email, contrasena, rol } = req.body;
    let tipoOperacion = 1;
    let nombreBD = nombre.toUpperCase();
    let apellidoBD = apellido.toUpperCase();
    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    password = bcrypt.hashSync(contrasena, salt);
    let myParams = `'${ nombreBD }' , '${ apellidoBD }' ,  '${ email }' ,  '${ password }', '${ rol }', ${ tipoOperacion } , @Resultado`;


    try {
        mysql.default.ejecutarQuery('call PA_USUARIO_INSERTAR(' + myParams + ')', (err, usuarioGuardado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    msg: 'Error al crear usuario',
                    errors: err
                });
            }
            // const token = await generarJWT(usuarioGuardado[0][0].idUsuario);
            resp.json({
                ok: true,
                msg: 'Usuario creado'
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

// ===============================================
// Actualizar un usuario
// ===============================================
const actualizarUsuario = async(req, resp) => {

    const idUsuario = req.params.id;
    const cc = req.params.cc;
    const campos = req.body;
    let nombreBD = (campos.nombre).toUpperCase();
    let apellidoBD = (campos.apellido).toUpperCase();
    let contrasena = (campos.contrasena === '' || campos.contrasena === undefined) ? null : campos.contrasena;
    if (!campos.rol) { campos.rol = null; }
    if (cc && contrasena !== null) {
        const salt = bcrypt.genSaltSync();
        password = bcrypt.hashSync(contrasena, salt);
    }
    let estado = campos.estado;

    try {

        consultarUsuarioxId(idUsuario, (usuarioDB) => {
            if (!usuarioDB) {
                return resp.status(404).json({
                    ok: true,
                    msg: 'No existe un usuario con ese id',
                });
            }
            let myParams = `${ idUsuario }, '${ nombreBD }', '${ apellidoBD }', '${ campos.email }', '${campos.contrasena}', '${ campos.rol }',${estado}, 1, @Resultado`;
            let query = 'call PA_USUARIO_ACTUALIZAR(' + myParams + ')';
            mysql.default.ejecutarQuery(query, (err, usuarioActualizado) => {
                if (err) {
                    return resp.status(400).json({
                        ok: false,
                        msg: 'Error al actualizar usuario',
                        errors: err
                    });
                }
                resp.json({
                    ok: true,
                    msg: 'Usuario actualizado'
                });
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

// ===============================================
// Eliminar un usuario
// ===============================================
const EliminarUsuario = async(req, resp) => {
    const idUsuario = req.params.id;

    try {
        consultarUsuarioxId(idUsuario, (usuarioDB) => {
            if (!usuarioDB) {
                return resp.status(404).json({
                    ok: true,
                    msg: 'No existe un usuario con ese id',
                });
            }
            let myParams = `${ idUsuario }, null, null, null, null, null,0, 1, @Resultado`;
            let query = 'call lonasycueros.PA_USUARIO_ACTUALIZAR(' + myParams + ')';
            mysql.default.ejecutarQuery(query, (err, usuarioBorrado) => {
                if (err) {
                    return resp.status(400).json({
                        ok: false,
                        msg: 'Error al actualizar usuario',
                        errors: err
                    });
                }
                resp.json({
                    ok: true,
                    msg: 'Usuario eliminado'
                });
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

const consultarUsuarioxId = (id, callback) => {
    let tipoOperacion = 3;
    let myParams = `${ id }, null, null, ${ tipoOperacion}`;
    mysql.default.ejecutarQuery('call PA_USUARIO_CONSULTAR(' + myParams + ')', (err, usuarioBD) => {
        callback(usuarioBD[0]);
    });
};

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    EliminarUsuario,
    consultarUsuarioxId
};