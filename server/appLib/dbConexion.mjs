import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();
class DbConexion {

 conectarDB() {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });

        connection.connect(err => {
            if (err) {
                console.error('Error al conectar a la base de datos:', err);
                reject('Error al conectar a la base de datos');
            } else {
                resolve(connection); // Resuelve la promesa con la conexión establecida
            }
        });
    });
}
}

export const dbConexion = new DbConexion();
