const dbController = require('./dbController');

function validarCredenciales(correo, contrasena, callback) {
    const connection = dbController.conectarDB();
    const consultaUsuario = `SELECT * FROM Usuario WHERE correoElectronico = ?`;

    connection.query(consultaUsuario, [correo], (err, resultados) => {
        if (err) return callback(err);

        if (resultados.length === 0) {
            connection.end(); 
            return callback(null, false); 
        }

        const usuario = resultados[0];
        if (usuario.contrasena !== contrasena) {
            connection.end(); 
            return callback(null, false); 
        }

        connection.end(); 
        callback(null, true, usuario); 
    });
}

module.exports = { validarCredenciales };
