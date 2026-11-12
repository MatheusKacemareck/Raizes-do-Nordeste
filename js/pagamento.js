// Dados de finalização
const checkoutContent = document.querySelector('#checkout-content'),
    checkoutCount = document.querySelector('#checkout-count'),
    checkoutPoints = document.querySelector('#checkout-points'),
    checkoutSubtotal = document.querySelector('#checkout-subtotal'),
    checkoutFreight = document.querySelector('#checkout-freight'),
    checkoutTotal = document.querySelector('#checkout-total'),
    confirmOrder = document.querySelector('#confirm-order'),
    paymentDialog = document.querySelector('#payment-dialog'),
    paymentChoice = document.querySelector('#payment-choice'),
    paymentPix = document.querySelector('#payment-pix'),
    paymentCard = document.querySelector('#payment-card'),
    paymentProcessing = document.querySelector('#payment-processing'),
    paymentSuccess = document.querySelector('#payment-success'),
    cardForm = document.querySelector('#card-payment-form');
const checkoutSession = JSON.parse(localStorage.getItem('rdn-session') || 'null'),
    checkoutCart = JSON.parse(localStorage.getItem('rdn-cart') || '[]'),
    checkoutOptions = JSON.parse(localStorage.getItem('rdn-checkout-options') || 'null') || {
        mode: 'pickup',
        unit: LOCATIONS[0].id,
        address: '',
        note: '',
    };
const groupedItems = Object.values(
    checkoutCart.reduce((all, current) => {
        const key = `${current.item}|${current.redemption === true ? 'reward' : 'regular'}`;
        if (!all[key])
            all[key] = {
                item: current.item,
                qty: 0,
                redemption: current.redemption === true,
                pointsCost: Number(current.pointsCost) || 0,
            };
        all[key].qty += Number(current.qty) || 1;
        return all;
    }, {}),
);
const productByName = (name) => MENU_ITEMS.find((product) => product.name === name),
    money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const totalItems = groupedItems.reduce((sum, item) => sum + item.qty, 0),
    pointsRequired = groupedItems.filter((item) => item.redemption).reduce((sum, item) => sum + item.pointsCost * item.qty, 0),
    subtotal = groupedItems.filter((item) => !item.redemption).reduce((sum, item) => sum + (Number(productByName(item.item)?.priceValue) || 0) * item.qty, 0),
    freight = checkoutOptions.mode === 'delivery' ? 8 : 0,
    total = subtotal + freight,
    requiresPayment = total > 0;
const checkoutSafe = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
let processing = false,
    selectedCardMethod = 'Cartão de crédito',
    pixInterval = null,
    pixSeconds = 900;
// Ponto-pedido
function getNextOrderId(orders) {
    const year = String(new Date().getFullYear()),
        saved = JSON.parse(localStorage.getItem('rdn-order-sequence') || 'null'),
        greatest = orders.reduce((max, order) => {
            const match = String(order.id || '').match(new RegExp(`^#${year}(\\d{4,})$`));
            return match ? Math.max(max, Number(match[1])) : max;
        }, 0),
        next = Math.max(greatest, saved?.year === year ? Number(saved.value) || 0 : 0) + 1;
    localStorage.setItem('rdn-order-sequence', JSON.stringify({ year, value: next }));
    return `#${year}${String(next).padStart(4, '0')}`;
}
function currentBalance() {
    if (!checkoutSession) return 0;
    const users = JSON.parse(localStorage.getItem('rdn-users') || '[]');
    return Number(users.find((user) => user.email.toLowerCase() === checkoutSession.email.toLowerCase())?.pontos) || 0;
}
checkoutCount.textContent = totalItems;
checkoutPoints.textContent = `${pointsRequired} pontos`;
checkoutSubtotal.textContent = money(subtotal);
checkoutFreight.textContent = freight ? money(freight) : 'Grátis';
checkoutTotal.textContent = money(total);
if (!checkoutSession)
    checkoutContent.innerHTML = `<div class="checkout-empty"><i class="fa-solid fa-user-lock"></i><h2>Entre para confirmar</h2><p>O pedido precisa ser associado a um cliente cadastrado.</p><a class="button primary" href="login.html">Fazer login</a></div>`;
else if (!groupedItems.length)
    checkoutContent.innerHTML = `<div class="checkout-empty"><i class="fa-solid fa-basket-shopping"></i><h2>Seu carrinho está vazio</h2><a class="button primary" href="index.html">Abrir cardápio</a></div>`;
