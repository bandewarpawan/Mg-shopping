// main.js - Main JavaScript functionality for the website

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const productsGrid = document.getElementById('products-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productTemplate = document.getElementById('product-template');
    const bannerAdTemplate = document.getElementById('banner-ad-template');
    
    // Current filter state
    let currentFilter = 'all';
    let searchQuery = '';
    
    // Initialize the website
    init();
    
    // Initialize function
    function init() {
        // Render all products initially
        renderProducts();
        
        // Setup event listeners
        setupEventListeners();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Search input event listener (real-time search)
        searchInput.addEventListener('input', function() {
            searchQuery = this.value.toLowerCase().trim();
            renderProducts();
            
            // Debug log for search query
            console.log("Search query:", searchQuery);
        });
        
        // Search button click event
        searchButton.addEventListener('click', function() {
            searchQuery = searchInput.value.toLowerCase().trim();
            renderProducts();
            
            // Debug log for search button click
            console.log("Search button clicked, query:", searchQuery);
        });
        
        // Enter key press in search input
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchQuery = this.value.toLowerCase().trim();
                renderProducts();
                
                // Debug log for Enter key press
                console.log("Enter key pressed, query:", searchQuery);
            }
        });
        
        // Category filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update current filter
                currentFilter = this.dataset.category;
                
                // Re-render products
                renderProducts();
                
                // Debug log for category filter
                console.log("Category filter changed to:", currentFilter);
            });
        });
    }
    
    // Function to get all products (combining default and custom products)
    function getAllProducts() {
        // Get custom products from localStorage
        const customProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
        
        // Get hidden products from localStorage
        const hiddenProducts = JSON.parse(localStorage.getItem('hiddenProducts')) || [];
        
        // Filter out hidden products from default products
        const visibleDefaultProducts = products.filter(product => 
            !hiddenProducts.includes(product.id)
        );
        
        // Combine with default products
        return [...visibleDefaultProducts, ...customProducts];
    }
    
    // Filter products based on search query and category
    function filterProducts() {
        // Get all products including custom ones
        const allProducts = getAllProducts();
        
        return allProducts.filter(product => {
            // Filter by category
            const categoryMatch = currentFilter === 'all' || product.category === currentFilter;
            
            // Filter by search query
            const titleMatch = product.title.toLowerCase().includes(searchQuery);
            const descriptionMatch = product.description.toLowerCase().includes(searchQuery);
            const searchMatch = titleMatch || descriptionMatch;
            
            // Debug log for each product filtering
            console.log(`Product: ${product.title}, Category Match: ${categoryMatch}, Search Match: ${searchMatch}`);
            
            // Return true if both filters match
            return categoryMatch && (searchQuery === '' || searchMatch);
        });
    }
    
    // Function to convert INR to USD
    function convertToUSD(inrPrice) {
        // Using a fixed exchange rate for simplicity (1 USD = 83 INR approximately)
        // In a real application, you would use an API to get the current exchange rate
        const exchangeRate = 83;
        return (inrPrice / exchangeRate).toFixed(2);
    }
    
    // Render products to the grid
    function renderProducts() {
        // Clear products grid
        productsGrid.innerHTML = '';
        
        // Get filtered products
        const filteredProducts = filterProducts();
        
        // Debug log for filtered products
        console.log("Filtered products count:", filteredProducts.length);
        
        // Check if any products match the filters
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<div class="no-results">कोई प्रोडक्ट नहीं मिला। कृपया अपनी खोज बदलें।</div>';
            return;
        }
        
        // Get banner ad HTML from localStorage
        const bannerAdHTML = localStorage.getItem('bannerAdHTML') || '';
        
        // Render each product with banner ads after every 3 products
        filteredProducts.forEach((product, index) => {
            // Insert banner ad after every 3 products
            if (index > 0 && index % 3 === 0 && bannerAdHTML) {
                const bannerAd = document.importNode(bannerAdTemplate.content, true).querySelector('.banner-ad');
                bannerAd.innerHTML = bannerAdHTML;
                productsGrid.appendChild(bannerAd);
            }
            
            // Clone the template
            const productCard = document.importNode(productTemplate.content, true).querySelector('.product-card');
            
            // Set product category
            productCard.dataset.category = product.category;
            
            // Set product image
            const productImage = productCard.querySelector('.product-image img');
            productImage.src = product.image;
            productImage.alt = product.title;
            
            // Set product details
            productCard.querySelector('.product-title').textContent = product.title;
            productCard.querySelector('.product-description').textContent = product.description;
            
            // Convert price to USD if not already provided
            const inrPrice = product.price;
            const usdPrice = product.priceUSD || convertToUSD(inrPrice);
            
            // Update price display to show both currencies
            const priceElement = productCard.querySelector('.product-price');
            priceElement.innerHTML = `₹ <span>${inrPrice.toLocaleString('hi-IN')}</span> / $${usdPrice} <span class="approx">(approx.)</span>`;
            
            // Style the price element
            priceElement.style.display = 'flex';
            priceElement.style.flexDirection = 'column';
            
            // Create a span for the approximate text if it doesn't exist
            if (!priceElement.querySelector('.approx')) {
                const approxSpan = document.createElement('span');
                approxSpan.className = 'approx';
                approxSpan.style.fontSize = '0.8rem';
                approxSpan.style.color = '#666';
                approxSpan.textContent = '(approx.)';
                priceElement.appendChild(approxSpan);
            }
            
            // Add single Buy Now button
            const affiliateButtonsContainer = productCard.querySelector('.affiliate-buttons');
            
            // Create a single Buy Now button
            const button = document.createElement('a');
            // Use the first affiliate link in the array
            button.href = product.affiliateLinks[0].url;
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
            button.classList.add('affiliate-btn', 'buy-now');
            button.textContent = 'Buy Now';
            
            affiliateButtonsContainer.appendChild(button);
            
            // Add the product card to the grid
            productsGrid.appendChild(productCard);
        });
        
        // Add animation delay to each product card for staggered effect
        const cards = productsGrid.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.05}s`;
        });
        
        // Style banner ads
        const bannerAds = productsGrid.querySelectorAll('.banner-ad');
        bannerAds.forEach(ad => {
            ad.style.width = '100%';
            ad.style.margin = '20px 0';
            ad.style.textAlign = 'center';
        });
    }
    
    // Helper function to format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('hi-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }
});
