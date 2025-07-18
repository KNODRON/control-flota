
document.getElementById('generarPDF').addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const datos = {
    seccion: document.getElementById('seccion').value,
    patente: document.getElementById('patente').value,
    jefeNombre: document.getElementById('jefeNombre').value,
    jefeTelefono: document.getElementById('jefeTelefono').value,
    jefeCalzo: document.getElementById('jefeCalzo').value,
    jefePistola: document.getElementById('jefePistola').value,
    jefeCasco: document.getElementById('jefeCasco').value,
    jefeChaleco: document.getElementById('jefeChaleco').value,
    jefePortatil: document.getElementById('jefePortatil').value,
    jefeCamara: document.getElementById('jefeCamara').value,
    kmSalida: document.getElementById('kmSalida').value,
    patenteRegreso: document.getElementById('patenteRegreso').value,
    kmRegreso: document.getElementById('kmRegreso').value,
  };

  const texto = `
  CONTROL DE SALIDA OS9
  ---------------------
  Sección: ${datos.seccion}
  Patente: ${datos.patente}
  Jefe: ${datos.jefeNombre} | Tel: ${datos.jefeTelefono}
  Calzo: ${datos.jefeCalzo}, Armamento: ${datos.jefePistola}
  Casco: ${datos.jefeCasco}, Chaleco: ${datos.jefeChaleco}
  Portátil: ${datos.jefePortatil}, Cam. Corporal: ${datos.jefeCamara}
  Km Salida: ${datos.kmSalida}

  REGRESO DEL VEHÍCULO
  ---------------------
  Patente regreso: ${datos.patenteRegreso}
  Km Regreso: ${datos.kmRegreso}
  `;

  doc.text(texto, 10, 10);
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);

  const nombreArchivo = `salida-${datos.patente}.pdf`;

  // Descargar el PDF
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  a.click();

  // Enviar a WhatsApp
  const mensaje = encodeURIComponent("Salida enviada a Proservipol");
  const telefonoFijo = "56933700267";
  const link = `https://wa.me/${telefonoFijo}?text=${mensaje}`;
  const wlink = document.getElementById("enviarWhatsapp");
  wlink.href = link;
  wlink.style.display = "block";
  wlink.innerText = "Enviar PDF a Proservipol";
});