else {
    const unit = LOCATIONS.find((location) => location.id === checkoutOptions.unit) || LOCATIONS[0];
    checkoutContent.innerHTML = `<div class="checkout-customer"><i class="fa-solid fa-user"></i><div><small>Pedido de</small><strong>${checkoutSafe(checkoutSession.nome)}</strong></div></div><div class="checkout-fulfillment"><i class="fa-solid ${checkoutOptions.mode === 'delivery' ? 'fa-motorcycle' : 'fa-store'}"></i><div><small>${checkoutOptions.mode === 'delivery' ? 'Entrega em 40 a 60 minutos' : 'Retirada em 25 a 35 minutos'}</small><strong>${checkoutSafe(checkoutOptions.mode === 'delivery' ? checkoutOptions.address : `${unit.city} — ${unit.state}`)}</strong>${checkoutOptions.note ? `<p>Observação: ${checkoutSafe(checkoutOptions.note)}</p>` : ''}</div></div><div class="checkout-items">${groupedItems
        .map((item) => {
            const line = (Number(productByName(item.item)?.priceValue) || 0) * item.qty;
            return `<article class="${item.redemption ? 'checkout-reward' : ''}"><span>${item.qty}×</span><div><strong>${checkoutSafe(item.item)}</strong><small>${item.redemption ? `${item.pointsCost * item.qty} pontos · sem custo em dinheiro` : money(line)}</small></div><i class="fa-solid ${item.redemption ? 'fa-gift' : 'fa-check'}"></i></article>`;
        })
        .join('')}</div>`;
    if (pointsRequired > currentBalance()) {
        confirmOrder.disabled = true;
        document.querySelector('#checkout-note').innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Saldo insuficiente: você possui ${currentBalance()} pontos.`;
    } else if (checkoutOptions.mode === 'delivery' && !checkoutOptions.address.trim()) {
        confirmOrder.disabled = true;
        document.querySelector('#checkout-note').innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Volte ao carrinho e informe o endereço de entrega.`;
    } else confirmOrder.disabled = false;
}
const unavailableCheckoutItems = groupedItems.filter((item) => !produtoDisponivelNaUnidade(item.item, checkoutOptions.unit));
if (unavailableCheckoutItems.length) {
    confirmOrder.disabled = true;
    document.querySelector('#checkout-note').innerHTML =
        '<i class="fa-solid fa-circle-exclamation"></i> Há produtos indisponíveis na unidade escolhida. Volte ao carrinho para corrigir.';
}
// Janelas de pagament
function hidePaymentViews() {
    [paymentChoice, paymentPix, paymentCard, paymentProcessing, paymentSuccess].forEach((view) => (view.hidden = true));
}
function showPaymentChoice() {
    if (processing) return;
    clearInterval(pixInterval);
    hidePaymentViews();
    paymentChoice.hidden = false;
    cardForm.reset();
    cardForm.querySelector('.form-status').textContent = '';
}
function startProcessing(method, delay = 2200) {
    if (processing) return;
    processing = true;
    clearInterval(pixInterval);
    hidePaymentViews();
    paymentProcessing.hidden = false;
    document.querySelector('#processing-method').textContent = `Forma escolhida: ${method}`;
    setTimeout(() => completeOrder(method), delay);
}
function renderPixTimer() {
    document.querySelector('#pix-timer').textContent = `${String(Math.floor(pixSeconds / 60)).padStart(2, '0')}:${String(pixSeconds % 60).padStart(2, '0')}`;
}
// Pagamento PIX
function openPix() {
    hidePaymentViews();
    paymentPix.hidden = false;
    pixSeconds = 900;
    document.querySelector('#confirm-pix').disabled = false;
    document.querySelector('#copy-status').textContent = '';
    renderPixTimer();
    clearInterval(pixInterval);
    pixInterval = setInterval(() => {
        pixSeconds = Math.max(0, pixSeconds - 1);
        renderPixTimer();
        if (!pixSeconds) {
            clearInterval(pixInterval);
            document.querySelector('#confirm-pix').disabled = true;
        }
    }, 1000);
}
//cartão
function openCard(method) {
    selectedCardMethod = method;
    hidePaymentViews();
    paymentCard.hidden = false;
    document.querySelector('#card-title').textContent = method;
    cardForm.reset();
    cardForm.querySelector('.form-status').textContent = '';
}
confirmOrder.addEventListener('click', () => {
    if (confirmOrder.disabled) return;
    if (!requiresPayment) {
        paymentDialog.showModal();
        startProcessing('Resgate de pontos', 1800);
        return;
    }
    showPaymentChoice();
    paymentDialog.showModal();
});
document.querySelector('#cancel-payment').addEventListener('click', () => paymentDialog.close());
document.querySelectorAll('[data-payment-back]').forEach((button) => button.addEventListener('click', showPaymentChoice));
paymentDialog.addEventListener('cancel', (event) => {
    if (processing) event.preventDefault();
    else clearInterval(pixInterval);
});
document
    .querySelectorAll('[data-payment]')
    .forEach((button) => button.addEventListener('click', () => (button.dataset.payment === 'PIX' ? openPix() : openCard(button.dataset.payment))));
