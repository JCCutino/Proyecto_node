
const btnIniciarJornada = document.getElementById('btnIniciarJornada');
const btnFinalizarJornada = document.getElementById('btnFinalizarJornada');
const btnPausarJornada = document.getElementById('btnPausarJornada');
const btnReanudarJornada = document.getElementById('btnReanudarJornada');

obtenerDatosUsuario();

async function llamadaAPI(funcion, accion) {
    try {
        const response = await fetch('/' + funcion, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accion: accion })
        });
        if (response.ok) {
            const data = await response.json();
        } else {
            console.error('Error al enviar la acción:', response.statusText);
        }
    } catch (error) {
        console.error('Error al enviar la acción:', error.message);
    }
}

async function obtenerDatosUsuario() {
    try {
        const response = await fetch('/obtener_datos_usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Esta es la respuesta del servidor:', data.data.usuario.nombreCompleto);
           
            if (data && data.data.usuario) {
                console.log(data.data.usuario, data.data.ultimaHoraRegistro);
                mostrarBotonesCorrectos(data.data.usuario.estadoTurno);
                formatearHora(data.data.usuario.nombreCompleto, data.data.ultimaHoraRegistro);
               
            } else {
                console.error('No se encontraron datos de usuario en la respuesta del servidor');
            }
        } else {
            console.error('Error al enviar la acción:', response.statusText);
        }
    } catch (error) {
        console.error('Error al enviar la acción:', error.message);
    }
}

async function formatearHora(nombre, horaUltimoRegistro) {
    const horaFormatoDate = new Date(horaUltimoRegistro);
    const hora = new Date(horaFormatoDate + `Z`);
    const a = hora.toISOString();
    const b = new Date(a);
    const horaFormateada = b.toLocaleString();
    document.getElementById("mensajeBienvenida").innerHTML = `${nombre} su último registro fue: ${horaFormateada}`;

}

async function mostrarBotonesCorrectos(estado) {
    if (estado === 'Iniciado' || estado === 'Reanudado') {
        btnIniciarJornada.classList.add('d-none');
        btnFinalizarJornada.classList.remove('d-none');
        btnPausarJornada.classList.remove('d-none');
        btnReanudarJornada.classList.add('d-none');
    } else if (estado === 'Finalizado') {
        btnIniciarJornada.classList.remove('d-none');
        btnFinalizarJornada.classList.add('d-none');
        btnPausarJornada.classList.add('d-none');
        btnReanudarJornada.classList.add('d-none');
    } else if (estado === 'Pausado') {
        btnIniciarJornada.classList.add('d-none');
        btnFinalizarJornada.classList.remove('d-none');
        btnPausarJornada.classList.add('d-none');
        btnReanudarJornada.classList.remove('d-none');
    }
}

btnIniciarJornada.addEventListener('click', async () => {
    await llamadaAPI('iniciar_turno', 'iniciar_jornada');
    await obtenerDatosUsuario();
});
btnFinalizarJornada.addEventListener('click', async () => {
    await llamadaAPI('finalizar_turno', 'finalizar_jornada');
    await obtenerDatosUsuario();

});
btnPausarJornada.addEventListener('click', async () => {
    await llamadaAPI('pausar_turno', 'pausar_jornada');
    await obtenerDatosUsuario();
});
btnReanudarJornada.addEventListener('click', async () => {
    await llamadaAPI('reanudar_turno', 'reanudar_jornada');
    await obtenerDatosUsuario();   
});
