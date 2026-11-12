// Configuraçção geral
const currentFile = decodeURIComponent(location.pathname).split('/').pop().toLowerCase() || 'index.html';
const page = currentFile === 'historico.html' ? 'pedidos' : currentFile === 'carrinho.html' ? 'carrinho' : document.body.dataset.page;
const nav = [
    ['Cardápio', 'index.html', 'inicio'],
    ['Carrinho', 'carrinho.html', 'carrinho'],
    ['Pedidos', 'historico.html', 'pedidos'],
    ['Unidades', 'unidades.html', 'unidades'],
    ['Conta', 'login.html', 'login'],
];

// Máscara de telefone
document.addEventListener('input', (event) => {
    if (!event.target.matches('input[autocomplete="tel"]')) return;
    const digits = event.target.value.replace(/\D/g, '').slice(0, 11);
    event.target.value =
        digits.length > 10
            ? digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
            : digits.length > 6
              ? digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
              : digits.length > 2
                ? digits.replace(/(\d{2})(\d+)/, '($1) $2')
                : digits.length
                  ? `(${digits}`
                  : '';
});
if (!document.querySelector('link[href*="font-awesome"]')) {
    const iconStyles = document.createElement('link');
    iconStyles.rel = 'stylesheet';
    iconStyles.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css';
    iconStyles.crossOrigin = 'anonymous';
    iconStyles.referrerPolicy = 'no-referrer';
    document.head.appendChild(iconStyles);
}

// Cabeçalho menu e rodapé
const header = document.querySelector('#cabecalho');
if (!header.innerHTML.trim()) {
    header.innerHTML = `<div class="site-header"><div class="container nav-wrap"><a class="logo" href="index.html" aria-label="Raízes do Nordeste — início"><img src="assets/logo.png" alt="Raízes do Nordeste"></a><div class="header-actions"><a class="header-units" href="unidades.html"><i class="fa-solid fa-location-dot" aria-hidden="true"></i><span>Unidades</span></a><button class="menu-toggle" aria-expanded="false" aria-controls="main-nav">Menu</button></div><nav class="main-nav" id="main-nav" aria-label="Menu principal">${nav.map((item) => `<a ${page === item[2] ? 'class="active" aria-current="page"' : ''} href="${item[1]}">${item[0]}</a>`).join('')}</nav></div></div>`;
}
document.querySelector('#rodape').innerHTML =
    `<div class="legal-strip"><p>Ao utilizar este site, você concorda com nossos <a href="termos.html">Termos de Uso</a> e <a href="lgpd.html">Política de Privacidade</a>.<br>©<span data-year></span> Raízes do Nordeste LTDA</p></div>`;
document.querySelector('[data-year]').textContent = new Date().getFullYear();

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'Fechar' : 'Menu';
});

// Montagem dos produtos
const safeText = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const productDetails = (product) =>
    `<details class="product-details"><summary>Mais detalhes</summary><p>${safeText(product.detail)}</p><p><i class="fa-regular fa-clock" aria-hidden="true"></i> ${safeText(product.preparationTime)}</p><p><i class="fa-regular fa-star" aria-hidden="true"></i> ${safeText(product.rating)}</p></details>`;
const card = (product) =>
    `<article class="product-card"><img src="${product.image}" alt="${safeText(product.name)}" loading="lazy"><div class="product-body"><div class="meta"><span class="tag">${safeText(product.category)}</span>${product.tags.map((tag) => `<span class="tag">${safeText(tag)}</span>`).join('')}</div><h3>${safeText(product.name)}</h3>${productDetails(product)}<p class="price">${product.price}</p><button class="button primary order-button" data-product="${safeText(product.name)}">Adicionar ao pedido</button></div></article>`;
const deliveryCard = (product, available) =>
    `<article class="delivery-product ${available ? '' : 'product-unavailable'}"><img src="${product.image}" alt="${safeText(product.name)}" loading="lazy"><div class="delivery-product-info"><span>${safeText(product.category)}</span><h2>${safeText(product.name)}</h2>${productDetails(product)}${available ? `<strong>${product.price}</strong>` : '<strong class="unavailable-label"><i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Indisponível nesta unidade</strong>'}</div><button class="add-product order-button" data-product="${safeText(product.name)}" aria-label="${available ? `Adicionar ${safeText(product.name)} ao pedido` : `${safeText(product.name)} indisponível nesta unidade`}" ${available ? '' : 'disabled'}>+</button></article>`;

//unidades
document.querySelectorAll('[data-locations]').forEach((element) => {
    element.innerHTML = LOCATIONS.map(
        (location) =>
            `<article class="location-card detailed-location"><div class="location-card-head"><div><span class="eyebrow">Unidade demonstrativa</span><h3>${location.city} — ${location.state}</h3></div><i class="fa-solid fa-location-dot" aria-hidden="true"></i></div><address>${location.address}</address><p class="location-reference"><i class="fa-solid fa-map-pin" aria-hidden="true"></i> ${location.reference}</p><div class="location-details"><p><i class="fa-solid fa-phone" aria-hidden="true"></i><span><small>Telefone demonstrativo</small>${location.phone}</span></p><p><i class="fa-solid fa-clock" aria-hidden="true"></i><span><small>Funcionamento</small>${location.hours}</span></p><p><i class="fa-solid fa-car" aria-hidden="true"></i><span><small>Estacionamento</small>${location.parking}</span></p><p><i class="fa-solid fa-wheelchair" aria-hidden="true"></i><span><small>Acessibilidade</small>${location.accessibility}</span></p></div><ul class="location-services">${location.services.map((service) => `<li><i class="fa-solid fa-check" aria-hidden="true"></i>${service}</li>`).join('')}</ul><div class="mock-map"><i class="fa-solid fa-map-location-dot" aria-hidden="true"></i><strong>Visualização demonstrativa</strong><span>${location.city}, ${location.state}</span></div><a class="button primary" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapQuery)}" target="_blank" rel="noopener">Ver região no mapa <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></article>`,
    ).join('');
});