document.querySelector('#copy-pix').addEventListener('click', async () => {
    const input = document.querySelector('#pix-code'),
        status = document.querySelector('#copy-status');
    try {
        await navigator.clipboard.writeText(input.value);
    } catch {
        input.select();
        document.execCommand('copy');
    }
    status.textContent = 'Código demonstrativo copiado.';
});
document.querySelector('#confirm-pix').addEventListener('click', () => startProcessing('PIX'));
document.querySelector('#test-card-number').addEventListener('input', (event) => {
    event.target.value = event.target.value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
});
document.querySelector('#test-card-expiry').addEventListener('input', (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
    event.target.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
});
document.querySelector('#test-card-cvv').addEventListener('input', (event) => {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 3);
});
cardForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(cardForm)),
        status = cardForm.querySelector('.form-status');
    if (data.numero !== '4242 4242 4242 4242' || data.validade !== '12/30' || data.cvv !== '123') {
        status.textContent = 'Use exatamente os dados de teste indicados nos campos.';
        return;
    }
    startProcessing(selectedCardMethod);
});
//Salvamento pedido realizado
function completeOrder(method) {
    const pointsEarned = Math.floor(total / 4),
        users = JSON.parse(localStorage.getItem('rdn-users') || '[]'),
        userIndex = users.findIndex((user) => user.email.toLowerCase() === checkoutSession.email.toLowerCase());
    if (userIndex >= 0) {
        users[userIndex].pontos = Math.max(0, (Number(users[userIndex].pontos) || 0) - pointsRequired + pointsEarned);
        localStorage.setItem('rdn-users', JSON.stringify(users));
    }
    const orders = JSON.parse(localStorage.getItem('rdn-orders') || '[]'),
        unit = LOCATIONS.find((location) => location.id === checkoutOptions.unit) || LOCATIONS[0],
        order = {
            id: getNextOrderId(orders),
            email: checkoutSession.email.toLowerCase(),
            createdAt: new Date().toISOString(),
            status: 'Pedido recebido',
            paymentMethod: method,
            paymentSimulation: true,
            pointsRedeemed: pointsRequired,
            pointsEarned,
            items: groupedItems,
            subtotal,
            freight,
            total,
            fulfillment: {
                mode: checkoutOptions.mode,
                unit: `${unit.city} — ${unit.state}`,
                address: checkoutOptions.address,
                estimate: checkoutOptions.mode === 'delivery' ? '40 a 60 minutos' : '25 a 35 minutos',
            },
            note: checkoutOptions.note,
        };
    orders.push(order);
    localStorage.setItem('rdn-orders', JSON.stringify(orders));
    localStorage.removeItem('rdn-cart');
    localStorage.removeItem('rdn-checkout-options');
    document.querySelector('#success-order').innerHTML = `Pedido <strong>${checkoutSafe(order.id)}</strong>`;
    document.querySelector('#success-items').innerHTML = groupedItems
        .map((item) => `<p><strong>${item.qty}×</strong> ${checkoutSafe(item.item)} ${item.redemption ? `<small>(${item.pointsCost * item.qty} pontos)</small>` : ''}</p>`)
        .join('');
    document.querySelector('#success-method').innerHTML = !requiresPayment
        ? `<strong>${pointsRequired} pontos resgatados.</strong>`
        : `Total simulado: <strong>${money(total)}</strong> · ${checkoutSafe(method)}${pointsRequired ? ` · ${pointsRequired} pontos resgatados` : ''}${pointsEarned ? ` · <strong>+${pointsEarned} pontos ganhos</strong>` : ''}`;
    paymentProcessing.hidden = true;
    paymentSuccess.hidden = false;
    checkoutCount.textContent = '0';
    checkoutPoints.textContent = '0 pontos';
    checkoutSubtotal.textContent = money(0);
    checkoutFreight.textContent = 'Grátis';
    checkoutTotal.textContent = money(0);
    confirmOrder.disabled = true;
    confirmOrder.hidden = true;
    processing = false;
    checkoutContent.innerHTML = `<div class="checkout-success"><i class="fa-solid fa-circle-check"></i><h2>Pedido concluído!</h2><p>O pedido <strong>${checkoutSafe(order.id)}</strong> foi salvo no histórico.</p><a class="button primary" href="historico.html">Ver histórico</a></div>`;
}
document.querySelector('#payment-ok').addEventListener('click', () => {
    clearInterval(pixInterval);
    cardForm.reset();
    paymentDialog.close();
});
