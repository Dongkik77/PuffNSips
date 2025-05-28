    document.addEventListener('DOMContentLoaded', () => {
            const isLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
            const authBtn = document.getElementById('authBtn');

            if (isLoggedIn) {
                authBtn.textContent = 'Logout';
                authBtn.href = '#';
                authBtn.addEventListener('click', () => {
                    sessionStorage.removeItem('userLoggedIn');
                    window.location.reload();
                });

                const userWelcome = document.getElementById('userWelcome');
                if (userWelcome) {
                    userWelcome.textContent = 'Welcome back!';
                }
            }
        });

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
            const cartTotal = document.getElementById('cartTotal').textContent;
            if (cartTotal === 'Cart: $0') {
                alert('Please add items to your cart before proceeding to checkout.');
                return;
            }
            alert('Proceeding to checkout with ' + cartTotal);
        }

        // Mobile menu toggle
        document.getElementById('menu-btn').addEventListener('click', () => {
            document.querySelector('.navbar').classList.toggle('active');
        });
