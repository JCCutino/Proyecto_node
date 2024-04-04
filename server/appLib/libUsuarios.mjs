import { dbConexion } from "./dbConexion.mjs";

class LibUsuarios {

    validarCredenciales(correo, contrasena) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await dbConexion.conectarDB(); // Establecer conexión a la base de datos

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
                                resolve({ valido: true, usuario }); // Credenciales válidas
                            }
                        }
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    obtenerUsuario(idUsuario) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await dbConexion.conectarDB();
                connection.query('SELECT * FROM Usuario WHERE idUsuario =?', [idUsuario], (err, resultados) => {
                    connection.end();
                    if (err) {
                        console.error('Error al obtener usuarios:', err);
                        reject('Error al obtener usuarios');
                    } else {
                        if (resultados.length === 0) {
                            reject('Usuario no encontrado'); // Rechaza la promesa si no se encuentra ningún usuario con el ID dado
                        } else {
                            resolve(resultados[0]); // Resuelve la promesa con el primer usuario encontrado
                        }
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    insertarEstadoIniciadoUsuario(idUsuario) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await dbConexion.conectarDB();
                let insertarTurnoFinalizado = "INSERT INTO Turno (estadoTurno, idUsuario) VALUES ('Iniciado', ?)";

                connection.query(insertarTurnoFinalizado, [idUsuario], (err, result) => {
                    connection.end();
                    if (err) {
                        console.error('Error al actualizar el estadoTurno del usuario:', err);
                        reject('Error al actualizar el estadoTurno del usuario');
                    } else {
                        resolve(true);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    insertarEstadoFinalizadoUsuario(idUsuario) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await dbConexion.conectarDB();
                let insertarTurnoFinalizado = "INSERT INTO Turno (estadoTurno, idUsuario) VALUES ('Finalizado', ?)";

                connection.query(insertarTurnoFinalizado, [idUsuario], (err, result) => {
                    connection.end();
                    if (err) {
                        console.error('Error al actualizar el estadoTurno del usuario:', err);
                        reject('Error al actualizar el estadoTurno del usuario');
                    } else {
                        resolve(true);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    insertarEstadoPausadoUsuario(idUsuario) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await dbConexion.conectarDB();
                let insertarTurnoFinalizado = "INSERT INTO Turno (estadoTurno, idUsuario) VALUES ('Pausado', ?)";

                connection.query(insertarTurnoFinalizado, [idUsuario], (err, result) => {
                    connection.end();
                    if (err) {
                        console.error('Error al actualizar el estadoTurno del usuario:', err);
                        reject('Error al actualizar el estadoTurno del usuario');
                    } else {
                        resolve(true);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    insertarEstadoReanudadoUsuario(idUsuario) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await dbConexion.conectarDB();
                let insertarTurnoFinalizado = "INSERT INTO Turno (estadoTurno, idUsuario) VALUES ('Reanudado', ?)";

                connection.query(insertarTurnoFinalizado, [idUsuario], (err, result) => {
                    connection.end();
                    if (err) {
                        console.error('Error al actualizar el estadoTurno del usuario:', err);
                        reject('Error al actualizar el estadoTurno del usuario');
                    } else {
                        resolve(true);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    obtenerUltimaHoraRegistro(idUsuario) {
        const consulta = `SELECT MAX(horaRegistroGMT) AS ultima_hora FROM turno WHERE idUsuario = ?`;

        return new Promise(async (resolve, reject) => {
            const connection = await dbConexion.conectarDB();
            connection.query(consulta, [idUsuario], (err, resultados) => {
                if (err) {
                    console.error('Error al obtener la última hora de registro:', err);
                    reject('Error al obtener la última hora de registro');
                } else {
                    if (resultados.length > 0) {
                        const ultima_hora = resultados[0].ultima_hora;
                        const hora_utc = new Date(ultima_hora);

                        resolve(hora_utc);
                    } else {
                        resolve("No se encontraron registros para este usuario.");
                    }
                }
            });
        });
    }



}


export const libUsuarios = new LibUsuarios();

