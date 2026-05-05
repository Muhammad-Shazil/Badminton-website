// Sample data
const products = [
    {
        id: 1,
        name: "Yonex Astrox 88D Pro Badminton Racket",
        price: 299.99,
        rating: 4.8,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-qb5hT6CtxRGQYAthFbYkDBdsdmw1sHHHAw&s"
    },
    {
        id: 2,
        name: "Li-Ning Turbo Charging 70 Badminton Shoes",
        price: 149.99,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Victor Master Ace Badminton Racket",
        price: 189.99,
        rating: 4.7,
        image: "https://cdn.shopify.com/s/files/1/0723/9035/products/Victor_WE_140_F_3_yumoproshop_large.jpg?v=1638516746"
    },
    {
        id: 4,
        name: "Yonex Aerosensa 30 Shuttlecocks (Pack of 12)",
        price: 49.99,
        rating: 4.9,
        image: "https://media.newitts.com/cdn/images/products/new-design/300x300/it027896a.jpg"
    },
    {
        id: 5,
        name: "Li-Ning Badminton Net Professional",
        price: 79.99,
        rating: 4.5,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT3etjBADEwrIJvJRd-e5qxpqqyamJ0ixidQ&s"
    },
    {
        id: 6,
        name: "Victor Badminton Bag Professional",
        price: 89.99,
        rating: 4.4,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEnx8MbuMi19VRS-yVo80_mkQcOaKvp5PHFA&s"
    }
];

const reviews = [
    {
        text: "Absolutely love the quality of the Yonex racket I purchased. It has improved my game significantly!",
        author: "Sarah Johnson",
        rating: 5
    },
    {
        text: "Great customer service and fast shipping. The badminton shoes are comfortable and durable.",
        author: "Mike Chen",
        rating: 5
    },
    {
        text: "The shuttlecocks are of excellent quality. They fly true and last longer than expected.",
        author: "Emma Davis",
        rating: 4
    },
    {
        text: "Professional-grade equipment at reasonable prices. Highly recommend for serious players.",
        author: "Alex Rodriguez",
        rating: 5
    }
];

let cart = [];
let currentReviewIndex = 0;

const productsGrid = document.getElementById('productsGrid');
const reviewsSlider = document.getElementById('reviewsSlider');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.querySelector('.cart-count');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const navSearchInput = document.getElementById('navSearch');
const previewCards = document.querySelectorAll('.preview-card');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');

function init() {
    if (reviewsSlider) {
        loadReviews();
    }
    updateCartCount();
    setupEventListeners();
}

function setupEventListeners() {
    if (cartBtn) {
        cartBtn.addEventListener('click', openCartModal);
    }

    if (closeCart) {
        closeCart.addEventListener('click', closeCartModal);
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    document.body.addEventListener('click', function(event) {
        const button = event.target.closest('.add-to-cart, .add-cart');
        if (button && button.dataset.id) {
            addToCart(parseInt(button.dataset.id, 10));
        }
    });

    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    if (navSearchInput) {
        navSearchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            previewCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                card.style.display = title.includes(query) ? '' : 'none';
            });
        });
    }

    if (cartModal) {
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                closeCartModal();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevReview);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextReview);
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission();
        });
    }
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

function loadReviews() {
    if (!reviewsSlider) return;

    reviewsSlider.innerHTML = '';
    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <p class="review-text">"${review.text}"</p>
            <h4 class="review-author">${review.author}</h4>
            <div class="review-rating">${generateStars(review.rating)}</div>
        `;
        reviewsSlider.appendChild(reviewCard);
    });
    updateReviewSlider();
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    openCartModal();
    alert(`${product.name} added to cart!`);
}

function updateCartCount() {
    if (!cartCount) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function openCartModal() {
    if (!cartModal) return;
    updateCartDisplay();
    cartModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (cartBtn) cartBtn.classList.add('active');
}

function closeCartModal() {
    if (!cartModal) return;
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (cartBtn) cartBtn.classList.remove('active');
}

function updateCartDisplay() {
    if (!cartItems) return;
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        `;
        cartItems.appendChild(cartItem);
    });
}

function clearCart() {
    cart = [];
    updateCartCount();
    updateCartDisplay();
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    alert(`Proceeding to checkout. Total: $${total.toFixed(2)}`);
    clearCart();
    closeCartModal();
}

function prevReview() {
    currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
    updateReviewSlider();
}

function nextReview() {
    currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
    updateReviewSlider();
}

function updateReviewSlider() {
    if (!reviewsSlider) return;
    const reviewCards = reviewsSlider.querySelectorAll('.review-card');
    reviewCards.forEach((card, index) => {
        card.style.transform = `translateX(${100 * (index - currentReviewIndex)}%)`;
    });
}

function toggleMobileMenu() {
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

function handleContactFormSubmission() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    if (!name || !email || !subject || !message) return;

    const formData = {
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value
    };
    console.log('Contact form submitted', formData);
    alert('Thank you for your message! We will get back to you soon.');
    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.reset();
}

document.addEventListener('DOMContentLoaded', init);
