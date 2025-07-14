document.addEventListener('DOMContentLoaded', () => {
  const salidaForm = document.getElementById('salidaForm');
  const regresoForm = document.getElementById('regresoForm');
  const salidaData = [];

  salidaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const seccion = document.getElementById('seccion').value;
    const patente = document.getElementById('patente').value.toUpperCase();
    const kmSalida = document.getElementById('kmSalida').value;
    const horaSalida = new Date().toLocaleString('es-CL');

    const jefe = {
      nombre: document.getElementById('jefeNombre').value,
      telefono: document.getElementById('jefeTelefono').value,
      pistola: document.getElementById('jefePistola').value,
      chaleco: document.getElementById('jefeChaleco').value,
      casco: document.getElementById('jefeCasco').value,
      portatil: document.getElementById('jefePortatil').value,
      camara: document.getElementById('jefeCamara').value
    };

    const ocupantes = [jefe];
    for (let i = 1; i <= 2; i++) {
      const nombre = document.getElementById(`acomp${i}Nombre`).value;
      if (nombre) {
        ocupantes.push({
          nombre,
          pistola: document.getElementById(`acomp${i}Pistola`).value,
          chaleco: document.getElementById(`acomp${i}Chaleco`).value,
          casco: document.getElementById(`acomp${i}Casco`).value,
          portatil: document.getElementById(`acomp${i}Portatil`).value,
          camara: document.getElementById(`acomp${i}Camara`).value
        });
      }
    }

    const enUso = salidaData.find(s => s.patente === patente && !s.kmRegreso);
    if (enUso) {
      alert("🚨 Vehículo se encuentra en la población.");
      return;
    }

    salidaData.push({
      seccion,
      patente,
      kmSalida,
      horaSalida,
      ocupantes
    });

    // Actualizar registro temporal
    document.getElementById('registroOutput').textContent = JSON.stringify(salidaData, null, 2);

    salidaForm.reset();
    alert("✅ Salida registrada");
  });

  regresoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const patente = document.getElementById('patenteRegreso').value.toUpperCase();
    const kmRegreso = parseInt(document.getElementById('kmRegreso').value);
    const horaRegreso = new Date().toLocaleString('es-CL');

    const salida = salidaData.find(s => s.patente === patente && !s.kmRegreso);
    if (!salida) {
      alert("❌ No hay salida registrada para esta patente.");
      return;
    }

    if (kmRegreso < parseInt(salida.kmSalida)) {
      alert("❌ El kilometraje de regreso no puede ser menor al de salida.");
      return;
    }

    salida.kmRegreso = kmRegreso;
    salida.horaRegreso = horaRegreso;

    // Actualizar registro temporal
    document.getElementById('registroOutput').textContent = JSON.stringify(salidaData, null, 2);

    alert("✅ Regreso registrado correctamente");
  });

  // BOTÓN EXPORTAR PDF
  document.getElementById('generarPDF').addEventListener('click', () => {
    if (salidaData.length === 0) return alert("No hay datos para exportar");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape" });

    const salida = salidaData[salidaData.length - 1];
    const jefe = salida.ocupantes[0];
    const nombreJP = jefe.nombre.toUpperCase();
    const gradoJP = jefe.nombre.split(" de Carabineros")[0].trim();

    const logo = new Image();
    logo.src = "logo-os9.jpeg";

    logo.onload = () => {
      doc.addImage(logo, "JPEG", 240, 5, 40, 40);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(0, 102, 0);
      doc.text("REGISTRO DE SALIDA Y REGRESO DE VEHÍCULO OS9", 10, 20);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Sección: ${salida.seccion}`, 10, 30);
      doc.text(`Patente: ${salida.patente}`, 10, 38);
      doc.text(`Hora salida: ${salida.horaSalida}`, 10, 46);
      if (salida.horaRegreso) doc.text(`Hora regreso: ${salida.horaRegreso}`, 10, 54);
      doc.text(`Km salida: ${salida.kmSalida}`, 90, 38);
      if (salida.kmRegreso) doc.text(`Km regreso: ${salida.kmRegreso}`, 90, 46);

      const encabezado = ["N°", "Nombre", "Pistola", "Chaleco", "Casco", "Portátil", "Cámara"];
      const datos = salida.ocupantes.map((o, i) => [
        (i + 1).toString(),
        o.nombre,
        o.pistola,
        o.chaleco,
        o.casco,
        o.portatil,
        o.camara
      ]);

      doc.autoTable({
        startY: 65,
        head: [encabezado],
        body: datos,
        theme: 'grid',
        headStyles: { fillColor: [0, 102, 0] },
        styles: { fontSize: 10 },
      });

      // Pie de firma
      // Pie de firma (alineado a la derecha)
      let y = doc.lastAutoTable.finalY + 20;
      const firmaX = 230;

// Línea
      doc.setLineWidth(0.3);
      doc.line(firmaX, y, firmaX + 50, y);

// Nombre en mayúsculas
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(nombreJP, firmaX + 25, y + 6, { align: "center" });

// Rol
      doc.setFont("helvetica", "bold");
      doc.text("JEFE DE PATRULLA", firmaX + 25, y + 12, { align: "center" });

    };
  });
});
