const SITE_CONFIG = {
    phone: '',
    email: '',
    instagram: '',
    canonical: 'https://raizes-do-nordeste.example/',
};

// Itens do Cardápio
const MENU_ITEMS = [
    {
        id: 'tapioca',
        name: 'Tapioca de Camarão',
        category: 'Pratos principais',
        image: 'assets/produtos/tapioca-camarao.png',
        detail: 'Aquela boa e velha tapioca, feita com massa de qualidade, tempero a gosto do chefe e recheio de camarão.',
        preparationTime: 'Tempo de preparo a confirmar.',
        rating: 'Avaliação ainda não disponível.',
        price: 'R$ 12,00',
        priceValue: 12,
        rewardPoints: 12,
        tags: [],
    },
    {
        id: 'acaraje',
        name: 'Acarajé recheado de Frango',
        category: 'Pratos principais',
        image: 'assets/produtos/acaraje-frango.png',
        detail: 'Acarajé com massa de feijão, tempero de cebola e sal, azeite de dendê e pedaços de frango.',
        preparationTime: '25 a 45 min.',
        rating: 'Avaliação ainda não disponível.',
        price: 'R$ 17,00',
        priceValue: 17,
        rewardPoints: 17,
        tags: [],
    },
    {
        id: 'mugunza',
        name: 'Mungunzá',
        category: 'Sobremesas',
        image: 'assets/produtos/mugunza.png',
        detail: 'A mugunzinha tradicional, com grãos de milho e caldo cremoso de milho, açúcar, canela e cravo.',
        preparationTime: '15 min.',
        rating: 'Avaliação ainda não disponível.',
        price: 'R$ 8,00',
        priceValue: 8,
        rewardPoints: 8,
        tags: [],
    },
    {
        id: 'bolo',
        name: 'Bolo de milho',
        category: 'Sobremesas',
        image: 'assets/produtos/bolo-de-milho.png',
        detail: 'Bolinho caseiro de milho pra matar a fome',
        preparationTime: '20 min.',
        rating: 'Avaliação ainda não disponível.',
        price: 'R$ 13,00',
        priceValue: 13,
        rewardPoints: 13,
        tags: [],
    },
    {
        id: 'amendoim',
        name: 'Amendoim frito',
        category: 'Entradas',
        image: 'assets/produtos/amendoim-frito.png',
        detail: 'Amendoinzinho frito para tirar gosto.',
        preparationTime: '10 min.',
        rating: 'Avaliação ainda não disponível.',
        price: 'R$ 8,00',
        priceValue: 8,
        rewardPoints: 8,
        tags: [],
    },
    {
        id: 'vatapa',
        name: 'Vatapá',
        category: 'Pratos principais',
        image: 'assets/produtos/vatapa.png',
        detail: 'Vatapá cremoso com o tradicional tempero nordestino.',
        preparationTime: '20 a 35 min.',
        rating: 'Avaliação ainda não disponível.',
        price: 'R$ 18,00',
        priceValue: 18,
        rewardPoints: 18,
        tags: [],
    },
    {
        id: 'baiao-de-dois',
        name: 'Baião de Dois',
        category: 'Pratos principais',
        image: 'assets/produtos/baiao-de-dois.png',
        detail: 'Aquele baião arretado que a gente ama, com arroz, feijão fradinho, queijo coalho, carne de sol e manteiga de garrafa, finalizado com tempero do chefe.',
        preparationTime: '40 a 60 min.',
        rating: 'Avaliação ainda não disponível.',
        price: 'R$ 20,00',
        priceValue: 20,
        rewardPoints: 20,
        tags: [],
    },
    {
        id: 'coxinha-macaxeira',
        name: 'Coxinha de macaxeira de Frango',
        category: 'Lanches',
        image: 'assets/produtos/coxinha-macaxeira.png',
        detail: 'A coxinha perfeita para matar a sua fome, feita com frango desfiado, requeijão e a massa crocante de macaxeira.',
        preparationTime: '15 min',
        rating: 'Avaliação ainda não disponível.',
        price: 'R$ 10,00',
        priceValue: 10,
        rewardPoints: 10,
        tags: [],
    },
    {
        id: 'acerola',
        name: 'Suco de acerola',
        category: 'Bebidas',
        image: 'assets/produtos/suco-acerola.png',
        detail: 'Um suco refrescante e arretado com as acerolas mais frescas.',
        preparationTime: '10 min.',
        rating: 'Avaliação ainda não disponível.',
        price: 'R$ 11,00',
        priceValue: 11,
        rewardPoints: 11,
        tags: [],
    },
    {
        id: 'acai',
        name: 'Suco de açaí',
        category: 'Bebidas',
        image: 'assets/produtos/suco-acai.png',
        detail: 'Delicioso e rico suco de açaí.',
        preparationTime: '10 min.',
        rating: 'Avaliação ainda não disponível.',
        price: 'R$ 12,00',
        priceValue: 12,
        rewardPoints: 12,
        tags: [],
    },
    {
        id: 'cuscuz',
        name: 'Cuscuz de carne seca',
        category: 'Pratos principais',
        image: 'assets/produtos/cuscuz-carne-seca-banana.png',
        detail: 'Um Cuscuz danado de bom, recheado com carne seca, cebola, banana da terra e um leve toque de coentro.',
        preparationTime: '35 a 50 min.',
        rating: 'Avaliação ainda não disponível.',
        price: 'R$ 15,00',
        priceValue: 15,
        rewardPoints: 15,
        tags: [],
    },
];

