let cart = [];

function addToCart(itemName, price) {
    const item = { name: itemName, price: price, quantity: 1 };
    
    // Check if item is already in the cart
    const existingItem = cart.find(cartItem => cartItem.name === itemName);
    if (existingItem) {
        existingItem.quantity += 1;  // Increase quantity if it exists
    } else {
        cart.push(item);  // Add new item if not in cart
    }

    updateCartCount();
    displayCartItems();
}

function updateCartCount() {
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
}

function toggleCart() {
    const cartSection = document.getElementById('cart-section');
    cartSection.style.display = cartSection.style.display === 'none' ? 'block' : 'none';
}

function displayCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';  // Clear the cart div

    cart.forEach(item => {
        cartItemsDiv.innerHTML += `<div>
            <p>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</p>
        </div>`;
    });

    if (cart.length > 0) {
        renderPayPalButton();
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
}

function renderPayPalButton() {
    // Remove any existing PayPal button (in case of updates)
    document.getElementById('paypal-button-container').innerHTML = '';

    // Render the PayPal button
    paypal.Buttons({
        createOrder: function(data, actions) {
            // Set up the transaction
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: getCartTotal()  // Total price from cart
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            // Capture the funds from the transaction
            return actions.order.capture().then(function(details) {
                alert('Transaction completed by ' + details.payer.name.given_name);
                // Optionally clear the cart or redirect the user after successful payment
                cart = [];  // Empty the cart after successful transaction
                updateCartCount();
                document.getElementById('cart-items').innerHTML = '';
                document.getElementById('paypal-button-container').innerHTML = '';
            });
        }
    }).render('#paypal-button-container');
}

function copyCryptoAddress() {
    const cryptoAddress = document.getElementById('crypto-address');
    cryptoAddress.select();
    document.execCommand('copy');
    alert('Crypto wallet address copied!');
}