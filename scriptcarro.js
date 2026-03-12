// Funções de gerenciamento do carrinho
const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));

// Atualiza contador do carrinho
const updateCartCount = () => {
    const cartCount = document.getElementById('cart-count');
    const cart = getCart();
    cartCount.textContent = cart.length;
    cartCount.classList.toggle('highlight', cart.length > 0);
};

// Abre o modal de detalhes do produto
const openModal = (name, price, description, image) => {
    const modal = document.getElementById('product-modal');
    document.getElementById('modal-title').textContent = name;
    document.getElementById('modal-price').textContent = `R$ ${price.toFixed(2)}`;
    document.getElementById('modal-description').textContent = description;
    document.getElementById('modal-image').src = image;
    document.getElementById('modal-image').alt = `Imagem de ${name}`;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
    modal.focus(); // Garante foco no modal para acessibilidade
};

// Fecha o modal
const closeModal = () => {
    const modal = document.getElementById('product-modal');
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('active');
};

// Adiciona produto ao carrinho
const addToCart = () => {
    const name = document.getElementById('modal-title').textContent;
    const price = parseFloat(document.getElementById('modal-price').textContent.replace('R$', '').trim());
    const image = document.getElementById('modal-image').src;
    const cart = getCart();
    cart.push({ name, price, image });
    saveCart(cart);
    updateCartCount();
    alert('Produto adicionado ao carrinho!');
    closeModal();
};

// Carrega produtos dinamicamente
const loadProducts = () => {
    fetch('products.json')
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar os produtos.');
            return response.json();
        })
        .then(products => {
            const offersSection = document.querySelector('.offers-section');
            products.forEach(product => {
                const productHTML = `
                    <div class="offer">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>R$ ${product.price.toFixed(2)}</p>
                        <button class="view-details" data-description="${product.description}">Ver Detalhes</button>
                    </div>`;
                offersSection.insertAdjacentHTML('beforeend', productHTML);
            });

            // Adiciona eventos aos botões de "Ver Detalhes"
            document.querySelectorAll('.view-details').forEach(button => {
                button.addEventListener('click', (event) => {
                    const offer = event.target.closest('.offer');
                    const name = offer.querySelector('h3').textContent;
                    const price = parseFloat(offer.querySelector('p').textContent.replace('R$', '').trim());
                    const description = button.dataset.description;
                    const image = offer.querySelector('img').src;
                    openModal(name, price, description, image);
                });
            });
        })
        .catch(error => console.error('Erro ao carregar produtos:', error.message));
};

// Fechar modal com clique fora ou tecla ESC
document.addEventListener('click', (event) => {
    if (event.target.id === 'product-modal' || event.target.id === 'close-modal') closeModal();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
});

// Redireciona ao carrinho ao clicar no ícone
document.getElementById('cart').addEventListener('click', () => {
    window.location.href = 'carrinho.html';
});

// Adiciona produto ao carrinho ao clicar no botão
document.getElementById('add-to-cart').addEventListener('click', addToCart);

// Atualiza o carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadProducts();
});


