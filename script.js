// Sample data
const products = [
    {
        id: 1,
        name: "Yonex Astrox 88D Pro Badminton Racket",
        price: 299.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
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
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Yonex Aerosensa 30 Shuttlecocks (Pack of 12)",
        price: 49.99,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Li-Ning Badminton Net Professional",
        price: 79.99,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Victor Badminton Bag Professional",
        price: 89.99,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
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

// Cart functionality
let cart = [];
let currentReviewIndex = 0;
let currentCarouselIndex = 0;
let carouselAutoPlay;

// DOM elements
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
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
const carouselContainer = document.getElementById('carouselContainer');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselIndicators = document.getElementById('carouselIndicators');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    if (reviewsSlider) {
        loadReviews();
    }

    initializeCarousel();
    setupEventListeners();
    updateCartCount();
});

// Generate star rating
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

// Load reviews
function loadReviews() {
    if (!reviewsSlider) return;
    reviewsSlider.innerHTML = '';
    reviews.forEach(review => {
        const reviewCard = createReviewCard(review);
        reviewsSlider.appendChild(reviewCard);
    });
    updateReviewSlider();
}

// Create review card
function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
        <p class="review-text">"${review.text}"</p>
        <h4 class="review-author">${review.author}</h4>
        <div class="review-rating">${generateStars(review.rating)}</div>
    `;
    return card;
}

// Update review slider position
function updateReviewSlider() {
    const reviewCards = document.querySelectorAll('.review-card');
    reviewCards.forEach((card, index) => {
        card.style.transform = `translateX(${100 * (index - currentReviewIndex)}%)`;
    });
}

// Carousel functions
function initializeCarousel() {
    if (!carouselContainer || !carouselIndicators) return;
    updateCarousel();
    startCarouselAutoPlay();

    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainer.addEventListener('mouseenter', pauseCarouselAutoPlay);
    carouselContainer.addEventListener('mouseleave', startCarouselAutoPlay);
    carouselContainer.addEventListener('touchstart', function(event) {
        touchStartX = event.changedTouches[0].screenX;
        pauseCarouselAutoPlay();
    });

    carouselContainer.addEventListener('touchend', function(event) {
        touchEndX = event.changedTouches[0].screenX;
        handleCarouselSwipe();
        startCarouselAutoPlay();
    });

    function handleCarouselSwipe() {
        const deltaX = touchEndX - touchStartX;
        if (Math.abs(deltaX) < 50) return;
        if (deltaX < 0) {
            nextCarouselSlide();
        } else {
            prevCarouselSlide();
        }
        resetCarouselAutoPlay();
    }
}

function updateCarousel() {
    const slides = carouselContainer.querySelectorAll('.carousel-slide');
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentCarouselIndex) {
            slide.classList.add('active');
        }
    });

    // Update indicators
    const indicators = carouselIndicators.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === currentCarouselIndex) {
            indicator.classList.add('active');
        }
    });
}

function nextCarouselSlide() {
    const slides = carouselContainer.querySelectorAll('.carousel-slide');
    currentCarouselIndex = (currentCarouselIndex + 1) % slides.length;
    updateCarousel();
}

function prevCarouselSlide() {
    const slides = carouselContainer.querySelectorAll('.carousel-slide');
    currentCarouselIndex = (currentCarouselIndex - 1 + slides.length) % slides.length;
    updateCarousel();
}

function goToCarouselSlide(index) {
    currentCarouselIndex = index;
    updateCarousel();
}

function startCarouselAutoPlay() {
    clearInterval(carouselAutoPlay);
    carouselAutoPlay = setInterval(nextCarouselSlide, 4000); // 4 second intervals for better viewing
}

function pauseCarouselAutoPlay() {
    clearInterval(carouselAutoPlay);
}

function resetCarouselAutoPlay() {
    pauseCarouselAutoPlay();
    startCarouselAutoPlay();
}

// Setup event listeners
function setupEventListeners() {
    // Add to cart buttons
    if (productsGrid) {
        productsGrid.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId);
            }
        });
    }

    // Cart modal
    if (cartBtn && closeCart && cartModal) {
        cartBtn.addEventListener('click', openCartModal);
        closeCart.addEventListener('click', closeCartModal);
        window.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }

    // Cart actions
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    // Review slider
    if (prevBtn) {
        prevBtn.addEventListener('click', prevReview);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextReview);
    }

    // Carousel controls
    if (carouselPrev) {
        carouselPrev.addEventListener('click', function() {
            prevCarouselSlide();
            resetCarouselAutoPlay();
        });
    }
    if (carouselNext) {
        carouselNext.addEventListener('click', function() {
            nextCarouselSlide();
            resetCarouselAutoPlay();
        });
    }

    // Carousel indicators
    if (carouselIndicators) {
        carouselIndicators.addEventListener('click', function(e) {
            if (e.target.classList.contains('indicator')) {
                const index = parseInt(e.target.dataset.slide);
                goToCarouselSlide(index);
                resetCarouselAutoPlay();
            }
        });
    }

    // Mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission();
        });
    }
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartCount();
        showNotification(`${product.name} added to cart!`);
    }
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Open cart modal
function openCartModal() {
    updateCartDisplay();
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close cart modal
function closeCartModal() {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Update cart display
function updateCartDisplay() {
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
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

// Clear cart
function clearCart() {
    cart = [];
    updateCartCount();
    updateCartDisplay();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    showNotification('Checkout functionality would be implemented here!');
    clearCart();
    closeCartModal();
}

// Review navigation
function prevReview() {
    currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
    updateReviewSlider();
}

function nextReview() {
    currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
    updateReviewSlider();
}

// Toggle mobile menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Auto-slide reviews
setInterval(nextReview, 5000);

// Handle contact form submission
function handleContactFormSubmission() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);

    // Simulate form submission (in a real app, this would send to a server)
    showNotification('Thank you for your message! We\'ll get back to you soon.');

    // Reset form
    form.reset();
}
