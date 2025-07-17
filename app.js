document.addEventListener("DOMContentLoaded", function () {
  const salidaForm = document.getElementById("salidaForm");
  const regresoForm = document.getElementById("regresoForm");
  const registroOutput = document.getElementById("registroOutput");
  const generarPDFBtn = document.getElementById("generarPDF");

  let datosSalida = {};
  let datosRegreso = {};
  let pdfBase64 = "";

  salidaForm.addEventListener("submit", function (e) {
    e.preventDefault();

    datosSalida = {
      seccion: document.getElementById("seccion").value,
      patente: document.getElementById("patente").value,
      jefeNombre: document.getElementById("jefeNombre").value,
      jefeTelefono: document.getElementById("jefeTelefono").value,
      jefeCalzo: document.getElementById("jefeCalzo").value,
      jefePistola: document.getElementById("jefePistola").value,
      jefeChaleco: document.getElementById("jefeChaleco").value,
      jefeCasco: document.getElementById("jefeCasco").value,
      jefePortatil: document.getElementById("jefePortatil").value,
      jefeCamara: document.getElementById("jefeCamara").value,
      acomp1Nombre: document.getElementById("acomp1Nombre").value,
      acomp1Calzo: document.getElementById("acomp1Calzo").value,
      acomp1Pistola: document.getElementById("acomp1Pistola").value,
      acomp1Chaleco: document.getElementById("acomp1Chaleco").value,
      acomp1Casco: document.getElementById("acomp1Casco").value,
      acomp1Portatil: document.getElementById("acomp1Portatil").value,
      acomp1Camara: document.getElementById("acomp1Camara").value,
      acomp2Nombre: document.getElementById("acomp2Nombre").value,
      acomp2Calzo: document.getElementById("acomp2Calzo").value,
      acomp2Pistola: document.getElementById("acomp2Pistola").value,
      acomp2Chaleco: document.getElementById("acomp2Chaleco").value,
      acomp2Casco: document.getElementById("acomp2Casco").value,
      acomp2Portatil: document.getElementById("acomp2Portatil").value,
      acomp2Camara: document.getElementById("acomp2Camara").value,
      kmSalida: document.getElementById("kmSalida").value,
    };

    alert("Salida registrada. Ahora puedes registrar el regreso.");
  });

  regresoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    datosRegreso = {
      patente: document.getElementById("patenteRegreso").value,
      kmRegreso: document.getElementById("kmRegreso").value,
    };

    const resumen = `
📋 **RESUMEN DE SALIDA Y REGRESO**

📌 Sección: ${datosSalida.seccion}
🚗 Patente: ${datosSalida.patente}
🧑‍✈️ Jefe de patrulla: ${datosSalida.jefeNombre} (${datosSalida.jefeTelefono})
🧢 Calzo: ${datosSalida.jefeCalzo}, Armamento: ${datosSalida.jefePistola}, Chaleco: ${datosSalida.jefeChaleco}, Casco: ${datosSalida.jefeCasco}, Portátil: ${datosSalida.jefePortatil}, Cam. Corporal: ${datosSalida.jefeCamara}
👥 Acompañante 1: ${datosSalida.acomp1Nombre}
👥 Acompañante 2: ${datosSalida.acomp2Nombre}
📍 Kilometraje de salida: ${datosSalida.kmSalida}
🔙 Kilometraje de regreso: ${datosRegreso.kmRegreso}

📄 Ahora puedes generar el PDF para enviar.
    `;
    registroOutput.textContent = resumen;
  });

  generarPDFBtn.addEventListener("click", async function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("CARABINEROS DE CHILE", 70, 20);
    doc.setFontSize(12);
    doc.text("DEPARTAMENTO OS9", 80, 28);
    doc.setFontSize(10);
    doc.text(`SECCIÓN: ${datosSalida.seccion}`, 20, 40);
    doc.text(`PATENTE: ${datosSalida.patente}`, 20, 46);
    doc.text(`JEFE DE PATRULLA: ${datosSalida.jefeNombre} (${datosSalida.jefeTelefono})`, 20, 52);
    doc.text(`ACOMPAÑANTES: ${datosSalida.acomp1Nombre}, ${datosSalida.acomp2Nombre}`, 20, 58);
    doc.text(`KILOMETRAJE SALIDA: ${datosSalida.kmSalida}`, 20, 64);
    doc.text(`KILOMETRAJE REGRESO: ${datosRegreso.kmRegreso}`, 20, 70);

    doc.text("_________________________", 20, 90);
    doc.text("Firma Jefe de Patrulla", 30, 95);

    const pdfBlob = doc.output("blob");
    const reader = new FileReader();
    reader.onload = function () {
      pdfBase64 = reader.result.split(",")[1];
      mostrarBotonWhatsApp();
    };
    reader.readAsDataURL(pdfBlob);
  });

  function mostrarBotonWhatsApp() {
    const numeroFijo = "56933700267";
    const mensaje = "Salida enviada a Proservipol";

    const botonWA = document.createElement("a");
    botonWA.href = `https://wa.me/${numeroFijo}?text=${encodeURIComponent(mensaje)}`;
    botonWA.textContent = "Enviar PDF a WhatsApp Proservipol";
    botonWA.className = "whatsapp-btn";
    botonWA.target = "_blank";
    document.querySelector(".center").appendChild(botonWA);
  }
});
