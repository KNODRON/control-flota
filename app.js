const salidaForm = document.getElementById('salidaForm');
const regresoForm = document.getElementById('regresoForm');
const registroOutput = document.getElementById('registroOutput');

let salidas = [];

salidaForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const patente = document.getElementById('patente').value.toUpperCase();

  const existeSalida = salidas.some(s => s.patente === patente && !s.kmRegreso);
  if (existeSalida) {
    alert("Ese vehículo se encuentra en la población.");
    return;
  }

  const salida = {
    patente: patente,
    kmSalida: parseInt(document.getElementById('kmSalida').value),
    horaSalida: new Date().toLocaleString(),
    patrulla: [
      {
        rol: "Jefe de patrulla",
        nombre: document.getElementById('jefeNombre').value,
        pistola: document.getElementById('jefePistola').value,
        chaleco: document.getElementById('jefeChaleco').value,
        casco: document.getElementById('jefeCasco').value,
        portatil: document.getElementById('jefePortatil').value,
        camara: document.getElementById('jefeCamara').value,
      },
      {
        rol: "Acompañante 1",
        nombre: document.getElementById('acomp1Nombre').value,
        pistola: document.getElementById('acomp1Pistola').value,
        chaleco: document.getElementById('acomp1Chaleco').value,
        casco: document.getElementById('acomp1Casco').value,
        portatil: document.getElementById('acomp1Portatil').value,
        camara: document.getElementById('acomp1Camara').value,
      },
      {
        rol: "Acompañante 2",
        nombre: document.getElementById('acomp2Nombre').value,
        pistola: document.getElementById('acomp2Pistola').value,
        chaleco: document.getElementById('acomp2Chaleco').value,
        casco: document.getElementById('acomp2Casco').value,
        portatil: document.getElementById('acomp2Portatil').value,
        camara: document.getElementById('acomp2Camara').value,
      }
    ]
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
