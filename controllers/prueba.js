const mysql = require('mysql');

// Función para establecer la conexión a la base de datos
function conectarDB() {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'turnos_dev'
        });

        connection.connect(err => {
            if (err) {
                console.error('Error al conectar a la base de datos:', err);
                reject('Error al conectar a la base de datos');
            } else {
                console.log('Conexión a la base de datos MySQL establecida');
                resolve(connection); // Resuelve la promesa con la conexión establecida
            }
        });
    });
}

// Función para obtener usuarios
function obtenerUsuarios() {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await conectarDB(); // Establecer conexión a la base de datos
            connection.query('SELECT * FROM Usuario', (err, resultados) => {
                connection.end(); // Cierra la conexión después de la consulta
                if (err) {
                    console.error('Error al obtener usuarios:', err);
                    reject('Error al obtener usuarios');
                } else {
                    resolve(resultados); // Resuelve la promesa con los resultados de la consulta
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}
function validarCredenciales(correo, contrasena) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await conectarDB();; // Establecer conexión a la base de datos

            const consultaUsuario = `SELECT * FROM Usuario WHERE correoElectronico = ?`;
            connection.query(consultaUsuario, [correo], (err, resultados) => {
                if (err) {
                    connection.end();
                    reject(err);
                } else {
                    if (resultados.length === 0) {
                        connection.end();
                        resolve(false); // Correo no encontrado
                    } else {
                        const usuario = resultados[0];
                        if (usuario.contrasena !== contrasena) {
                            connection.end();
                            resolve(false); // Contraseña incorrecta
                        } else {
                            connection.end();
                            resolve({valido: true, usuario}); // Credenciales válidas
                        }
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}


module.exports = { conectarDB, obtenerUsuarios, validarCredenciales};
