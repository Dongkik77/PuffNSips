document.addEventListener('DOMContentLoaded', () => {
    // Check authentication and update welcome message
    const isLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true' || 
                      localStorage.getItem('userLoggedIn') === 'true';
    
    if (isLoggedIn) {
        const userWelcome = document.getElementById('userWelcome');
        if (userWelcome) {
            userWelcome.textContent = 'Welcome back!';
        }
    }

    // Create modal HTML and inject into body
    createCheckoutModal();
});

// Create the checkout modal
function createCheckoutModal() {
    const modalHTML = `
        <div id="checkoutModal" style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
            <div style="background-color: #2c1810; margin: 5% auto; padding: 0; border-radius: 15px; width: 90%; max-width: 600px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); color: white; font-family: Arial, sans-serif;">
                <!-- Modal Header -->
                <div style="background: linear-gradient(135deg, #8B4513, #D2691E); padding: 20px; border-radius: 15px 15px 0 0; text-align: center; position: relative;">
                    <h2 style="margin: 0; font-size: 24px; color: white;">
                        🛒 Checkout Summary
                    </h2>
                    <span id="closeModal" style="position: absolute; top: 15px; right: 20px; font-size: 28px; font-weight: bold; cursor: pointer; color: white; transition: color 0.3s;">&times;</span>
                </div>
                
                <!-- Modal Body -->
                <div style="padding: 20px; max-height: 400px; overflow-y: auto;">
                    <div id="orderSummary">
                        <!-- Order items will be inserted here -->
                    </div>
                    
                    <div style="border-top: 2px solid #D2691E; margin-top: 20px; padding-top: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 20px; font-weight: bold; color: #D2691E;">
                            <span>Total Amount:</span>
                            <span id="modalTotal">$0</span>
                        </div>
                    </div>
                </div>
                
                <!-- Modal Footer -->
                <div style="padding: 20px; border-top: 1px solid #444; text-align: center; border-radius: 0 0 15px 15px;">
                    <button id="confirmOrder" style="background: linear-gradient(135deg, #D2691E, #FF8C42); color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; margin-right: 10px; transition: all 0.3s; box-shadow: 0 2px 10px rgba(210, 105, 30, 0.3);">
                        ✓ Confirm Order
                    </button>
                    <button id="cancelOrder" style="background: #666; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 16px; cursor: pointer; transition: all 0.3s;">
                        ✕ Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners for modal
    document.getElementById('closeModal').addEventListener('click', closeCheckoutModal);
    document.getElementById('cancelOrder').addEventListener('click', closeCheckoutModal);
    document.getElementById('confirmOrder').addEventListener('click', confirmOrder);
    
    // Close modal when clicking outside
    document.getElementById('checkoutModal').addEventListener('click', (e) => {
        if (e.target.id === 'checkoutModal') {
            closeCheckoutModal();
        }
    });

    // Add hover styles
    const style = document.createElement('style');
    style.textContent = `
        #confirmOrder:hover {
            background: linear-gradient(135deg, #FF8C42, #FFA500) !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(210, 105, 30, 0.4) !important;
        }
        
        #cancelOrder:hover {
            background: #888 !important;
            transform: translateY(-2px);
        }
        
        #closeModal:hover {
            color: #D2691E !important;
        }
    `;
    document.head.appendChild(style);
}

// Quantity control functions
function increaseQty(btn) {
    const input = btn.previousElementSibling;
    input.value = parseInt(input.value) + 1;
    updateTotal(input);
}

function decreaseQty(btn) {
    const input = btn.nextElementSibling;
    if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
        updateTotal(input);
    }
}

function updateTotal(input) {
    const row = input.closest('.product-row');
    const price = parseFloat(row.querySelector('.price').textContent.replace('$', ''));
    const quantity = parseInt(input.value) || 0;
    const total = price * quantity;
    
    row.querySelector('.total-amount').textContent = '$' + total;
    updateCartTotal();
}

function updateCartTotal() {
    let cartTotal = 0;
    document.querySelectorAll('.total-amount').forEach(total => {
        cartTotal += parseFloat(total.textContent.replace('$', '')) || 0;
    });
    document.getElementById('cartTotal').textContent = 'Cart: $' + cartTotal;
}

function proceedToCheckout() {
    const cartTotal = parseFloat(document.getElementById('cartTotal').textContent.replace('Cart: $', ''));
    
    if (cartTotal === 0) {
        alert('Please add items to your cart before proceeding to checkout.');
        return;
    }
    
    // Generate order summary
    generateOrderSummary();
    
    // Show modal
    document.getElementById('checkoutModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function generateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const modalTotal = document.getElementById('modalTotal');
    let summaryHTML = '';
    let totalAmount = 0;
    
    // Get all product rows with quantities > 0
    document.querySelectorAll('.product-row').forEach(row => {
        const qtyInput = row.querySelector('.qty-input');
        const quantity = parseInt(qtyInput.value) || 0;
        
        if (quantity > 0) {
            const productName = row.querySelector('.product-details h3').textContent;
            const price = parseFloat(row.querySelector('.price').textContent.replace('$', ''));
            const total = price * quantity;
            const category = row.dataset.category;
            const productImg = row.querySelector('.product-image').src;
            
            totalAmount += total;
            
            // Get category badge emoji
            const categoryEmoji = category === 'coffee' ? '☕' : '💨';
            
            summaryHTML += `
                <div style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #444; margin-bottom: 10px;">
                    <img src="${productImg}" alt="${productName}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px 0; color: #D2691E; font-size: 16px;">${productName}</h4>
                        <p style="margin: 0; color: #ccc; font-size: 12px; text-transform: uppercase;">${categoryEmoji} ${category}</p>
                        <p style="margin: 5px 0 0 0; color: #fff; font-size: 14px;">$${price} × ${quantity}</p>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 18px; font-weight: bold; color: #D2691E;">$${total}</span>
                    </div>
                </div>
            `;
        }
    });
    
    if (summaryHTML === '') {
        summaryHTML = '<p style="text-align: center; color: #ccc; padding: 20px;">No items in cart</p>';
    }
    
    orderSummary.innerHTML = summaryHTML;
    modalTotal.textContent = '$' + totalAmount;
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable background scrolling
}

function confirmOrder() {
    const totalAmount = document.getElementById('modalTotal').textContent;
    alert(`Order confirmed! Total: ${totalAmount}\n\nThank you for your purchase! Your order is being processed.`);
    
    // Reset all quantities
    document.querySelectorAll('.qty-input').forEach(input => {
        input.value = 0;
        updateTotal(input);
    });
    
    closeCheckoutModal();
}

// Mobile menu toggle
document.getElementById('menu-btn').addEventListener('click', () => {
    document.querySelector('.navbar').classList.toggle('active');
});