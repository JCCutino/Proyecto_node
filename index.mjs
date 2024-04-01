import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;
import httpUsuarios from './httpApi/httpUsuarios.mjs';
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views','./views/')
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', httpUsuarios.getApp)

app.post('/login', httpUsuarios.postLogin);

app.post('/acciones_turno', (req, res) => {
    httpUsuarios.postAccionTurno(req, res);
});

app.post('/cerrarSesion', httpUsuarios.cerrarSesion);


    
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
