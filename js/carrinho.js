//elemntos e dado pro carrinho
const cartList = document.querySelector('#cart-list');
const cartTotalItems = document.querySelector('#cart-total-items');
const cartCheckout = document.querySelector('#cart-checkout');
const cartSafe = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const savedCartUnit = localStorage.getItem('rdn-selected-unit');
const defaultCartUnit = LOCATIONS.some((location) => location.id === savedCartUnit) ? savedCartUnit : LOCATIONS[0].id;

let cartItems = Object.values(
    JSON.parse(localStorage.getItem('rdn-cart') || '[]').reduce((grouped, current) => {
        const key = `${current.item}|${current.redemption === true ? 'reward' : 'regular'}`;
        if (!grouped[key])
            grouped[key] = {
                item: current.item,
                qty: 0,
                redemption: current.redemption === true,
                pointsCost: Number(current.pointsCost) || 0,
            };
        grouped[key].qty += Number(current.qty) || 1;
        return grouped;
    }, {}),
);
let checkoutOptions = JSON.parse(localStorage.getItem('rdn-checkout-options') || 'null') || {
    mode: 'pickup',
    unit: defaultCartUnit,
    address: '',
    note: '',
};
checkoutOptions.mode = checkoutOptions.mode || 'pickup';
checkoutOptions.unit = LOCATIONS.some((location) => location.id === checkoutOptions.unit) ? checkoutOptions.unit : defaultCartUnit;
checkoutOptions.address = checkoutOptions.address || '';
checkoutOptions.note = checkoutOptions.note || '';

const productData = (name) => MENU_ITEMS.find((product) => product.name === name) || null;

function saveAll() {
    localStorage.setItem('rdn-cart', JSON.stringify(cartItems));
    localStorage.setItem('rdn-checkout-options', JSON.stringify(checkoutOptions));
    localStorage.setItem('rdn-selected-unit', checkoutOptions.unit);
}
function totals() {
    const subtotal = cartItems.filter((item) => !item.redemption).reduce((sum, item) => sum + (Number(productData(item.item)?.priceValue) || 0) * item.qty, 0);
    const points = cartItems.filter((item) => item.redemption).reduce((sum, item) => sum + item.pointsCost * item.qty, 0);
    const freight = checkoutOptions.mode === 'delivery' ? 8 : 0;
    return { subtotal, points, freight, total: subtotal + freight };
}

function renderCart() {
    const quantity = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const regularQuantity = cartItems.filter((item) => !item.redemption).reduce((sum, item) => sum + item.qty, 0);
    const summary = totals();
    cartTotalItems.textContent = quantity;
    document.querySelectorAll('[data-cart-count]').forEach((element) => (element.textContent = quantity));
    cartCheckout.hidden = !cartItems.length;
    document.querySelector('#clear-cart').hidden = !cartItems.length;
    cartList.innerHTML = cartItems.length
        ? cartItems
              .map((item, index) => {
                  const product = productData(item.item);
                  const unitValue = item.redemption ? `${item.pointsCost} pontos` : money(Number(product?.priceValue) || 0);
                  const lineValue = item.redemption ? `${item.pointsCost * item.qty} pontos` : money((Number(product?.priceValue) || 0) * item.qty);
                  return `<article class="cart-item ${item.redemption ? 'reward-cart-item' : ''}"><img src="${product?.image || 'assets/favicon.png'}" alt="${cartSafe(item.item)}"><div class="cart-item-info"><span>${item.redemption ? 'Recompensa de fidelidade' : cartSafe(product?.category || 'Produto')}</span><h3>${cartSafe(item.item)}</h3><p>${unitValue} por unidade · <strong>${lineValue}</strong></p><div class="quantity-control"><button type="button" data-action="decrease" data-index="${index}" aria-label="Diminuir quantidade" ${item.qty <= 1 ? 'disabled' : ''}><i class="fa-solid fa-minus"></i></button><strong>${item.qty}</strong><button type="button" data-action="increase" data-index="${index}" aria-label="Aumentar quantidade"><i class="fa-solid fa-plus"></i></button></div></div><button class="remove-item" type="button" data-action="remove" data-index="${index}" aria-label="Remover ${cartSafe(item.item)}"><i class="fa-solid fa-trash-can"></i></button></article>`;
              })
              .join('')
        : `<div class="cart-empty"><i class="fa-solid fa-cart-shopping"></i><h2>Seu carrinho está vazio</h2><p>Escolha produtos no cardápio ou recompensas na página de fidelidade.</p><a class="button primary" href="index.html">Abrir cardápio</a></div>`;
    if (cartItems.length) {
        document.querySelector('#cart-regular-count').textContent = `${regularQuantity} ${regularQuantity === 1 ? 'item' : 'itens'}`;
        document.querySelector('#cart-reward-summary').textContent = `${summary.points} pontos`;
        document.querySelector('#cart-subtotal').textContent = money(summary.subtotal);
        document.querySelector('#cart-freight').textContent = summary.freight ? money(summary.freight) : 'Grátis';
        document.querySelector('#cart-total').textContent = money(summary.total);
    }
    saveAll();
}



