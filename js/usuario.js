//  Perfilcliente 
const profile = document.querySelector('#profile'),
    session = JSON.parse(localStorage.getItem('rdn-session') || 'null'),
    profileSafe = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const adminCustomerEmail = new URLSearchParams(location.search).get('cliente');
const profileAdminSession = JSON.parse(sessionStorage.getItem('rdn-admin-session') || 'null');

function renderAdminCustomerProfile() {
    if (profileAdminSession?.role !== 'admin' || profileAdminSession?.email !== 'administrador@raizes.com') {
        profile.innerHTML = `<section class="auth-card profile-login"><div class="profile-avatar"><i class="fa-solid fa-user-shield"></i></div><div class="auth-intro"><span>Acesso restrito</span><h1>Validação necessária</h1><p>Entre com a conta administrativa para consultar este perfil.</p></div><a class="auth-submit" href="admin-login.html">Acesso administrativo</a></section>`;
        return;
    }
    const users = JSON.parse(localStorage.getItem('rdn-users') || '[]');
    const user = users.find((item) => item.email.toLowerCase() === adminCustomerEmail.toLowerCase());
    if (!user) {
        profile.innerHTML = `<section class="auth-card profile-login"><div class="profile-avatar"><i class="fa-solid fa-user-xmark"></i></div><div class="auth-intro"><h1>Cliente não encontrado</h1><p>O cadastro pode ter sido removido deste navegador.</p></div><a class="auth-submit" href="admin.html">Voltar ao painel</a></section>`;
        return;
    }
    const orders = JSON.parse(localStorage.getItem('rdn-orders') || '[]')
        .filter((order) => order.email === user.email.toLowerCase())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const redemptions = orders.reduce((sum, order) => sum + (order.items || []).filter((item) => item.redemption).reduce((quantity, item) => quantity + (Number(item.qty) || 1), 0), 0);
    const phone = String(user.telefone || '').replace(/\D/g, '');
    const whatsappPhone = phone.length === 11 ? `55${phone}` : phone;
    const orderList = orders.length
        ? orders.map((order) => `<a href="admin.html" class="admin-customer-order"><span><strong>${profileSafe(order.id)}</strong><small>${profileSafe(order.status)}</small></span><strong>${Number(order.total || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></a>`).join('')
        : '<p>Nenhum pedido registrado para este cliente.</p>';

    profile.innerHTML = `<section class="profile-banner"><div class="container"><div class="profile-identity"><div class="profile-avatar"><i class="fa-solid fa-user"></i></div><div><span>Perfil do cliente</span><h1>${profileSafe(user.nome)}</h1><p>${profileSafe(user.email)}</p></div></div><div class="profile-stats"><article><strong>${orders.length}</strong><span>Pedidos</span></article><article><strong>${Number(user.pontos) || 0}</strong><span>Pontos</span></article><article><strong>${redemptions}</strong><span>Resgates</span></article></div></div></section><section class="section container admin-customer-profile"><div class="form-card"><h2>Dados para contato</h2><dl><div><dt>Nome</dt><dd>${profileSafe(user.nome)}</dd></div><div><dt>E-mail</dt><dd><a href="mailto:${profileSafe(user.email)}">${profileSafe(user.email)}</a></dd></div><div><dt>Telefone</dt><dd>${profileSafe(user.telefone || 'Não informado')}</dd></div></dl>${phone ? `<div class="admin-profile-contact"><a class="button primary" href="tel:${phone}"><i class="fa-solid fa-phone"></i> Ligar</a><a class="button light" href="sms:${phone}"><i class="fa-solid fa-message"></i> Enviar mensagem</a><a class="button whatsapp-profile-button" href="https://wa.me/${whatsappPhone}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a></div>` : ''}</div><div class="form-card"><h2>Pedidos do cliente</h2><div class="admin-customer-orders">${orderList}</div></div><a class="button light" href="admin.html"><i class="fa-solid fa-arrow-left"></i> Voltar ao painel</a></section>`;
}
function profileData() {
    const users = JSON.parse(localStorage.getItem('rdn-users') || '[]'),
        index = session ? users.findIndex((user) => user.email.toLowerCase() === session.email.toLowerCase()) : -1;
    return { users, index, user: users[index] };
}
function renderProfile() {
    if (adminCustomerEmail) {
        renderAdminCustomerProfile();
        return;
    }
    if (!session) {
        profile.innerHTML = `<section class="auth-card profile-login"><div class="profile-avatar"><i class="fa-solid fa-user"></i></div><div class="auth-intro"><span>Minha conta</span><h1>Você ainda não entrou</h1><p>Acesse sua conta para consultar seus dados e pedidos.</p></div><a class="auth-submit" href="login.html">Fazer login</a><div class="auth-divider"><span>ou</span></div><a class="auth-secondary" href="cadastro.html">Criar uma conta</a></section>`;
        return;
    }
    const { user } = profileData();
    if (!user) {
        localStorage.removeItem('rdn-session');
        location.href = 'login.html';
        return;
    }
    const orders = JSON.parse(localStorage.getItem('rdn-orders') || '[]').filter((order) => order.email === session.email.toLowerCase()),
        redemptions = orders.reduce((sum, order) => sum + order.items.filter((item) => item.redemption).reduce((quantity, item) => quantity + (Number(item.qty) || 1), 0), 0);
    profile.innerHTML = `<section class="profile-banner"><div class="container"><div class="profile-identity"><div class="profile-avatar"><i class="fa-solid fa-user"></i></div><div><span>Minha conta</span><h1>Olá, ${profileSafe(user.nome)}</h1><p>${profileSafe(session.email)}</p></div></div><div class="profile-stats"><article><strong>${orders.length}</strong><span>Pedidos</span></article><article><strong>${Number(user.pontos) || 0}</strong><span>Pontos</span></article><article><strong>${redemptions}</strong><span>Resgates</span></article></div></div></section><section class="section container profile-grid"><nav class="profile-shortcuts"><a href="historico.html"><i class="fa-solid fa-clock-rotate-left"></i><span><strong>Histórico de pedidos</strong><small>Acompanhe seus pedidos</small></span><i class="fa-solid fa-chevron-right"></i></a><a href="fidelidade.html"><i class="fa-solid fa-gift"></i><span><strong>Fidelidade</strong><small>Troque pontos por produtos</small></span><i class="fa-solid fa-chevron-right"></i></a><a href="carrinho.html"><i class="fa-solid fa-motorcycle"></i><span><strong>Entrega ou retirada</strong><small>Configure diretamente no carrinho</small></span><i class="fa-solid fa-chevron-right"></i></a></nav><div class="profile-settings"><h2>Dados pessoais</h2><form id="profile-form" class="form-card"><label>Nome completo<input name="nome" value="${profileSafe(user.nome)}" required minlength="3" autocomplete="name"></label><label>E-mail<input value="${profileSafe(user.email)}" disabled></label><label>Telefone<input name="telefone" value="${profileSafe(user.telefone)}" required autocomplete="tel" inputmode="tel"></label><button class="button primary">Salvar alterações</button><p class="form-status" role="status"></p></form><div class="profile-privacy"><h2>Privacidade e acesso</h2><a href="recuperar-senha.html">Alterar senha</a><a href="lgpd.html">Política de Privacidade</a><button id="logout" class="button light"><i class="fa-solid fa-right-from-bracket"></i> Sair</button><button id="delete-account" class="danger-link"><i class="fa-solid fa-trash-can"></i> Excluir meus dados locais</button></div></div></section>`;
    bindProfile();
}
function bindProfile() {
    document.querySelector('#profile-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget)),
            name = data.nome.trim(),
            phone = data.telefone.trim(),
            status = event.currentTarget.querySelector('.form-status');
        if (name.length < 3) {
            status.textContent = 'Informe um nome com pelo menos 3 caracteres.';
            return;
        }
        if (phone.replace(/\D/g, '').length < 10) {
            status.textContent = 'Informe um telefone válido com DDD.';
            return;
        }
        const { users, index } = profileData();
        users[index].nome = name;
        users[index].telefone = phone;
        localStorage.setItem('rdn-users', JSON.stringify(users));
        localStorage.setItem('rdn-session', JSON.stringify({ email: users[index].email, nome: name }));
        status.textContent = 'Dados atualizados com sucesso.';
    });
    document.querySelector('#logout').addEventListener('click', () => {
        localStorage.removeItem('rdn-session');
        location.href = 'login.html';
    });
    document.querySelector('#delete-account').addEventListener('click', () => {
        if (prompt('Para excluir definitivamente os dados locais, digite EXCLUIR:') !== 'EXCLUIR') return;
        const email = session.email.toLowerCase();
        localStorage.setItem('rdn-users', JSON.stringify(JSON.parse(localStorage.getItem('rdn-users') || '[]').filter((item) => item.email.toLowerCase() !== email)));
        ['rdn-orders', 'rdn-redemptions'].forEach((key) =>
            localStorage.setItem(key, JSON.stringify(JSON.parse(localStorage.getItem(key) || '[]').filter((item) => item.email !== email))),
        );
        localStorage.removeItem('rdn-session');
        location.href = 'index.html';
    });
}
renderProfile();
