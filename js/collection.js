document.addEventListener('DOMContentLoaded', () => {
    let allProducts = [];
    const container = document.getElementById('product-container');
    const noResults = document.getElementById('no-results');
    const title = document.getElementById('collection-title');
    const searchForm = document.getElementById('nav-search-form');
    const searchInput = document.getElementById('nav-search-input');

    // Initial load
    fetch('products.json')
        .then(res => res.json())
        .then(data => {
            allProducts = data;

            // Check for category filter in URL
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');
            const searchQuery = urlParams.get('q');

            if (category) {
                applyFilter(category);
                updateActiveButton(category);
            } else if (searchQuery) {
                searchInput.value = searchQuery;
                handleSearch(searchQuery);
            } else {
                renderProducts(allProducts);
            }
        });

    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            updateActiveButton(filter);
            applyFilter(filter);
        });
    });

    // Search Form
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSearch(searchInput.value);
    });

    function renderProducts(products) {
        container.innerHTML = '';
        if (products.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        noResults.style.display = 'none';

        products.forEach(p => {
            const card = `
                <div class="product-card" onclick="window.open('product-detail.html?id=${p.id}', '_blank')">
                    <div class="product-image">
                        <img src="${p.image}" alt="${p.title}" />
                        <button class="favorite-btn ${Store.wishlist.find(i => i.id === p.id) ? 'active' : ''}" 
                            onclick="event.stopPropagation(); toggleFav('${p.id}'); this.classList.toggle('active')">❤️</button>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${p.title}</h3>
                        <p class="product-type">${p.type} | ${p.color}</p>
                        <p class="product-price">$${p.price.toFixed(2)}</p>
                        <button class="btn btn-dark w-100 mt-2" onclick="event.stopPropagation(); quickAdd('${p.id}')">ADD TO BAG</button>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', card);
        });
    }

    function applyFilter(filter) {
        if (filter === 'all') {
            title.innerText = 'All Products';
            renderProducts(allProducts);
        } else {
            title.innerText = filter.charAt(0).toUpperCase() + filter.slice(1) + "'s Wear";
            const filtered = allProducts.filter(p => p.category === filter);
            renderProducts(filtered);
        }
    }

    function handleSearch(query) {
        query = query.toLowerCase();
        title.innerText = `Search Results for "${query}"`;
        const filtered = allProducts.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.color.toLowerCase().includes(query)
        );
        renderProducts(filtered);
    }

    function updateActiveButton(filter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
    }

    // Global helpers for inline buttons
    window.quickAdd = (id) => {
        const item = allProducts.find(p => p.id === id);
        if (item) Store.addToCart(item);
    };

    window.toggleFav = (id) => {
        const item = allProducts.find(p => p.id === id);
        if (item) Store.toggleWishlist(item);
    };
});