function renderOptions() {
    document.querySelectorAll('[data-mode]').forEach((button) => {
        const active = button.dataset.mode === checkoutOptions.mode;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', active);
    });
    document.querySelector('#pickup-fields').hidden = checkoutOptions.mode !== 'pickup';
    document.querySelector('#delivery-fields').hidden = checkoutOptions.mode !== 'delivery';
    document.querySelector('#delivery-estimate').innerHTML =
        checkoutOptions.mode === 'delivery'
            ? `<i class="fa-regular fa-clock"></i><span>Previsão de entrega: <strong>40 a 60 minutos</strong></span>`
            : `<i class="fa-regular fa-clock"></i><span>Previsão para retirada: <strong>25 a 35 minutos</strong></span>`;
    document.querySelector('#cart-unit').value = checkoutOptions.unit;
    document.querySelector('#cart-address').value = checkoutOptions.address;
    document.querySelector('#cart-note').value = checkoutOptions.note;
    document.querySelector('#note-count').textContent = checkoutOptions.note.length;
    renderCart();
}

document.querySelector('#cart-unit').innerHTML = LOCATIONS.map((location) => `<option value="${location.id}">${location.city} — ${location.state}</option>`).join('');


cartList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const index = Number(button.dataset.index);
    const item = cartItems[index];
    if (!item) return;
    if (button.dataset.action === 'increase') item.qty++;
    if (button.dataset.action === 'decrease' && item.qty > 1) item.qty--;
    if (button.dataset.action === 'remove') cartItems.splice(index, 1);
    renderCart();
});

document.querySelector('#clear-cart').addEventListener('click', () => {
    if (confirm('Deseja remover todos os itens do carrinho?')) {
        cartItems = [];
        renderCart();
    }
});

document.querySelectorAll('[data-mode]').forEach((button) =>
    button.addEventListener('click', () => {
        checkoutOptions.mode = button.dataset.mode;
        renderOptions();
    }),
);
document.querySelector('#cart-unit').addEventListener('change', (event) => {
    const newUnit = event.target.value;
    const unavailable = cartItems.filter((item) => !produtoDisponivelNaUnidade(item.item, newUnit));
    if (unavailable.length) {
        const names = [...new Set(unavailable.map((item) => item.item))].join(', ');
        const removeItems = confirm(`Os seguintes itens não estão disponíveis nesta unidade: ${names}. Deseja removê-los e continuar?`);
        if (!removeItems) {
            event.target.value = checkoutOptions.unit;
            return;
        }
        cartItems = cartItems.filter((item) => produtoDisponivelNaUnidade(item.item, newUnit));
    }
    checkoutOptions.unit = newUnit;
    renderCart();
});

document.querySelector('#cart-address').addEventListener('input', (event) => {
    checkoutOptions.address = event.target.value;
    saveAll();
});
document.querySelector('#cart-note').addEventListener('input', (event) => {
    checkoutOptions.note = event.target.value;
    document.querySelector('#note-count').textContent = event.target.value.length;
    saveAll();
});
document.querySelector('#continue-checkout').addEventListener('click', (event) => {
    const validation = document.querySelector('#cart-validation');
    const unavailable = cartItems.filter((item) => !produtoDisponivelNaUnidade(item.item, checkoutOptions.unit));
    if (unavailable.length) {
        event.preventDefault();
        validation.textContent = 'O carrinho contém produtos indisponíveis na unidade escolhida.';
    } else if (checkoutOptions.mode === 'delivery' && !checkoutOptions.address.trim()) {
        event.preventDefault();
        validation.textContent = 'Informe o endereço para continuar com o delivery.';
        document.querySelector('#cart-address').focus();
    } else {
        validation.textContent = '';
        saveAll();
    }
});
renderOptions();
