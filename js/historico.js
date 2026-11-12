// Histórico e stat de pedidos
const historyList = document.querySelector('#history-list');
const historyCount = document.querySelector('#history-count');
const historySession = JSON.parse(localStorage.getItem('rdn-session') || 'null');
const safe = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const ORDER_STEPS = [
    { label: 'Pedido recebido', icon: 'fa-receipt', after: 0 },
    { label: 'Em preparo', icon: 'fa-fire-burner', after: 15000 },
    { label: 'Pronto para retirada', icon: 'fa-bag-shopping', after: 30000 },
    { label: 'Concluído', icon: 'fa-circle-check', after: 45000 },
];

function orderSteps(order) {
    const steps = ORDER_STEPS.map((step) => ({ ...step }));
    if (order.fulfillment?.mode === 'delivery') {
        steps[2].label = 'Saiu para entrega';
        steps[2].icon = 'fa-motorcycle';
    }
    return steps;
}

function currentOrderStep(order) {
    const steps = orderSteps(order);
    if (order.manualStatus) {
        const manualIndex = steps.findIndex((step) => step.label === order.status);
        if (manualIndex >= 0) return manualIndex;
        if (['Pronto para retirada', 'Saiu para entrega'].includes(order.status)) return 2;
    }
    const elapsed = Math.max(0, Date.now() - new Date(order.createdAt).getTime());
    return steps.reduce((current, step, index) => (elapsed >= step.after ? index : current), 0);
}

// remontagem e atualizçao
function renderHistory() {
    if (!historySession) {
        historyCount.textContent = 'Acesso necessário';
        historyList.innerHTML = `<div class="history-empty"><i class="fa-solid fa-user-lock" aria-hidden="true"></i><h2>Entre para ver seus pedidos</h2><p>O histórico é exibido de acordo com o cliente conectado.</p><a class="button primary" href="login.html">Fazer login</a></div>`;
        return;
    }
    const allOrders = JSON.parse(localStorage.getItem('rdn-orders') || '[]');
    let changed = false;
    allOrders.forEach((order) => {
        if (order.email !== historySession.email.toLowerCase() || order.manualStatus) return;
        const steps = orderSteps(order);
        const status = steps[currentOrderStep(order)].label;
        if (order.status !== status) {
            order.status = status;
            changed = true;
        }
    });
    if (changed) localStorage.setItem('rdn-orders', JSON.stringify(allOrders));
    const orders = allOrders.filter((order) => order.email === historySession.email.toLowerCase()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    historyCount.textContent = orders.length === 1 ? '1 pedido registrado' : `${orders.length} pedidos registrados`;
    historyList.innerHTML = orders.length
        ? orders
              .map((order) => {
                  const active = currentOrderStep(order);
                  const steps = orderSteps(order);
                  const date = new Intl.DateTimeFormat('pt-BR', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                  }).format(new Date(order.createdAt));
                  const quantity = order.items.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
                  const timeline = steps
                      .map(
                          (step, index) =>
                              `<li class="${index < active ? 'complete' : index === active ? 'active' : ''}"><i class="fa-solid ${step.icon}" aria-hidden="true"></i><span>${step.label}</span></li>`,
                      )
                      .join('');
                  return `<article class="history-card"><header><div><small>${safe(date)}</small><h2>Pedido ${safe(order.id)}</h2></div><span class="order-status status-${active}">${safe(steps[active].label)}</span></header><ol class="order-timeline" aria-label="Andamento do pedido">${timeline}</ol><div class="history-items">${order.items.map((item) => `<p><strong>${Number(item.qty) || 1}×</strong> ${safe(item.item)}${item.redemption ? ` <small>· recompensa de ${Number(item.pointsCost) || 0} pontos</small>` : ''}</p>`).join('')}${order.fulfillment ? `<p><i class="fa-solid ${order.fulfillment.mode === 'delivery' ? 'fa-motorcycle' : 'fa-store'}"></i> ${order.fulfillment.mode === 'delivery' ? 'Delivery' : 'Retirada'} · ${safe(order.fulfillment.estimate)}</p>` : ''}${order.note ? `<p><i class="fa-solid fa-pen"></i> ${safe(order.note)}</p>` : ''}${order.paymentMethod ? `<p class="history-payment"><i class="fa-solid fa-wallet" aria-hidden="true"></i> Pagamento simulado: <strong>${safe(order.paymentMethod)}</strong>${order.pointsRedeemed ? ` · <strong>${Number(order.pointsRedeemed)} pontos resgatados</strong>` : ''}${order.pointsEarned ? ` · <strong>+${Number(order.pointsEarned)} pontos ganhos</strong>` : ''}</p>` : ''}</div><footer><span><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> ${quantity} ${quantity === 1 ? 'item' : 'itens'}</span><strong>${Number.isFinite(Number(order.total)) ? Number(order.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : order.pointsRedeemed && !order.items.some((item) => !item.redemption) ? 'Sem cobrança em dinheiro' : 'Valor a confirmar'}</strong></footer></article>`;
              })
              .join('')
        : `<div class="history-empty"><i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i><h2>Nenhum pedido registrado</h2><p>Depois de confirmar um pedido, ele aparecerá aqui.</p><a class="button primary" href="index.html">Fazer primeiro pedido</a></div>`;
}

renderHistory();
if (historySession) setInterval(renderHistory, 1000);
