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



module.exports = { conectarDB, obtenerUsuarios, validarCredenciales};
