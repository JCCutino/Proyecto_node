import { libUsuarios } from "../appLib/libUsuarios.mjs";


class HttpUsuarios {
    async getApp(req, res) {
        try {
            if (req.cookies.recordar) {
                const idUsuario = req.cookies.idUsuario;

                const usuario = await libUsuarios.obtenerUsuario(idUsuario);
                const ultimaHoraRegistro = await libUsuarios.obtenerUltimaHoraRegistro(idUsuario);

                if (usuario.estadoTurno == "Iniciado" || usuario.estadoTurno == "Reanudado") {
                    res.render("turnoIniciado", { usuario, ultimaHoraRegistro });
                } else if (usuario.estadoTurno == "Finalizado") {
                    res.render("turnoFinalizado", { usuario, ultimaHoraRegistro });
                } else if (usuario.estadoTurno == "Pausado") {
                    res.render("turnoPausado", { usuario, ultimaHoraRegistro });
                }

            } else {
                res.render('index');
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
            const ultimaHoraRegistro = await libUsuarios.obtenerUltimaHoraRegistro(usuario.idUsuario);

            if (resultadoValidacion.valido) {
                const tresMeses = 90 * 24 * 60 * 60 * 1000;

                if (recordar) {
                    res.cookie('recordar', true, { maxAge: tresMeses, httpOnly: true });
                }

                res.cookie('idUsuario', usuario.idUsuario, { maxAge: tresMeses, httpOnly: true });


                if (usuario.estadoTurno == "Iniciado" || usuario.estadoTurno == "Reanudado") {
                    res.render("turnoIniciado", { usuario, ultimaHoraRegistro });
                } else if (usuario.estadoTurno == "Finalizado") {
                    res.render("turnoFinalizado", { usuario, ultimaHoraRegistro });
                } else if (usuario.estadoTurno == "Pausado") {
                    res.render("turnoPausado", { usuario, ultimaHoraRegistro });
                }
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
            console.log(accion);
            const idUsuario = req.cookies.idUsuario;
            const usuario = await libUsuarios.obtenerUsuario(idUsuario);

            if (accion == "iniciar_jornada") {
                if (usuario.estadoTurno == "Finalizado") {
                    posible = true;
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
            console.log(accion);
            const idUsuario = req.cookies.idUsuario;
            const usuario = await libUsuarios.obtenerUsuario(idUsuario);

            if (accion == "finalizar_jornada") {
                if (usuario.estadoTurno == "Iniciado" || usuario.estadoTurno == "Pausado") {
                    posible = true;
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
            console.log(accion);
            const idUsuario = req.cookies.idUsuario;
            const usuario = await libUsuarios.obtenerUsuario(idUsuario);

            if (accion == "reanudar_jornada") {
                if (usuario.estadoTurno == "Pausado") {
                    posible = true;
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


