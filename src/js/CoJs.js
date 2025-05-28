// Enhanced checkout functionality with authentication
let cartTotal = 0;
let selectedItems = 0;

// Authentication check function
function checkLoginStatus() {
    return sessionStorage.getItem('userLoggedIn') === 'true' || 
           localStorage.getItem('userLoggedIn') === 'true';
}

function updateTotal(input) {
    const row = input.closest('.product-row');
    const price = parseInt(row.querySelector('.price').textContent.replace('$', ''));
    const quantity = parseInt(input.value) || 0;
    const totalElement = row.querySelector('.total-amount');
    const checkbox = row.querySelector('.product-checkbox');
    
    const total = price * quantity;
    totalElement.textContent = `$${total}`;
    
    // Auto-check if quantity > 0, uncheck if quantity = 0
    if (quantity > 0 && !checkbox.classList.contains('checked')) {
        checkbox.classList.add('checked');
    } else if (quantity === 0 && checkbox.classList.contains('checked')) {
        checkbox.classList.remove('checked');
    }
    
    updateCartTotal();
}

function increaseQty(button) {
    // Check if user is logged in before allowing cart modifications
    if (!checkLoginStatus()) {
        alert('Please log in to add items to your cart.');
        window.location.href = '/coffee-shop-website-design-main/html/LogSign.html';
        return;
    }
    
    const input = button.parentNode.querySelector('.qty-input');
    input.value = parseInt(input.value) + 1;
    updateTotal(input);
}

function decreaseQty(button) {
    // Check if user is logged in before allowing cart modifications
    if (!checkLoginStatus()) {
        alert('Please log in to modify your cart.');
        window.location.href = '/coffee-shop-website-design-main/html/LogSign.html';
        return;
    }
    
    const input = button.parentNode.querySelector('.qty-input');
    if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
        updateTotal(input);
    }
}

function updateCartTotal() {
    cartTotal = 0;
    selectedItems = 0;
    
    document.querySelectorAll('.product-row').forEach(row => {
        const checkbox = row.querySelector('.product-checkbox');
        if (checkbox.classList.contains('checked')) {
            const quantity = parseInt(row.querySelector('.qty-input').value) || 0;
            const price = parseInt(row.querySelector('.price').textContent.replace('$', ''));
            cartTotal += price * quantity;
            selectedItems += quantity;
        }
    });
    
    document.getElementById('cartTotal').textContent = `Cart: $${cartTotal} (${selectedItems} items)`;
}

function proceedToCheckout() {
    // Double-check authentication before proceeding
    if (!checkLoginStatus()) {
        alert('Please log in to proceed with checkout.');
        // Store current cart state before redirecting
        storeCartState();
        window.location.href = '/coffee-shop-website-design-main/html/LogSign.html';
        return;
    }
    
    if (cartTotal > 0) {
        const username = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || 'User';
        alert(`Hi ${username}! Proceeding to checkout with $${cartTotal} worth of items (${selectedItems} items)!`);
        
        // Here you would typically redirect to a payment/final checkout page
        // For now, we'll simulate the checkout process
        if (confirm('Would you like to complete your purchase?')) {
            alert('Thank you for your purchase! Your order has been placed successfully.');
            // Clear cart after successful checkout
            clearCart();
        }
    } else {
        alert('Please select some items first!');
    }
}

// Store cart state in session storage
function storeCartState() {
    const cartState = [];
    document.querySelectorAll('.product-row').forEach(row => {
        const checkbox = row.querySelector('.product-checkbox');
        const quantity = parseInt(row.querySelector('.qty-input').value) || 0;
        
        if (quantity > 0) {
            const productName = row.querySelector('h3').textContent;
            const price = parseInt(row.querySelector('.price').textContent.replace('$', ''));
            cartState.push({
                name: productName,
                quantity: quantity,
                price: price,
                checked: checkbox.classList.contains('checked')
            });
        }
    });
    
    if (cartState.length > 0) {
        sessionStorage.setItem('savedCart', JSON.stringify(cartState));
    }
}

// Restore cart state from session storage
function restoreCartState() {
    const savedCart = sessionStorage.getItem('savedCart');
    if (savedCart) {
        try {
            const cartState = JSON.parse(savedCart);
            cartState.forEach(item => {
                // Find the corresponding product row
                const productRows = document.querySelectorAll('.product-row');
                productRows.forEach(row => {
                    const productName = row.querySelector('h3').textContent;
                    if (productName === item.name) {
                        const qtyInput = row.querySelector('.qty-input');
                        const checkbox = row.querySelector('.product-checkbox');
                        
                        qtyInput.value = item.quantity;
                        if (item.checked) {
                            checkbox.classList.add('checked');
                        }
                        updateTotal(qtyInput);
                    }
                });
            });
            
            // Clear saved cart after restoration
            sessionStorage.removeItem('savedCart');
            alert('Your cart has been restored!');
        } catch (e) {
            console.error('Error restoring cart state:', e);
        }
    }
}
