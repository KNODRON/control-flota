document.addEventListener('DOMContentLoaded', () => {
  const salidaForm = document.getElementById('salidaForm');
  const regresoForm = document.getElementById('regresoForm');
  const salidaData = [];

  function actualizarRegistro() {
    const output = document.getElementById('registroOutput');
    output.textContent = JSON.stringify(salidaData, null, 2);
  }

  salidaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const seccion = document.getElementById('seccion').value;
    const patente = document.getElementById('patente').value.toUpperCase();
    const kmSalida = document.getElementById('kmSalida').value;
    const horaSalida = new Date().toLocaleString('es-CL');

    const jefe = {
      calzo: document.getElementById('jefeCalzo').value,
      nombre: document.getElementById('jefeNombre').value,
      telefono: document.getElementById('jefeTelefono').value,
      pistola: document.getElementById('jefePistola').value,
      chaleco: document.getElementById('jefeChaleco').value,
      casco: document.getElementById('jefeCasco').value,
      portatil: document.getElementById('jefePortatil').value,
      camara: document.getElementById('jefeCamara').value,
    };

    const ocupantes = [jefe];
    for (let i = 1; i <= 2; i++) {
      const nombre = document.getElementById(`acomp${i}Nombre`).value;
      if (nombre.trim() !== '') {
        ocupantes.push({
          calzo: document.getElementById(`acomp${i}Calzo`).value,
          nombre,
          pistola: document.getElementById(`acomp${i}Pistola`).value,
          chaleco: document.getElementById(`acomp${i}Chaleco`).value,
          casco: document.getElementById(`acomp${i}Casco`).value,
          portatil: document.getElementById(`acomp${i}Portatil`).value,
          camara: document.getElementById(`acomp${i}Camara`).value,
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
      ocupantes,
      telefono: jefe.telefono
    });

    salidaForm.reset();
    actualizarRegistro();
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

    actualizarRegistro();
    alert("✅ Regreso registrado correctamente");
  });

  document.getElementById('PDF').addEventListener('click', () => {
    if (salidaData.length === 0) return alert("No hay datos para exportar");

    const { jsPDF } = window.jspdf;
    const salida = salidaData[salidaData.length - 1];
    const jefe = salida.ocupantes[0];
    const doc = new jsPDF({ orientation: "landscape" });

    const logo = new Image();
    logo.src = "logo-os9.jpeg";

    logo.onload = () => {
      doc.addImage(logo, "JPEG", 250, 10, 25, 25); // tamaño reducido

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(0, 102, 0);
      doc.text("REGISTRO DE SALIDA Y REGRESO DE VEHÍCULO OS9", 15, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Sección: ${salida.seccion}`, 15, 30);
      doc.text(`Patente: ${salida.patente}`, 15, 38);
      doc.text(`Fecha / Hora salida: ${salida.horaSalida}`, 15, 46);
      if (salida.horaRegreso) doc.text(`Fecha / Hora regreso: ${salida.horaRegreso}`, 15, 54);

      // Kilometrajes y teléfono
      doc.text(`Km salida: ${salida.kmSalida}`, 130, 30);
      if (salida.kmRegreso) doc.text(`Km regreso: ${salida.kmRegreso}`, 130, 38);
      doc.text(`Teléfono JP: ${salida.telefono}`, 130, 46);

      // Tabla ocupantes
      const encabezado = ["CALZO", "NOMBRE", "PISTOLA", "CHALECO", "CASCO", "PORTÁTIL", "CÁM. CORPORAL"];
      const datos = salida.ocupantes.map((o, i) => [
        o.calzo || '',
        o.nombre,
        o.pistola || '',
        o.chaleco || '',
        o.casco || '',
        o.portatil || '',
        o.camara || ''
      ]);

      doc.autoTable({
        startY: 65,
        head: [encabezado],
        body: datos,
        theme: 'grid',
        headStyles: { fillColor: [0, 102, 0] },
        styles: { fontSize: 10 },
      });

      // Firma derecha
      let y = doc.lastAutoTable.finalY + 20;
      const firmaX = 230;

      doc.setLineWidth(0.3);
      doc.line(firmaX, y, firmaX + 50, y);

      const nombreJP = jefe.nombre.toUpperCase();
      doc.setFont("helvetica", "bold");
      doc.text(nombreJP, firmaX + 25, y + 6, { align: "center" });
      doc.text("JEFE DE PATRULLA", firmaX + 25, y + 12, { align: "center" });

      doc.save(`salida-${salida.patente}.pdf`);
    };
  });
});
