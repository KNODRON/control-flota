const salidaForm = document.getElementById('salidaForm');
const regresoForm = document.getElementById('regresoForm');
const registroOutput = document.getElementById('registroOutput');

let salidas = [];

salidaForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const patente = document.getElementById('patente').value.toUpperCase();

  // Verificar si ya existe una salida activa con esa patente
  const existeSalida = salidas.some(s => s.patente === patente && !s.kmRegreso);
  if (existeSalida) {
    alert("Ese vehículo se encuentra en la población.");
    return;
  }

  const salida = {
    patente: patente,
    jefePatrulla: document.getElementById('jefePatrulla').value,
    acompanantes: document.getElementById('acompanantes').value,
    asignacionEquipo: document.getElementById('asignacionEquipo').value,
    kmSalida: parseInt(document.getElementById('kmSalida').value),
    horaSalida: new Date().toLocaleString()
  };

  salidas.push(salida);
  actualizarVista();
  salidaForm.reset();
});

regresoForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const patente = document.getElementById('patenteRegreso').value.toUpperCase();
  const kmRegreso = parseInt(document.getElementById('kmRegreso').value);
  const horaRegreso = new Date().toLocaleString();

  const salida = salidas.find(s => s.patente === patente && !s.kmRegreso);

  if (!salida) {
    alert("No se encontró una salida activa con esa patente.");
    return;
  }

  if (kmRegreso < salida.kmSalida) {
    alert("El kilometraje de regreso no puede ser menor al de salida.");
    return;
  }

  salida.kmRegreso = kmRegreso;
  salida.horaRegreso = horaRegreso;

  actualizarVista();
  regresoForm.reset();
});

function actualizarVista() {
  registroOutput.textContent = JSON.stringify(salidas, null, 2);
}
