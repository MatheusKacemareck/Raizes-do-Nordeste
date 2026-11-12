const ADMINISTRADOR_TESTE = {
    nome: 'Administrador Raízes',
    email: 'administrador@raizes.com',
    senha: 'Admin@2026',
};
const adminLoginForm = document.querySelector('#admin-login-form');
const currentAdminSession = JSON.parse(sessionStorage.getItem('rdn-admin-session') || 'null');

if (currentAdminSession?.email === ADMINISTRADOR_TESTE.email && currentAdminSession?.role === 'admin') {
    location.replace('admin.html');
}
adminLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(adminLoginForm));
    const status = adminLoginForm.querySelector('.form-status');
    const validAdmin = data.email.toLowerCase() === ADMINISTRADOR_TESTE.email && data.senha === ADMINISTRADOR_TESTE.senha;

    if (!validAdmin) {
        status.textContent = 'E-mail ou senha administrativa inválidos.';
        return;
    }

    sessionStorage.setItem(
        'rdn-admin-session',
        JSON.stringify({ nome: ADMINISTRADOR_TESTE.nome, email: ADMINISTRADOR_TESTE.email, role: 'admin' }),
    );
    location.href = 'admin.html';
});
