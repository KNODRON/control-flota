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
    seccion: document.getElementById('seccion').value,
    kmSalida: parseInt(document.getElementById('kmSalida').value),
    horaSalida: new Date().toLocaleString(),
    patrulla: [
      {
        rol: "Jefe de patrulla",
        nombre: document.getElementById('jefeNombre').value,
        telefono: document.getElementById('jefeTelefono').value,
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

// === FUNCIÓN PARA GENERAR PDF ===
async function generarPDF() {
  if (salidas.length === 0) {
    alert("No hay ninguna salida registrada.");
    return;
  }

  const ultima = salidas[salidas.length - 1];

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const logoURL = "https://knodron.github.io/control-flota/logo-os9.jpeg"; // o ruta que subas
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = logoURL;

  img.onload = function () {
    doc.addImage(img, "JPEG", 80, 10, 50, 50);

    doc.setFontSize(16);
    doc.text("SALIDA DE VEHÍCULO - OS9", 105, 70, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Sección: ${ultima.seccion}`, 20, 85);
    doc.text(`Patente: ${ultima.patente}`, 20, 95);
    doc.text(`Hora de salida: ${ultima.horaSalida}`, 20, 105);
    doc.text(`Kilometraje: ${ultima.kmSalida} km`, 20, 115);

    doc.setFontSize(14);
    doc.text("🧍 Personal y equipamiento", 20, 130);

    let y = 140;
    ultima.patrulla.forEach(persona => {
      if (!persona.nombre) return;

      doc.setFontSize(12);
      doc.text(`• ${persona.rol}: ${persona.nombre}`, 20, y);
      y += 8;

      if (persona.telefono) {
        doc.text(`   Teléfono: ${persona.telefono}`, 25, y);
        y += 8;
      }

      doc.text(`   Pistola: ${persona.pistola || '-'}`, 25, y); y += 8;
      doc.text(`   Chaleco: ${persona.chaleco || '-'}`, 25, y); y += 8;
      doc.text(`   Casco: ${persona.casco || '-'}`, 25, y); y += 8;
      doc.text(`   Portátil: ${persona.portatil || '-'}`, 25, y); y += 8;
      doc.text(`   Cámara corporal: ${persona.camara || '-'}`, 25, y); y += 10;
    });

    doc.save(`salida_${ultima.patente}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };
}
