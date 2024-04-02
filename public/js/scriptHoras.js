const horaUltimoRegistro = document.getElementById("horaRegistro").textContent;


const hora = new Date(horaUltimoRegistro + 'Z');
const a = hora.toISOString();
const b = new Date(a);
const horaFormateada = b.toLocaleString();
document.getElementById("horaRegistro").innerHTML = `Su último registro fue: ${horaFormateada}`;

