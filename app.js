document.getElementById('formulario').addEventListener('submit', async function (e) {
  e.preventDefault();

  const datos = {
    seccion: document.getElementById('seccion').value,
    patente: document.getElementById('patente').value,
    horaSalida: document.getElementById('horaSalida').value,
    kmSalida: document.getElementById('kmSalida').value,
    jefeNombre: document.getElementById('jefeNombre').value,
    jefeTelefono: document.getElementById('jefeTelefono').value,
    calzo: document.getElementById('calzo').value,
    pistola: document.getElementById('pistola').value,
    chaleco: document.getElementById('chaleco').value,
    casco: document.getElementById('casco').value,
    portatil: document.getElementById('portatil').value,
    camara: document.getElementById('camara').value
  };

  // Generar PDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("CONTROL DE FLOTA - SALIDA DE VEHÍCULO", 20, 20);

  const contenido = `
SECCIÓN: ${datos.seccion}
PATENTE: ${datos.patente}
HORA SALIDA: ${datos.horaSalida}
KM SALIDA: ${datos.kmSalida}
NOMBRE JP: ${datos.jefeNombre}
TELÉFONO JP: ${datos.jefeTelefono}
CALZO: ${datos.calzo}
ARMAMENTO: ${datos.pistola}
CHALECO: ${datos.chaleco}
CASCO: ${datos.casco}
PORTÁTIL: ${datos.portatil}
CÁMARA: ${datos.camara}
  `.trim();

  doc.text(contenido, 20, 40);

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // WhatsApp Proservipol fijo
  const numeroFijo = "56933700267";
  const mensaje = encodeURIComponent("Salida enviada a Proservipol.");
  document.getElementById("btnWpFijo").href = `https://wa.me/${numeroFijo}?text=${mensaje}`;

  // WhatsApp extra (pedir número)
  const numeroExtra = prompt("¿Enviar también a otro número? Escribe solo el número sin + ni espacios (ej. 56912345678):");
  if (numeroExtra) {
    document.getElementById("btnWpExtra").href = `https://wa.me/${numeroExtra}?text=${mensaje}`;
  } else {
    document.getElementById("btnWpExtra").style.display = "none";
  }

  // Abrir PDF para descargar (opcional)
  doc.save(`salida-${datos.patente}.pdf`);
});
