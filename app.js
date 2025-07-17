document.getElementById("generarPDF").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Captura el contenido de la app
  const content = document.querySelector(".container");
  const canvas = await html2canvas(content);
  const imgData = canvas.toDataURL("image/png");

  const pdfWidth = doc.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

  // Genera nombre dinámico del archivo
  const fecha = new Date().toISOString().split("T")[0];
  const nombrePDF = `Salida_OS9_${fecha}.pdf`;

  // Guarda localmente
  doc.save(nombrePDF);

  // Convierte a blob para enviar por WhatsApp
  const blob = doc.output("blob");
  const file = new File([blob], nombrePDF, { type: "application/pdf" });

  // Envía al número fijo de Proservipol
  const proserviURL = `https://api.whatsapp.com/send?phone=+56933700267&text=Salida%20enviada%20a%20Proservipol`;
  window.open(proserviURL, "_blank");

  // Pregunta si desea enviar a otro contacto
  const enviarExtra = confirm("¿Desea enviar también el PDF a otro número por WhatsApp?");
  if (enviarExtra) {
    const otroNumero = prompt("Ingrese el número de WhatsApp (ej: 56912345678):");
    if (otroNumero && otroNumero.match(/^569\d{8}$/)) {
      const extraURL = `https://api.whatsapp.com/send?phone=${otroNumero}&text=Aquí%20va%20el%20PDF%20de%20la%20salida%20OS9.%20(Adjuntar%20manualmente%20el%20archivo%20si%20es%20necesario)`;
      window.open(extraURL, "_blank");
    } else {
      alert("Número inválido. Debe tener el formato 569XXXXXXXX");
    }
  }
});