//cardápio de unidade
const savedUnit = localStorage.getItem('rdn-selected-unit');
let selectedUnit = LOCATIONS.some((location) => location.id === savedUnit) ? savedUnit : LOCATIONS[0].id;
localStorage.setItem('rdn-selected-unit', selectedUnit);

function updateCheckoutUnit(unitId) {
    const options = JSON.parse(localStorage.getItem('rdn-checkout-options') || 'null') || {
        mode: 'pickup',
        address: '',
        note: '',
    };
    options.unit = unitId;
    localStorage.setItem('rdn-checkout-options', JSON.stringify(options));
}
function changeSelectedUnit(newUnit, selectElement) {
    const previousUnit = selectedUnit;
    const cart = JSON.parse(localStorage.getItem('rdn-cart') || '[]');
    const unavailable = cart.filter((item) => !produtoDisponivelNaUnidade(item.item, newUnit));
    if (unavailable.length) {
        const names = [...new Set(unavailable.map((item) => item.item))].join(', ');
        const removeItems = confirm(`Os seguintes itens não estão disponíveis na nova unidade: ${names}. Deseja removê-los e trocar de unidade?`);
        if (!removeItems) {
            if (selectElement) selectElement.value = previousUnit;
            return false;
        }
        const validCart = cart.filter((item) => produtoDisponivelNaUnidade(item.item, newUnit));
        localStorage.setItem('rdn-cart', JSON.stringify(validCart));
    }
    selectedUnit = newUnit;
    localStorage.setItem('rdn-selected-unit', selectedUnit);
    updateCheckoutUnit(selectedUnit);
    updateCartCount();
    return true;
}

const unitSelect = document.querySelector('#unit-select');
if (unitSelect) {
    unitSelect.innerHTML = LOCATIONS.map((location) => `<option value="${location.id}">${location.city} — ${location.state}</option>`).join('');
    unitSelect.value = selectedUnit;
}

// Busca e categorias do cardápio
const homeMenu = document.querySelector('[data-home-menu]');
if (homeMenu) {
    const filterBox = document.querySelector('[data-home-filters]');
    const search = document.querySelector('#menu-search');
    const empty = document.querySelector('[data-home-empty]');
    let activeCategory = 'Todos';

    function renderCategories() {
        const categories = ['Todos', ...new Set(MENU_ITEMS.map((product) => product.category))];
        if (!categories.includes(activeCategory)) activeCategory = 'Todos';
        filterBox.innerHTML = categories
            .map(
                (category) => `<button class="delivery-filter ${category === activeCategory ? 'active' : ''}" data-category="${safeText(category)}">${safeText(category)}</button>`,
            )
            .join('');
    }
    function renderMenu() {
        const term = search.value.trim().toLocaleLowerCase('pt-BR');
        const products = MENU_ITEMS.filter(
            (product) =>
                (activeCategory === 'Todos' || product.category === activeCategory) &&
                (!term || `${product.name} ${product.detail}`.toLocaleLowerCase('pt-BR').includes(term)),
        );
        homeMenu.innerHTML = products.map((product) => deliveryCard(product, produtoDisponivelNaUnidade(product.name, selectedUnit))).join('');
        empty.hidden = products.length > 0;
    }

    filterBox.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-category]');
        if (!button) return;
        activeCategory = button.dataset.category;
        renderCategories();
        renderMenu();
    });
    search.addEventListener('input', renderMenu);
    unitSelect.addEventListener('change', (event) => {
        if (!changeSelectedUnit(event.target.value, event.target)) return;
        activeCategory = 'Todos';
        renderCategories();
        renderMenu();
    });
    renderCategories();
    renderMenu();
}

document.querySelectorAll('[data-featured-products]').forEach((element) => {
    element.innerHTML = produtosDaUnidade(selectedUnit).slice(0, 3).map(card).join('');
});

// Carrinho flutuante
if (currentFile === 'index.html') {
    document.body.insertAdjacentHTML(
        'beforeend',
        `<a class="floating-cart" href="carrinho.html" aria-label="Abrir carrinho"><i class="fa-solid fa-cart-shopping" aria-hidden="true"></i><span data-cart-count>0</span></a>`,
    );
}

function updateCartCount() {
    const count = JSON.parse(localStorage.getItem('rdn-cart') || '[]').reduce((total, item) => total + (Number(item.qty) || 1), 0);
    document.querySelectorAll('[data-cart-count]').forEach((element) => (element.textContent = count));
}

document.addEventListener('click', (event) => {
    const button = event.target.closest('.order-button');
    if (!button) return;
    const item = button.dataset.product;
    if (!produtoDisponivelNaUnidade(item, selectedUnit)) {
        alert('Este produto não está disponível na unidade selecionada.');
        return;
    }
    const cart = JSON.parse(localStorage.getItem('rdn-cart') || '[]');
    const existing = cart.find((entry) => entry.item === item && entry.redemption !== true);
    if (existing) existing.qty = (Number(existing.qty) || 1) + 1;
    else cart.push({ item, qty: 1, redemption: false });
    localStorage.setItem('rdn-cart', JSON.stringify(cart));
    button.textContent = '✓';
    button.setAttribute('aria-label', `${item} adicionado ao pedido`);
    updateCartCount();
});
updateCartCount();

const topBtn = document.querySelector('#back-top');
addEventListener('scroll', () => topBtn.classList.toggle('visible', scrollY > 500));
topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
