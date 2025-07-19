document.addEventListener('DOMContentLoaded', () => {
  let departureTime, returnTime;
  let companionCount = 0;
  const maxCompanions = 5;
  const container = document.getElementById('companions-container');

  // Agregar acompañante
  document.getElementById('add-companion').addEventListener('click', () => {
    if (companionCount >= maxCompanions) {
      return alert('Máximo 5 acompañantes.');
    }
    companionCount++;
    const div = document.createElement('div');
    div.className = 'companion';
    div.id = `companion-${companionCount}`;
    div.innerHTML = `
      <label>Acompañante ${companionCount} - Nombre:</label>
      <input type="text" id="comp-name-${companionCount}" required>
      <label>Cargo acompañante ${companionCount}:</label>
      <div class="equipment-grid">
        <input type="text" id="comp-${companionCount}-calzo" placeholder="Calzo" required>
        <!-- … resto de inputs … -->
      </div>
    `;
    container.appendChild(div);
  });

  // Registrar salida
  document.getElementById('register-departure').addEventListener('click', () => {
    const form = document.getElementById('departure-form');
    if (!form.reportValidity()) return;
    departureTime = new Date();
    document.getElementById('patente-return').value =
      document.getElementById('patente-departure').value;
    form.style.display = 'none';
    document.getElementById('return-form').style.display = 'block';
  });

  // Registrar regreso
  document.getElementById('register-return').addEventListener('click', () => {
    const form = document.getElementById('return-form');
    if (!form.reportValidity()) return;
    returnTime = new Date();
    form.style.display = 'none';
    document.getElementById('generate-pdf').style.display = 'block';
  });

  // Generar PDF
  document.getElementById('generate-pdf').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    // … lógica de jsPDF …
    doc.save(`Salida_OS9_${Date.now()}.pdf`);
  });
});

