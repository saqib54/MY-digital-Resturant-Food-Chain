document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();

    document.getElementById('cart-items').addEventListener('click', (event) => {
        if (event.target.classList.contains('increase-quantity')) {
            updateQuantity(event.target, 1);
        } else if (event.target.classList.contains('decrease-quantity')) {
            updateQuantity(event.target, -1);
        }
    });
});

function loadCartFromLocalStorage() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear existing items

    cartItems.forEach(item => {
        cartItemsContainer.appendChild(createCartItemElement(item));
    });

    updateTotal();
}

function updateQuantity(button, change) {
    const cartItemRow = button.closest('.cart-item');
    const quantityElement = cartItemRow.querySelector('.quantity');
    const priceElement = cartItemRow.querySelector(".price");
    const unitPrice = parseFloat(cartItemRow.getAttribute('data-product-price'));
    const newQuantity = parseInt(quantityElement.textContent) + change;

    if (newQuantity <= 0) return; // Prevent quantity from being less than 1

    quantityElement.textContent = newQuantity;
    priceElement.textContent = `₨${(unitPrice * newQuantity).toFixed(2)}`;

    const decreaseBtn = cartItemRow.querySelector(".decrease-quantity");
    if (newQuantity == 1) {
        decreaseBtn.classList.add("disable");
    } else {
        decreaseBtn.classList.remove("disable");
    }

    updateTotal();
    saveCartToLocalStorage();
}

function updateTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0.0;

    cartItems.forEach(item => {
        const price = parseFloat(item.getAttribute('data-product-price'));
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        total += price * quantity;
    });

    document.getElementById('cart-total').innerHTML = (total != 0) ? `<span>Subtotal:</span> ₨${total.toFixed(2)}` : ``;
    handleEmptyCart(total);
    return total;
}

