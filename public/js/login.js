document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const message = document.getElementById('message');

  // ✅ Validación del formulario
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/?login=success';
      } else {
        message.style.color = '#d9534f';
        message.textContent = data.message || 'Error al iniciar sesión';
      }
    } catch (err) {
      message.textContent = 'Error en el servidor';
    }
  });

  // ✅ Redireccionar a la página de registro
  document.getElementById('btn-registrarse')?.addEventListener('click', () => {
    window.location.href = '/register';
  });

  // ✅ Mostrar modal al hacer clic en "Olvidé la contraseña"
  document.getElementById('link-olvido-pass')?.addEventListener('click', (e) => {
    e.preventDefault();
    abrirModal();
  });
});
