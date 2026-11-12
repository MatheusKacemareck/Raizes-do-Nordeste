 const cadastro = document.querySelector('#cadastro-form');
cadastro.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(cadastro)),
        users = JSON.parse(localStorage.getItem('rdn-users') || '[]'),
        status = cadastro.querySelector('.form-status'),
        name = data.nome.trim(),
        email = data.email.trim().toLowerCase(),
        phone = data.telefone.trim();
    if (name.length < 3) {
        status.textContent = 'Informe um nome com pelo menos 3 caracteres.';
        return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
        status.textContent = 'Informe um telefone válido com DDD.';
        return;
    }
    if (data.senha.length < 6) {
        status.textContent = 'A senha precisa ter no mínimo 6 caracteres.';
        return;
    }
    if (users.some((user) => user.email.toLowerCase() === email)) {
        status.textContent = 'Este e-mail já possui cadastro. Use a página de login.';
        return;
    }
    users.push({
        nome: name,
        email,
        telefone: phone,
        senha: data.senha,
        pontos: 0,
        privacyAcceptedAt: new Date().toISOString(),
        criadoEm: new Date().toISOString(),
    });
    localStorage.setItem('rdn-users', JSON.stringify(users));
    status.textContent = 'Cadastro realizado com sucesso. Você já pode entrar.';
    cadastro.reset();
});
