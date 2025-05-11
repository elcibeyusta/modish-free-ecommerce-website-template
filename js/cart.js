// Cart functionality
let cart = {
    items: [],
    
    // Color mapping function
    getColorName: function(rgbColor) {
        const colorMap = {
            'rgb(255, 255, 0)': 'Yellow',
            'rgb(255, 165, 0)': 'Orange',
            'rgb(0, 0, 255)': 'Blue',
            'rgb(128, 0, 128)': 'Purple',
            'rgb(255, 0, 0)': 'Red',
            'rgb(0, 128, 0)': 'Green'
        };
        // Normalize the RGB string by removing spaces
        const normalizedRGB = rgbColor.replace(/\s+/g, '');
        return colorMap[normalizedRGB] || rgbColor;
    },
    
    addItem: function(product) {
        console.log('Adding product:', product);
        this.items.push(product);
        this.updateCart();
    },
    
    removeItem: function(index) {
        this.items.splice(index, 1);
        this.updateCart();
    },
    
    updateCart: function() {
        console.log('Updating cart, items:', this.items);
        const count = this.items.length;
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = count;
        }
        
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (cartItems && cartTotal) {
            cartItems.innerHTML = '';
            let total = 0;
            
            this.items.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                // Convert RGB colors to color names
                const colorNames = item.color.split(',').map(rgb => this.getColorName(rgb.trim()));
                
                cartItems.innerHTML += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h6>${item.name}</h6>
                            <p class="mb-1">Size: ${item.size}</p>
                            <p class="mb-1">Color: ${colorNames.join(', ')}</p>
                            <button class="btn btn-sm btn-danger" onclick="cart.removeItem(${index})">Remove</button>
                        </div>
                        <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                    </div>
                `;
            });
            
            cartTotal.textContent = total.toFixed(2);
        }
    }
};

// Make cart globally available
window.cart = cart;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing cart...');
    
    // Initialize size buttons
    document.querySelectorAll('.size-btn').forEach(button => {
        button.onclick = function() {
            console.log('Size button clicked');
            const modal = this.closest('.modal');
            modal.querySelectorAll('.size-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        };
    });

    // Initialize color buttons
    const colorButtons = document.querySelectorAll('.color-btn');
    console.log('Found color buttons:', colorButtons.length);
    
    colorButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log('Color button clicked');
            const modal = this.closest('.modal');
            const selected = modal.querySelectorAll('.color-btn.active');
            console.log('Currently selected colors (using .active):', selected.length);
            
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                console.log('Color deselected');
            } else if (selected.length < 3) {
                this.classList.add('active');
                console.log('Color selected');
            } else {
                alert('You can select up to 3 colors.');
            }
        });
    });

    // Initialize add to cart buttons
    document.querySelectorAll('.modal-footer .btn-dark').forEach(button => {
        button.onclick = function() {
            console.log('Add to cart button clicked');
            const modal = this.closest('.modal');
            const productName = modal.querySelector('.modal-title').textContent;
            const selectedSize = modal.querySelector('.size-btn.active')?.textContent;
            const selectedColors = Array.from(modal.querySelectorAll('.color-btn.active')).map(btn => btn.style.backgroundColor);

            console.log('Selected size:', selectedSize);
            console.log('Selected colors:', selectedColors);

            if (!selectedSize) {
                alert('Please select a size');
                return;
            }
            if (selectedColors.length === 0) {
                alert('Please select at least one color (up to 3).');
                return;
            }
            if (selectedColors.length > 3) {
                alert('You can select a maximum of 3 colors.');
                return;
            }

            const product = {
                name: productName,
                price: 699.99,
                size: selectedSize,
                color: selectedColors.join(', '),
                image: document.querySelector(`img[data-bs-target="#${modal.id}"]`).src,
                quantity: 1
            };

            cart.addItem(product);
            
            // Close the modal
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        };
    });

    // Initialize checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.onclick = function() {
            if (cart.items.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            alert('Thank you for your purchase!');
            cart.items = [];
            cart.updateCart();
            const cartModal = document.getElementById('cartModal');
            const modalInstance = bootstrap.Modal.getInstance(cartModal);
            if (modalInstance) {
                modalInstance.hide();
            }
        };
    }

    // Initialize all modals
    document.querySelectorAll('.modal').forEach(function(modal) {
        new bootstrap.Modal(modal);
    });
}); 