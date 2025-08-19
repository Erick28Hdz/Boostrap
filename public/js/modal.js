document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("passwordModal");
  const recoverForm = document.getElementById("recoverForm");
  const recoverMessage = document.getElementById("recoverMessage");

  // Abrir modal
  window.abrirModal = function () {
    if (modal) {
      modal.style.display = "flex";
    }
  };

  // Cerrar modal
  window.cerrarModal = function () {
    if (modal) {
      modal.style.display = "none";
      recoverForm?.reset();
      if (recoverMessage) {
        recoverMessage.textContent = "";
        recoverMessage.style.color = "";
      }
    }
  };

  // Cerrar modal al hacer clic fuera del contenido
  window.addEventListener('click', (event) => {
    if (modal?.style.display === "flex" && event.target === modal) {
      cerrarModal();
    }
  });

  // Enviar formulario de recuperación
  recoverForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("recoverEmail")?.value;

    try {
      const response = await fetch("/api/recover-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      recoverMessage.textContent = data.message || "Algo salió mal.";
      recoverMessage.style.color = data.success ? "green" : "red";
    } catch (error) {
      recoverMessage.textContent = "Error del servidor.";
      recoverMessage.style.color = "red";
    }
  });
});
