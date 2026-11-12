//recuperação de senha
const recoveryForm = document.querySelector('#recovery-form');
recoveryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(recoveryForm));
    const status = recoveryForm.querySelector('.form-status');
    if (data.senha.length < 6) {
        status.textContent = 'A senha precisa ter no mínimo 6 caracteres.';
        return;
    }
    if (data.senha !== data.confirmacao) {
        status.textContent = 'As senhas informadas não são iguais.';
        return;
    }
    const users = JSON.parse(localStorage.getItem('rdn-users') || '[]');
    const index = users.findIndex((user) => user.email.toLowerCase() === data.email.trim().toLowerCase());
    if (index < 0) {
        status.textContent = 'E-mail não encontrado neste dispositivo.';
        return;
    }
    users[index].senha = data.senha;
    localStorage.setItem('rdn-users', JSON.stringify(users));
    localStorage.removeItem('rdn-session');
    status.textContent = 'Senha atualizada com sucesso. Redirecionando para o login...';
    recoveryForm.querySelector('button').disabled = true;
    setTimeout(() => (location.href = 'login.html'), 1400);
});
