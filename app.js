// app.js

const salidaForm = document.getElementById('salidaForm');
const regresoForm = document.getElementById('regresoForm');
const registroOutput = document.getElementById('registroOutput');

let salidas = [];

salidaForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const salida = {
    patente: document.getElementById('patente').value.toUpperCase(),
    conductor: document.getElementById('conductor').value,
    acompanantes: document.getElementById('acompanantes').value,
    kmSalida: parseInt(document.getElementById('kmSalida').value),
    horaSalida: new Date().toLocaleString()
  };

  salidas.push(salida);
  actualizarVista();
  salidaForm.reset();
});

regresoForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const patente = document.getElementById('patenteRegreso').value.toUpperCase();
  const kmRegreso = parseInt(document.getElementById('kmRegreso').value);
  const horaRegreso = new Date().toLocaleString();

  const salida = salidas.find(s => s.patente === patente && !s.kmRegreso);

  if (salida) {
    salida.kmRegreso = kmRegreso;
    salida.horaRegreso = horaRegreso;
  } else {
    alert("No se encontró una salida activa con esa patente.");
  }

  actualizarVista();
  regresoForm.reset();
});

function actualizarVista() {
  registroOutput.textContent = JSON.stringify(salidas, null, 2);
}
