import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser'; 
import path from 'path';
import { fileURLToPath } from 'url'; 
import httpUsuarios from './server/httpApi/httpUsuarios.mjs';
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

const app = express();


app.use(express.static(path.join(__dirname, '/browser')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/', httpUsuarios.getApp);

app.post('/login', httpUsuarios.postLogin);


app.post('/obtener_datos_usuario', async (req, res) => {
    try {
        const resultado = await httpUsuarios.postObtenerDatosUsuario(req, res);
        res.json({ success: true, data: resultado }); 
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        res.status(500).json({ success: false, error: 'Error al obtener datos del usuario' });
    }
});

app.post('/iniciar_turno', (req, res) => {
    const resultado = httpUsuarios.postIniciarTurno(req, res);
    res.json({ success: resultado });
});
app.post('/finalizar_turno', (req, res) => {
    const resultado = httpUsuarios.postFinalizarTurno(req, res);
    res.json({ success: resultado });
});

app.post('/pausar_turno', (req, res) => {
    const resultado = httpUsuarios.postPausarTurno(req, res);
    res.json({ success: resultado });
});

app.post('/reanudar_turno', (req, res) => {
    const resultado =  httpUsuarios.postReanudarTurno(req, res);
    res.json({ success: resultado });
});


app.post('/cerrarSesion', httpUsuarios.cerrarSesion);


app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
