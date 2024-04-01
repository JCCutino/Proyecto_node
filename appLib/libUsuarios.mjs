import {dbController} from "./dbController.mjs";

class LibUsuarios {

     validarCredenciales(correo, contrasena) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await dbController.conectarDB();; // Establecer conexión a la base de datos
    
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

    obtenerUsuario(idUsuario){
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await dbController.conectarDB(); 
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

        insertarEstadoUsuario(accion, idUsuario) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await dbController.conectarDB(); 
    
                let insertarTurno;
    
                if (accion === "iniciar_jornada") {
                    insertarTurno = "INSERT INTO Turno (estadoTurno, idUsuario) VALUES ('Iniciado', ?)";
                } else if (accion === "finalizar_jornada") {
                    insertarTurno = "INSERT INTO Turno (estadoTurno, idUsuario) VALUES ('Finalizado', ?)";
                } else if (accion === "reanudar_jornada") {
                    insertarTurno = "INSERT INTO Turno (estadoTurno, idUsuario) VALUES ('Reanudado', ?)";
                } else if (accion === "pausar_jornada") {
                    insertarTurno = "INSERT INTO Turno (estadoTurno, idUsuario) VALUES ('Pausado', ?)";
                }
    
                connection.query(insertarTurno, [idUsuario], (err, result) => {
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
    
    

}


 export const libUsuarios = new LibUsuarios();

