const salidaForm = document.getElementById('salidaForm');
const regresoForm = document.getElementById('regresoForm');
const registroOutput = document.getElementById('registroOutput');

let salidas = [];

salidaForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const patente = document.getElementById('patente').value.toUpperCase();

  const existeSalida = salidas.some(s => s.patente === patente && !s.kmRegreso);
  if (existeSalida) {
    alert("Vehículo se encuentra en la población.");
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
    alert("No se encontró una salida con esa patente.");
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
  const jp = ultima.patrulla[0]; // Jefe de patrulla (primero en la lista)

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape" });

  const logoURL = "https://knodron.github.io/control-flota/logo-os9.jpeg";
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = logoURL;

  img.onload = function () {
    // Logo arriba derecha
    doc.addImage(img, "JPEG", 250, 10, 30, 30);

    // Título
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SALIDA A POBLACIÓN", 148, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Datos generales
    doc.text(`Sección: ${ultima.seccion}`, 20, 40);
    doc.text(`Patente: ${ultima.patente}`, 20, 48);
    doc.text(`Fecha y hora de salida: ${ultima.horaSalida}`, 20, 56);
    doc.text(`Kilometraje salida: ${ultima.kmSalida} km`, 20, 64);

    // Tabla de personal
    let y = 80;
    doc.setFont("helvetica", "bold");
    doc.text("Personal y Equipamiento", 20, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Nombre", 20, y);
    doc.text("Pistola", 80, y);
    doc.text("Chaleco", 110, y);
    doc.text("Casco", 140, y);
    doc.text("Portátil", 170, y);
    doc.text("C. Corporal", 200, y);
    y += 6;
    doc.setLineWidth(0.2);
    doc.line(20, y, 270, y);
    y += 6;

    doc.setFont("helvetica", "normal");

    ultima.patrulla.forEach(p => {
      if (!p.nombre) return;
      doc.text(p.nombre, 20, y);
      doc.text(p.pistola || "-", 80, y);
      doc.text(p.chaleco || "-", 110, y);
      doc.text(p.casco || "-", 140, y);
      doc.text(p.portatil || "-", 170, y);
      doc.text(p.camara || "-", 200, y);
      y += 8;
    });

    y += 10;
    // Datos regreso (si existen)
    if (ultima.horaRegreso && ultima.kmRegreso) {
      doc.setFont("helvetica", "bold");
      doc.text("Datos de regreso", 20, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.text(`Hora de regreso: ${ultima.horaRegreso}`, 20, y);
      y += 8;
      doc.text(`Kilometraje regreso: ${ultima.kmRegreso} km`, 20, y);
      y += 10;
    }

    // Firma Jefe de Patrulla
    y += 20;
    doc.line(20, y, 100, y);
    doc.text(`Jefe de Patrulla: ${jp.nombre}`, 20, y + 6);

    // Guardar PDF
    doc.save(`salida_${ultima.patente}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };
}
