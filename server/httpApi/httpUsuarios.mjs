import { libUsuarios } from "../appLib/libUsuarios.mjs";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticFilesPath = path.join(__dirname, '../../browser');

class HttpUsuarios {
    async getApp(req, res) {
        try {
            if (req.cookies.recordar) {
                    res.sendFile(path.join(staticFilesPath, 'pages/turnos/turnos.html'));
            } else {
                res.sendFile(path.join(staticFilesPath, 'pages/login/login.html'));
            }
        } catch (error) {
            console.error('Error al procesar la acción de turno:', error);
            res.status(500).send('Error al conectar con la base de datos');
        }
    }

    async postLogin(req, res) {
        const correo = req.body.correo;
        const contrasena = req.body.contrasena;
        const recordar = req.body.recordar;
        try {
            const resultadoValidacion = await libUsuarios.validarCredenciales(correo, contrasena);
            const usuario = resultadoValidacion.usuario;

            if (resultadoValidacion.valido) {
                const tresMeses = 90 * 24 * 60 * 60 * 1000;

                if (recordar) {
                    res.cookie('recordar', true, { maxAge: tresMeses, httpOnly: true });
                }

                res.cookie('idUsuario', usuario.idUsuario, { maxAge: tresMeses, httpOnly: true });
                res.sendFile(path.join(staticFilesPath, 'pages/turnos/turnos.html'));
            }
        } catch (error) {
            console.error('Error al validar credenciales:', error);
            // Si hay un error, muestra un mensaje de error y vuelve atrás
            res.redirect('back');
        }
    }

    async  postObtenerDatosUsuario(req, res) {
        try {
            const idUsuario = req.cookies.idUsuario;
            const usuario = await libUsuarios.obtenerUsuario(idUsuario);
            const ultimaHoraRegistro = await libUsuarios.obtenerUltimaHoraRegistro(idUsuario);
            return { usuario, ultimaHoraRegistro };
        } catch (err) {
            console.error('Error al obtener datos del usuario:', err);
            throw err; 
        }
    }
    
    
    async postIniciarTurno(req, res) {
        try {
            let posible = false;
            const accion = req.body.accion;
            const idUsuario = req.cookies.idUsuario;
            const usuario = await libUsuarios.obtenerUsuario(idUsuario);

            if (accion == "iniciar_jornada") {
                if (usuario.estadoTurno == "Finalizado") {
                    posible = true;
                }else{
                    console.log("Ocurre el error "+usuario.estadoTurno); 
                }
            }

            if (posible) {
                await libUsuarios.insertarEstadoUsuario(accion, idUsuario)
                return true;
            }
            return false;

        } catch (err) {
            console.error('Error al procesar la acción de turno:', err);
            res.status(500).send('Error al procesar la acción de turno');
            return false;

        }
    }

    async postFinalizarTurno(req, res) {
        try {
            let posible = false;
            const accion = req.body.accion;
            const idUsuario = req.cookies.idUsuario;
            const usuario = await libUsuarios.obtenerUsuario(idUsuario);

            if (accion == "finalizar_jornada") {
                if (usuario.estadoTurno == "Iniciado" || usuario.estadoTurno == "Pausado"|| usuario.estadoTurno == "Reanudado") {
                    posible = true;
                }else{
                    console.log("Ocurre el error "+usuario.estadoTurno); 
                }
            }

            if (posible) {
                await libUsuarios.insertarEstadoUsuario(accion, idUsuario)
                return true;
            }
            return false;

        } catch (err) {
            console.error('Error al procesar la acción de turno:', err);
            res.status(500).send('Error al procesar la acción de turno');
            return false;

        }

    }

    async postReanudarTurno(req, res) {
        try {
            let posible = false;
            const accion = req.body.accion;
            const idUsuario = req.cookies.idUsuario;
            const usuario = await libUsuarios.obtenerUsuario(idUsuario);

            if (accion == "reanudar_jornada") {
                if (usuario.estadoTurno == "Pausado") {
                    posible = true;
                }else{
                    console.log("Ocurre el error "+usuario.estadoTurno); 
                }
            }

            if (posible) {
                await libUsuarios.insertarEstadoUsuario(accion, idUsuario)
                return true;
            }
            return false;

        } catch (err) {
            console.error('Error al procesar la acción de turno:', err);
            res.status(500).send('Error al procesar la acción de turno');
            return false;

        }
    }

    async postPausarTurno(req, res) {
        try {
            let posible = false;
            const accion = req.body.accion;
            const idUsuario = req.cookies.idUsuario;
            const usuario = await libUsuarios.obtenerUsuario(idUsuario);

            if (accion == "pausar_jornada") {
                if (usuario.estadoTurno == "Iniciado" || usuario.estadoTurno == "Reanudado") {
                    posible = true;
                }else{
                    console.log("Ocurre el error "+usuario.estadoTurno); 
                }
            }

            if (posible) {
                await libUsuarios.insertarEstadoUsuario(accion, idUsuario)
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error al procesar la acción de turno:', err);
            res.status(500).send('Error al procesar la acción de turno');
            return false;

        }
    }

    async cerrarSesion(req, res) {
        try {
            res.clearCookie('idUsuario');
            res.clearCookie('recordar');

            res.redirect('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            res.status(500).send('Error al cerrar sesión');
        }
    }


}

export default new HttpUsuarios();


