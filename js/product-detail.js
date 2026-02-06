document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                populateProductDetail(product);
            } else {
                document.getElementById('product-title').innerText = 'Product Not Found';
            }
        })
        .catch(err => console.error('Error loading products:', err));
});

function populateProductDetail(product) {
    document.title = `${product.title} - Gymshark`;
    document.getElementById('breadcrumb-category').innerText = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    document.getElementById('breadcrumb-title').innerText = product.title;

    document.getElementById('product-img').src = product.image;
    document.getElementById('product-title').innerText = product.title;
    document.getElementById('product-type').innerText = `${product.type} | ${product.color}`;
    document.getElementById('product-price').innerText = `$${product.price.toFixed(2)}`;
    document.getElementById('product-description').innerText = product.description;

    // Rating
    const ratingDiv = document.getElementById('product-rating');
    let starsHtml = '<div class="stars">';
    for (let i = 1; i <= 5; i++) {
        starsHtml += `<span class="star ${i <= product.rating ? 'filled' : ''}">${i <= product.rating ? '★' : '☆'}</span>`;
    }
    starsHtml += '</div>';
    ratingDiv.innerHTML = starsHtml;

    // Specs
    const specsTable = document.getElementById('product-specs');
    let specsHtml = '';
    for (const [key, value] of Object.entries(product.specs)) {
        specsHtml += `<tr><th>${key}</th><td>${value}</td></tr>`;
    }
    specsTable.innerHTML = specsHtml;

    // Add to Bag / Wishlist triggers
    const buyBtn = document.querySelector('.buy-now-btn');
    const wishlistBtn = document.querySelectorAll('.buy-now-btn')[1];

    if (buyBtn) {
        buyBtn.onclick = () => Store.addToCart(product);
    }
    if (wishlistBtn) {
        wishlistBtn.onclick = () => Store.toggleWishlist(product);
    }
}