// Unidades
const LOCATIONS = [
    {
        id: 'recife',
        city: 'Recife',
        state: 'PE',
        name: 'Unidade Recife',
        address: 'Rua Demonstrativa das Raízes, 120 — Boa Viagem',
        reference: 'Próxima à orla de Boa Viagem',
        phone: '(81) 0000-0101',
        hours: 'Terça a domingo, 18h às 23h',
        services: ['Salão climatizado', 'Retirada', 'Delivery demonstrativo'],
        parking: 'Estacionamento conveniado',
        accessibility: 'Acesso para cadeirantes',
        mapQuery: 'Recife PE',
    },
    {
        id: 'fortaleza',
        city: 'Fortaleza',
        state: 'CE',
        name: 'Unidade Fortaleza',
        address: 'Avenida Demonstrativa do Sertão, 245 — Meireles',
        reference: 'Próxima à Avenida Beira-Mar',
        phone: '(85) 0000-0202',
        hours: 'Terça a domingo, 18h às 23h',
        services: ['Salão climatizado', 'Retirada', 'Atendimento a grupos'],
        parking: 'Estacionamento no local',
        accessibility: 'Entrada e banheiro acessíveis',
        mapQuery: 'Fortaleza CE',
    },
    {
        id: 'salvador',
        city: 'Salvador',
        state: 'BA',
        name: 'Unidade Salvador',
        address: 'Alameda Demonstrativa do Dendê, 80 — Rio Vermelho',
        reference: 'Próxima ao Largo de Santana',
        phone: '(71) 0000-0303',
        hours: 'Terça a domingo, 18h às 23h',
        services: ['Área externa', 'Retirada', 'Delivery demonstrativo'],
        parking: 'Serviço de manobrista demonstrativo',
        accessibility: 'Acesso sem degraus',
        mapQuery: 'Salvador BA',
    },
];

const CARDAPIO_POR_UNIDADE = {
    // Indisponíveis em Recife: coxinha de macaxeira e suco de açaí.
    recife: ['tapioca', 'acaraje', 'mugunza', 'bolo', 'amendoim', 'vatapa', 'baiao-de-dois', 'acerola', 'cuscuz'],

    // Indisponíveis em Fortaleza: acarajé, mungunzá e suco de acerola.
    fortaleza: ['tapioca', 'bolo', 'amendoim', 'vatapa', 'baiao-de-dois', 'coxinha-macaxeira', 'acai', 'cuscuz'],

    // Indisponíveis em Salvador: tapioca, bolo de milho e baião de dois.
    salvador: ['acaraje', 'mugunza', 'amendoim', 'vatapa', 'coxinha-macaxeira', 'acerola', 'acai', 'cuscuz'],
};

function produtosDaUnidade(unidadeId) {
    const idsDisponiveis = CARDAPIO_POR_UNIDADE[unidadeId] || [];
    return MENU_ITEMS.filter((produto) => idsDisponiveis.includes(produto.id));
}

function produtoDisponivelNaUnidade(nomeProduto, unidadeId) {
    return produtosDaUnidade(unidadeId).some((produto) => produto.name === nomeProduto);
}

// Ajusta dados salvos por versões anteriores do cardápio.
function atualizarDadosLocais() {
    const nomesAtualizados = {
        Tapioca: 'Tapioca de Camarão',
        'Acarajé recheado': 'Acarajé recheado de Frango',
    };
    const nomesValidos = MENU_ITEMS.map((produto) => produto.name);

    try {
        const carrinhoAntigo = JSON.parse(localStorage.getItem('rdn-cart') || '[]');
        const carrinhoAtualizado = [];

        if (Array.isArray(carrinhoAntigo)) {
            carrinhoAntigo.forEach((item) => {
                if (!item || typeof item.item !== 'string') return;

                const nome = nomesAtualizados[item.item] || item.item;
                if (!nomesValidos.includes(nome)) return;

                const quantidade = Math.max(1, Number(item.qty) || 1);
                const resgate = item.redemption === true;
                const existente = carrinhoAtualizado.find((produto) => produto.item === nome && produto.redemption === resgate);

                if (existente) {
                    existente.qty += quantidade;
                    return;
                }

                const produtoAtual = MENU_ITEMS.find((produto) => produto.name === nome);
                carrinhoAtualizado.push({
                    ...item,
                    item: nome,
                    qty: quantidade,
                    redemption: resgate,
                    ...(resgate ? { pointsCost: Number(produtoAtual.rewardPoints) || 0 } : {}),
                });
            });
        }

        localStorage.setItem('rdn-cart', JSON.stringify(carrinhoAtualizado));

        const unidadeSalva = localStorage.getItem('rdn-selected-unit');
        if (unidadeSalva && !LOCATIONS.some((unidade) => unidade.id === unidadeSalva)) {
            localStorage.setItem('rdn-selected-unit', LOCATIONS[0].id);
        }

        const opcoes = JSON.parse(localStorage.getItem('rdn-checkout-options') || 'null');
        if (opcoes) {
            opcoes.unit = LOCATIONS.some((unidade) => unidade.id === opcoes.unit) ? opcoes.unit : LOCATIONS[0].id;
            opcoes.mode = ['pickup', 'delivery'].includes(opcoes.mode) ? opcoes.mode : 'pickup';
            localStorage.setItem('rdn-checkout-options', JSON.stringify(opcoes));
        }

        localStorage.setItem('rdn-data-version', '2');
    } catch (erro) {
        console.warn('Não foi possível atualizar os dados locais.', erro);
    }
}

atualizarDadosLocais();
