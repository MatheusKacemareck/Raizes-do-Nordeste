//fidelidade
const pointsValue = document.querySelector('#points-value');
const pointsCustomer = document.querySelector('#points-customer');
const pointsMessage = document.querySelector('#points-message');
const pointsLogin = document.querySelector('#points-login');
const rewardsMenu = document.querySelector('#rewards-menu');
const rewardStatus = document.querySelector('#reward-status');
const loyaltySession = JSON.parse(localStorage.getItem('rdn-session') || 'null');
const loyaltySafe = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

function getBalance() {
    if (!loyaltySession) return 0;
    const users = JSON.parse(localStorage.getItem('rdn-users') || '[]');
    return Number(users.find((user) => user.email.toLowerCase() === loyaltySession.email.toLowerCase())?.pontos) || 0;
}

//saldo pontos e produtos pra troca
function renderRewards() {
    const balance = getBalance();
    const selectedUnit = localStorage.getItem('rdn-selected-unit') || LOCATIONS[0].id;
    const availableRewards = produtosDaUnidade(selectedUnit);
    if (loyaltySession) {
        pointsValue.textContent = balance.toLocaleString('pt-BR');
        pointsCustomer.textContent = `Saldo de ${loyaltySession.nome}`;
        pointsMessage.textContent = balance > 0 ? 'Estes são os pontos disponíveis para troca.' : 'Você ainda não possui pontos acumulados.';
        pointsLogin.textContent = 'Ver perfil';
        pointsLogin.href = 'perfil.html';
    }
    rewardsMenu.innerHTML = availableRewards
        .map(
            (product) =>
                `<article class="reward-card"><img src="${product.image}" alt="${loyaltySafe(product.name)}" loading="lazy"><div><span>${loyaltySafe(product.category)}</span><h3>${loyaltySafe(product.name)}</h3><strong><i class="fa-solid fa-star" aria-hidden="true"></i> ${product.rewardPoints} pontos</strong><button class="button primary" type="button" data-reward="${loyaltySafe(product.name)}" data-points="${product.rewardPoints}" ${!loyaltySession ? 'disabled' : ''}><i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Adicionar</button></div></article>`,
        )
        .join('');
}
rewardsMenu.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-reward]');
    if (!button) return;
    if (!loyaltySession) {
        rewardStatus.textContent = 'Entre em sua conta para adicionar recompensas.';
        return;
    }
    const selectedUnit = localStorage.getItem('rdn-selected-unit') || LOCATIONS[0].id;
    if (!produtoDisponivelNaUnidade(button.dataset.reward, selectedUnit)) {
        rewardStatus.textContent = 'Esta recompensa não está disponível na unidade selecionada.';
        return;
    }
    const cart = JSON.parse(localStorage.getItem('rdn-cart') || '[]');
    const existing = cart.find((item) => item.item === button.dataset.reward && item.redemption === true);
    if (existing) existing.qty = (Number(existing.qty) || 1) + 1;
    else
        cart.push({
            item: button.dataset.reward,
            qty: 1,
            redemption: true,
            pointsCost: Number(button.dataset.points),
        });
    localStorage.setItem('rdn-cart', JSON.stringify(cart));
    const count = cart.reduce((total, item) => total + (Number(item.qty) || 1), 0);
    document.querySelectorAll('[data-cart-count]').forEach((element) => (element.textContent = count));
    rewardStatus.textContent = `${button.dataset.reward} foi adicionado ao carrinho como recompensa.`;
});
renderRewards();
