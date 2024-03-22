const express = require('express');
const app = express();
const port = 3000;
const { obtenerUsuarios } = require('./controllers/prueba');
const { validarCredenciales } = require('./controllers/prueba');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views',__dirname+'/views/')
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) =>{

    res.render("index")
})

app.post('/login', async (req, res) => {
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;

    try {
        const resultadoValidacion = await validarCredenciales(correo, contrasena);
        const usuario = resultadoValidacion.usuario;
        if (resultadoValidacion) {
            // Si las credenciales son válidas, redirige al usuario a la página de datos
            res.render("datos", { usuario });
        } else {
            // Si las credenciales no son válidas, vuelve atrás
            res.redirect('back');
        }
    } catch (error) {
        console.error('Error al validar credenciales:', error);
        // Si hay un error, muestra un mensaje de error y vuelve atrás
        res.redirect('back');
    }
});



app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.send(usuarios); // Envía los datos de los usuarios como respuesta HTTP
    } catch (error) {
        res.status(500).send('Error al obtener usuarios de la base de datos');
    }
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
