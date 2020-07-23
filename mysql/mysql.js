const mysql = require("mysql");
class MySQL {
    constructor() {
        this.conectado = false;
        // console.log('Clase inicializada');
        this.cnn = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Clave123+.',
            database: 'lonasycueros',
            multipleStatements: true
        });
        this.conectarDB();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    static ejecutarQuery(query, callback) {
        this.instance.cnn.query(query, (err, results, fields) => {
            if (err) {
                return callback(err);
            }
            if (results.length === 0) {
                callback('El registro solicitado no existe');
            } else {
                callback(null, results);
            }
        });
    }
    conectarDB() {
        this.cnn.connect((err) => {
            if (err) {
                console.log(err.message);
            }
            this.conectado = true;
            console.log('Base de datos Mysql: \x1b[32m%s\x1b[0m', 'online');
        });
    }
}
exports.default = MySQL;