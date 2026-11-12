const usuariosMock = [
    {
        email: 'pedro@testemail.com',
        senha: '12345678',
        apelido: 'Pedro',
        nomeCompleto: 'Pedro',
        telefone: '(85) 99111-1111',
        saldo: 7,
    },
    {
        email: 'maria@testemail.com',
        senha: '123456789',
        apelido: 'Maria',
        nomeCompleto: 'Maria',
        telefone: '(85) 99222-2222',
        saldo: 9,
    },
    {
        email: 'marcos.aurelio@testemail.com',
        senha: '1234567890',
        apelido: 'Marcos',
        nomeCompleto: 'Marcos Aurélio',
        telefone: '(85) 99333-3333',
        saldo: 12,
    },
];

const login = document.querySelector('#login-form');
const testModal = document.querySelector('#test-access-modal');
const testProfileList = document.querySelector('#test-profile-list');

function preencherMock(email, senha) {
    document.querySelector('#login-email').value = email;
    document.querySelector('#login-password').value = senha;
    testModal.hidden = true;
    login.querySelector('.form-status').textContent = 'Perfil selecionado. Aceite a Política de Privacidade e clique em Entrar.';
    document.querySelector('input[name="lgpd"]').focus();
}
testProfileList.innerHTML = usuariosMock
    .map(
        (usuario) => `
            <button class="test-profile" type="button" data-email="${usuario.email}" data-senha="${usuario.senha}">
                <i class="fa-solid fa-user" aria-hidden="true"></i>
                <span>
                    <strong>Entrar como ${usuario.nomeCompleto}</strong>
                    <small>${usuario.email}</small>
                    <small>Senha: ${usuario.senha} · ${usuario.saldo} pontos</small>
                </span>
            </button>`,
    )
    .join('');

document.querySelector('#open-test-access').addEventListener('click', () => {
    testModal.hidden = false;
    document.querySelector('#close-test-access').focus();
});

document.querySelector('#close-test-access').addEventListener('click', () => {
    testModal.hidden = true;
    document.querySelector('#open-test-access').focus();
});

testProfileList.addEventListener('click', (event) => {
    const profile = event.target.closest('[data-email]');
    if (!profile) return;
    preencherMock(profile.dataset.email, profile.dataset.senha);
});

testModal.addEventListener('click', (event) => {
    if (event.target === testModal) testModal.hidden = true;
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !testModal.hidden) testModal.hidden = true;
});
login.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(login));
    const users = JSON.parse(localStorage.getItem('rdn-users') || '[]');
    const usuarioFake = usuariosMock.find((user) => user.email.toLowerCase() === data.email.toLowerCase() && user.senha === data.senha);
    if (usuarioFake) {
        const savedMock = users.findIndex((user) => user.email.toLowerCase() === usuarioFake.email.toLowerCase());
        const testUser = {
            nome: usuarioFake.nomeCompleto,
            email: usuarioFake.email,
            telefone: usuarioFake.telefone,
            senha: usuarioFake.senha,
            pontos: usuarioFake.saldo,
            testProfile: true,
            createdAt: new Date().toISOString(),
        };

        if (savedMock >= 0) {
            const savedPoints = Number(users[savedMock].pontos);
            testUser.pontos = Number.isFinite(savedPoints) ? savedPoints : usuarioFake.saldo;
            testUser.createdAt = users[savedMock].createdAt || testUser.createdAt;
            users[savedMock] = { ...users[savedMock], ...testUser };
        } else {
            users.push(testUser);
        }
    }

    const index = users.findIndex((user) => user.email.toLowerCase() === data.email.toLowerCase() && user.senha === data.senha);
    const status = login.querySelector('.form-status');
    if (index < 0) {
        status.textContent = 'E-mail ou senha não encontrados. Cadastre-se ou use o Acesso para teste.';
        return;
    }
    users[index].privacyAcceptedAt = new Date().toISOString();
    localStorage.setItem('rdn-users', JSON.stringify(users));
    localStorage.setItem('rdn-session', JSON.stringify({ email: users[index].email, nome: users[index].nome }));
    location.href = 'perfil.html';
});
