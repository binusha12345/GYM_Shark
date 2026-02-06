// Store Manager for Cart and Wishlist
const Store = {
    cart: JSON.parse(localStorage.getItem('gymshark_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('gymshark_wishlist')) || [],

    save() {
        localStorage.setItem('gymshark_cart', JSON.stringify(this.cart));
        localStorage.setItem('gymshark_wishlist', JSON.stringify(this.wishlist));
        this.updateCounters();
    },

    addToCart(product) {
        const existing = this.cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.save();
        this.showToast('Added to Bag!');
    },

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.save();
    },

    toggleWishlist(product) {
        const index = this.wishlist.findIndex(item => item.id === product.id);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.showToast('Removed from Wishlist');
        } else {
            this.wishlist.push(product);
            this.showToast('Added to Wishlist!');
        }
        this.save();
    },

    updateCounters() {
        const cartCount = document.getElementById('cart-count');
        const wishlistCount = document.getElementById('wishlist-count');

        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCount.innerText = totalItems;
            cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
        if (wishlistCount) {
            const totalItems = this.wishlist.length;
            wishlistCount.innerText = totalItems;
            wishlistCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
    },

    async loadProducts() {
        try {
            const response = await fetch('products.json');
            const data = await response.json();

            // Merge with custom products from Admin dashboard
            const customProducts = JSON.parse(localStorage.getItem('gymshark_custom_products')) || [];
            this.products = [...data, ...customProducts];

            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            const customProducts = JSON.parse(localStorage.getItem('gymshark_custom_products')) || [];
            this.products = customProducts;
            this.renderProducts();
        }
    },

    showToast(message) {
        // Simple toast implementation
        let toast = document.getElementById('gym-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'gym-toast';
            toast.style.cssText = `
                position: fixed; bottom: 20px; right: 20px; 
                background: #000; color: #fff; padding: 12px 24px; 
                border-radius: 4px; z-index: 9999; transition: opacity 0.3s;
                font-family: Arial, sans-serif;
            `;
            document.body.appendChild(toast);
        }
        toast.innerText = message;
        toast.style.opacity = '1';
        setTimeout(() => toast.style.opacity = '0', 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Store.updateCounters();

    // Global event listener for favorite buttons in product cards
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('favorite-btn')) {
            e.stopPropagation();
            const card = e.target.closest('.product-card');
            if (card) {
                // For simplicity, we extract basic info from the card if it's rendered by collection.js
                // But it's better if collection.js handles its own clicks or we pass data attributes.
            }
        }
    });
});
