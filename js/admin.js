// acesso admin
const adminSession = JSON.parse(sessionStorage.getItem('rdn-admin-session') || 'null');
const ADMIN_EMAIL = 'administrador@raizes.com';

if (!adminSession || adminSession.role !== 'admin' || adminSession.email !== ADMIN_EMAIL) {
    location.replace('admin-login.html');
    throw new Error('Acesso administrativo não autorizado.');
}

document.querySelector('#admin-name').textContent = adminSession.nome;
document.querySelector('#admin-logout').addEventListener('click', () => {
    sessionStorage.removeItem('rdn-admin-session');
    location.replace('admin-login.html');
});

const adminOrders = document.querySelector('#admin-orders');
const adminMetrics = document.querySelector('#admin-metrics');
const adminSearch = document.querySelector('#admin-search');
const adminFilter = document.querySelector('#admin-filter');
const adminResultCount = document.querySelector('#admin-result-count');
const adminStatusFeedback = document.querySelector('#admin-status-feedback');
const adminMoney = (value) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const adminSafe = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const readAdminData = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (_) {
        return [];
    }
};

function statusOptions(order) {
    return [
        'Pedido recebido',
        'Em preparo',
        order.fulfillment?.mode === 'delivery' ? 'Saiu para entrega' : 'Pronto para retirada',
        'Concluído',
    ];
}
function renderAdmin() {
    const users = readAdminData('rdn-users');
    const orders = readAdminData('rdn-orders').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const completed = orders.filter((order) => order.status === 'Concluído').length;
    const inProgress = orders.length - completed;
    const totalSales = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    adminMetrics.innerHTML = `
        <article><i class="fa-solid fa-receipt" aria-hidden="true"></i><span>Total de pedidos</span><strong>${orders.length}</strong></article>
        <article><i class="fa-solid fa-fire-burner" aria-hidden="true"></i><span>Em andamento</span><strong>${inProgress}</strong></article>
        <article><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Concluídos</span><strong>${completed}</strong></article>
        <article><i class="fa-solid fa-sack-dollar" aria-hidden="true"></i><span>Total em compras</span><strong>${adminMoney(totalSales)}</strong></article>`;
    const search = adminSearch.value.trim().toLocaleLowerCase('pt-BR');
    const filter = adminFilter.value;
    const filtered = orders.filter((order) => {
        const user = users.find((item) => item.email.toLowerCase() === String(order.email).toLowerCase());
        const searchable = `${order.id} ${order.email} ${user?.nome || ''}`.toLocaleLowerCase('pt-BR');
        return (!search || searchable.includes(search)) && (filter === 'todos' || order.status === filter);
    });

    adminResultCount.textContent = filtered.length === 1 ? '1 pedido encontrado' : `${filtered.length} pedidos encontrados`;
    adminOrders.innerHTML = filtered.length
        ? filtered
              .map((order) => {
                  const user = users.find((item) => item.email.toLowerCase() === String(order.email).toLowerCase());
                  const fulfillment = order.fulfillment || {};
                  const phone = String(user?.telefone || '').replace(/\D/g, '');
                  const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(order.createdAt));
                  const options = statusOptions(order)
                      .map((status) => `<option ${order.status === status ? 'selected' : ''}>${status}</option>`)
                      .join('');
                  const items = (order.items || [])
                      .map((item) => `<p><strong>${Number(item.qty) || 1}×</strong> ${adminSafe(item.item)}${item.redemption ? ` <small>Recompensa · ${Number(item.pointsCost) || 0} pontos</small>` : ''}</p>`)
                      .join('');

                  return `<article class="admin-order-card">
                      <header><div><strong>${adminSafe(order.id)}</strong><small>${adminSafe(date)}</small></div><label>Status<select data-order-status="${adminSafe(order.id)}">${options}</select></label></header>
                      <div class="admin-order-customer">
                          <i class="fa-solid fa-user" aria-hidden="true"></i>
                          <span><a class="admin-customer-link" href="perfil.html?cliente=${encodeURIComponent(order.email)}"><strong>${adminSafe(user?.nome || 'Cliente')}</strong></a><small>${adminSafe(order.email)}</small><small>${adminSafe(user?.telefone || 'Telefone não informado')}</small></span>
                          ${phone ? `<div class="admin-contact-actions"><a href="tel:${phone}" aria-label="Ligar para ${adminSafe(user?.nome || 'cliente')}"><i class="fa-solid fa-phone" aria-hidden="true"></i> Ligar</a><a href="sms:${phone}" aria-label="Enviar mensagem para ${adminSafe(user?.nome || 'cliente')}"><i class="fa-solid fa-message" aria-hidden="true"></i> Mensagem</a></div>` : ''}
                      </div>
                      <div class="admin-order-items">${items || '<p>Itens não informados.</p>'}</div>
                      <dl class="admin-order-details">
                          <div><dt>Modalidade</dt><dd>${fulfillment.mode === 'delivery' ? 'Delivery' : 'Retirada'}</dd></div>
                          <div><dt>Unidade</dt><dd>${adminSafe(fulfillment.unit || 'Não informada')}</dd></div>
                          <div><dt>Destino</dt><dd>${adminSafe(fulfillment.mode === 'delivery' ? fulfillment.address || 'Não informado' : fulfillment.unit || 'Não informado')}</dd></div>
                          <div><dt>Previsão</dt><dd>${adminSafe(fulfillment.estimate || 'Não informada')}</dd></div>
                          <div><dt>Pagamento</dt><dd>${adminSafe(order.paymentMethod || 'Não informado')}</dd></div>
                          <div><dt>Subtotal</dt><dd>${adminMoney(order.subtotal)}</dd></div>
                          <div><dt>Frete</dt><dd>${adminMoney(order.freight)}</dd></div>
                          <div><dt>Total</dt><dd><strong>${adminMoney(order.total)}</strong></dd></div>
                          <div><dt>Pontos</dt><dd><span class="points-positive">+${Number(order.pointsEarned) || 0}</span> / <span class="points-negative">−${Number(order.pointsRedeemed) || 0}</span></dd></div>
                      </dl>
                      ${order.note ? `<p class="admin-order-note"><i class="fa-solid fa-pen" aria-hidden="true"></i> ${adminSafe(order.note)}</p>` : ''}
                  </article>`;
              })
              .join('')
        : `<div class="admin-empty"><i class="fa-solid fa-inbox" aria-hidden="true"></i><h2>Nenhum pedido encontrado</h2><p>Os pedidos concluídos no pagamento aparecerão aqui.</p></div>`;
}
adminOrders.addEventListener('change', (event) => {
    if (!event.target.matches('[data-order-status]')) return;
    const orders = readAdminData('rdn-orders');
    const order = orders.find((item) => item.id === event.target.dataset.orderStatus);
    if (!order) return;
    order.status = event.target.value;
    order.manualStatus = true;
    order.updatedAt = new Date().toISOString();
    localStorage.setItem('rdn-orders', JSON.stringify(orders));
    adminStatusFeedback.textContent = `Status do pedido ${order.id} atualizado e salvo.`;
    renderAdmin();
});
adminSearch.addEventListener('input', renderAdmin);
adminFilter.addEventListener('change', renderAdmin);
document.querySelector('#admin-refresh').addEventListener('click', renderAdmin);
window.addEventListener('storage', renderAdmin);
renderAdmin();
