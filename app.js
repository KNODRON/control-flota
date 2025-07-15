document.getElementById('salidaForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const salida = {
    horaSalida: new Date().toLocaleString("es-CL"),
    seccion: document.getElementById("seccion").value,
    patente: document.getElementById("patente").value,
    kmSalida: document.getElementById("kmSalida").value,
    ocupantes: [
      {
        nombre: document.getElementById("jefeNombre").value,
        telefono: document.getElementById("jefeTelefono").value,
        calzo: document.getElementById("jefeCalzo").value,
        pistola: document.getElementById("jefePistola").value,
        chaleco: document.getElementById("jefeChaleco").value,
        casco: document.getElementById("jefeCasco").value,
        portatil: document.getElementById("jefePortatil").value,
        camara: document.getElementById("jefeCamara").value
      },
      {
        nombre: document.getElementById("acomp1Nombre").value,
        calzo: document.getElementById("acomp1Calzo").value,
        pistola: document.getElementById("acomp1Pistola").value,
        chaleco: document.getElementById("acomp1Chaleco").value,
        casco: document.getElementById("acomp1Casco").value,
        portatil: document.getElementById("acomp1Portatil").value,
        camara: document.getElementById("acomp1Camara").value
      },
      {
        nombre: document.getElementById("acomp2Nombre").value,
        calzo: document.getElementById("acomp2Calzo").value,
        pistola: document.getElementById("acomp2Pistola").value,
        chaleco: document.getElementById("acomp2Chaleco").value,
        casco: document.getElementById("acomp2Casco").value,
        portatil: document.getElementById("acomp2Portatil").value,
        camara: document.getElementById("acomp2Camara").value
      }
    ]
  };

  fetch("https://script.google.com/macros/s/AKfycbyH8nHZ6hQJ-FUzYUsRRneAZdZyQ7kkdnkCQes53Wn4C4in0efmfJR5ulfKinatEEY3tQ/exec", {
    method: "POST",
    body: JSON.stringify(salida),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.text())
    .then(data => {
      document.getElementById("registroOutput").textContent = "✅ Salida registrada correctamente.\n" + JSON.stringify(salida, null, 2);
    })
    .catch(err => {
      document.getElementById("registroOutput").textContent = "❌ Error al registrar: " + err;
    });
});

// Registrar regreso (más adelante puedes enlazarlo con la hoja si lo deseas)
document.getElementById('regresoForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const patente = document.getElementById("patenteRegreso").value;
  const kmRegreso = document.getElementById("kmRegreso").value;

  document.getElementById("registroOutput").textContent =
    "📦 Regreso registrado (no enviado a hoja):\n" +
    `Patente: ${patente}\nKM regreso: ${kmRegreso}`;
});