function saveCartToLocalStorage() {
    const cartItems = [];

    document.querySelectorAll('.cart-item').forEach(item => {
        cartItems.push({
            id: item.getAttribute('data-product-id'),
            name: item.getAttribute('data-product-name'),
            unitPrice: item.getAttribute('data-product-price'),
            price: (parseFloat(item.getAttribute('data-product-price')) * parseInt(item.querySelector('.quantity').textContent)).toFixed(2),
            quantity: parseInt(item.querySelector('.quantity').textContent),
            image: item.getAttribute('data-product-image')
        });
    });

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function createCartItemElement(item) {
    const cartItemRow = document.createElement('div');
    cartItemRow.className = 'cart-item';
    cartItemRow.setAttribute('data-product-id', item.id);
    cartItemRow.setAttribute('data-product-price', item.price);
    cartItemRow.setAttribute('data-product-name', item.name);
    cartItemRow.setAttribute('data-product-image', item.image);

    cartItemRow.innerHTML = `
        <img src='${item.imgSrc}' alt='${item.name}-image' height='100px' width='100px'>
        <div class='detail'>
            <div class="name">${item.name}</div>
            <div class="quantity-wrapper">
                <span class="btn decrease-quantity ${item.quantity == 1 ? 'disable' : ''}">-</span>
                <span class="quantity">${item.quantity}</span>
                <span class="btn increase-quantity">+</span>
            </div>
            <div class='price'>₨${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
        </div>`;

    const removeBtn = document.createElement('div');
    removeBtn.className = 'btn remove';
    removeBtn.innerHTML = 'x';
    removeBtn.addEventListener('click', (e) => {
        e.target.parentElement.remove();
        updateTotal();
        saveCartToLocalStorage();
    });
    cartItemRow.appendChild(removeBtn);

    return cartItemRow;
}

function handleEmptyCart(total) {
    const emptyCartContainer = document.querySelector('.empty-cart');
    if (total!=0) {
        emptyCartContainer.innerHTML = ``;
        return(false);// Cart is not empty
    } else {
        emptyCartContainer.innerHTML = `
            <h4>Empty Menu!</h4>
            <p>Looks like you haven't made your choice yet... Check what we have got for you and get it swished.</p>
            <a href="./menu.html"><button class="butt">Explore Menu</button></a>`;
        return(true); // Cart is empty
    }
}

// Function to generate a random coupon code
const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let couponCode = '';
    for (let i = 0; i < 8; i++) {
        couponCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return couponCode;
}

// Check if it's the user's first order and apply discount
const applyFirstTimeDiscount = () => {
    let couponCode = localStorage.getItem('couponCode');
    if (!couponCode) {
        couponCode = generateCouponCode();
        localStorage.setItem('couponCode', couponCode);
    }
    document.getElementById('couponCode').innerHTML = `Use coupon code <span style="font-weight: bold;"> ${couponCode} </span> for 30% off!`;
    document.querySelector(".coupen-inner").innerHTML = `Congratulations! Your coupon code is ${couponCode}. You've received a 30% discount on your first order.`;
}

// Input for apply coupon code
document.getElementById('applyCouponButton').addEventListener('click', function () {
    const couponCode = document.getElementById('inputCode').value;
    if (!couponCode) {
        alert('Please enter a Coupon Code.');
    }
});

const modal = document.getElementById("myModal");
const closeButton = document.querySelector(".close");
const orderNowButton = document.getElementById("orderNowButton");

// Add COD and Easypaisa payment options
orderNowButton.addEventListener("click", () => {
    const total = updateTotal();
    const isEmptyCart = handleEmptyCart(total);

    if (isEmptyCart) {
        return; // Exit early if the cart is empty
    }

    // Show payment options modal
    showPaymentOptions(total);
});

function showPaymentOptions(total) {
    // Create payment options modal
    const paymentModal = document.createElement('div');
    paymentModal.id = "paymentModal";
    paymentModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    paymentModal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; width: 400px; max-width: 90%;">
            <h3 style="margin-top: 0;">Select Payment Method</h3>
            <div style="margin: 20px 0;">
                <button id="codButton" style="width: 100%; padding: 15px; margin: 10px 0; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Cash on Delivery (COD)
                </button>
                <button id="easypaisaButton" style="width: 100%; padding: 15px; margin: 10px 0; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Easypaisa
                </button>
            </div>
            <button id="closePaymentModal" style="float: right; background: #f44336; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                Close
            </button>
            <div style="clear: both;"></div>
        </div>
    `;

    document.body.appendChild(paymentModal);

    // Add event listeners
    document.getElementById('codButton').addEventListener('click', () => {
        processOrder('Cash on Delivery', total);
        document.body.removeChild(paymentModal);
    });

    document.getElementById('easypaisaButton').addEventListener('click', () => {
        processOrder('Easypaisa', total);
        document.body.removeChild(paymentModal);
    });

    document.getElementById('closePaymentModal').addEventListener('click', () => {
        document.body.removeChild(paymentModal);
    });
}

function processOrder(paymentMethod, total) {
    // Get user info from localStorage
    const userEmail = localStorage.getItem('userEmail') || 'guest@example.com';
    const username = localStorage.getItem('username') || 'Guest User';
    
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Generate order ID
    const orderId = 'ORD-' + Date.now();
    
    // Create order object
    const order = {
        id: orderId,
        customerName: username,
        customerEmail: userEmail,
        items: cartItems,
        totalAmount: total,
        paymentMethod: paymentMethod,
        status: 'Order Placed',
        timestamp: new Date().toISOString()
    };
    
    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Create order summary
    let orderSummary = `*New Order Received!*\n\n`;
    orderSummary += `*Order ID: ${orderId}*\n`;
    orderSummary += `*Customer Details:*\n`;
    orderSummary += `Name: ${username}\n`;
    orderSummary += `Email: ${userEmail}\n`;
    orderSummary += `Contact: 03292899943\n`;
    orderSummary += `Location: Sialkot\n\n`;
    orderSummary += `*Order Items:*\n`;
    
    cartItems.forEach(item => {
        orderSummary += `${item.name} x${item.quantity} - ₨${(parseFloat(item.price) * item.quantity).toFixed(2)}\n`;
    });
    
    orderSummary += `\n*Total Amount: ₨${total.toFixed(2)}*\n`;
    orderSummary += `*Payment Method: ${paymentMethod}*\n`;
    orderSummary += `*Order Status: Order Placed*\n\n`;
    orderSummary += `Please send payment screenshot to WhatsApp for order confirmation.`;
    
    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(orderSummary);
    const whatsappUrl = `https://wa.me/923292899943?text=${encodedMessage}`;
    
    // Clear cart
    localStorage.removeItem('cartItems');
    
    // Update cart icon
    const cartIcon = document.querySelector('.cart-subscript');
    if (cartIcon) {
        cartIcon.innerText = '0';
    }
    
    // Show success message
    alert(`Order placed successfully! Your order ID is ${orderId}. You will be redirected to WhatsApp to send payment details.`);
    
    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reload page to update cart
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Adding donate button
document.addEventListener('DOMContentLoaded', function() {
    const donateButton = document.getElementById('donateBtn');
    if (donateButton) {
        donateButton.addEventListener('click', function() {
            window.location.href = '../Html-files/donation-form.html';
        });
    }
});