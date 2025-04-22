// admin-panel.js - Enhanced Admin Panel with Product Add/Delete functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if admin mode is enabled
    const isAdminMode = localStorage.getItem('adminMode') === 'true';
    
    // If admin mode is enabled, create the admin panels
    if (isAdminMode) {
        createProductAddPanel();
        addDeleteButtonsToProducts();
        makeFooterEditable();
        addBannerAdControls();
    }
    
    // Create admin login button
    createAdminLoginButton();
    
    // Function to create admin login button
    function createAdminLoginButton() {
        const footer = document.querySelector('.footer-content');
        if (!footer) return;
        
        const adminSection = document.createElement('div');
        adminSection.className = 'footer-section admin-section';
        adminSection.style.textAlign = 'right';
        
        const adminButton = document.createElement('button');
        adminButton.id = 'admin-login-btn';
        adminButton.className = 'admin-button';
        adminButton.textContent = isAdminMode ? 'एडमिन मोड बंद करें' : 'एडमिन लॉगिन';
        adminButton.style.background = 'none';
        adminButton.style.border = 'none';
        adminButton.style.color = '#999';
        adminButton.style.fontSize = '0.8rem';
        adminButton.style.cursor = 'pointer';
        adminButton.style.padding = '5px';
        
        adminButton.addEventListener('click', function() {
            if (isAdminMode) {
                // Logout
                localStorage.removeItem('adminMode');
                location.reload();
            } else {
                // Show login prompt
                showLoginPrompt();
            }
        });
        
        adminSection.appendChild(adminButton);
        footer.appendChild(adminSection);
    }
    
    // Function to show login prompt
    function showLoginPrompt() {
        const password = prompt('एडमिन पासवर्ड दर्ज करें:');
        
        // Simple password check (in a real app, this would be server-side)
        if (password === 'admin123') {
            localStorage.setItem('adminMode', 'true');
            alert('एडमिन मोड सक्रिय किया गया है। अब आप प्रोडक्ट्स को एड और डिलीट कर सकते हैं।');
            location.reload();
        } else if (password !== null) {
            alert('गलत पासवर्ड!');
        }
    }
    
    // Function to create the product add panel
    function createProductAddPanel() {
        // Create the panel container
        const panelContainer = document.createElement('div');
        panelContainer.id = 'product-add-panel';
        panelContainer.className = 'admin-panel';
        
        // Style the panel
        panelContainer.style.position = 'fixed';
        panelContainer.style.top = '70px';
        panelContainer.style.right = '20px';
        panelContainer.style.backgroundColor = '#fff';
        panelContainer.style.padding = '20px';
        panelContainer.style.borderRadius = '8px';
        panelContainer.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.2)';
        panelContainer.style.zIndex = '1000';
        panelContainer.style.width = '300px';
        panelContainer.style.maxHeight = '80vh';
        panelContainer.style.overflowY = 'auto';
        panelContainer.style.display = 'none';
        
        // Create panel content
        panelContainer.innerHTML = `
            <div class="panel-header">
                <h3 style="margin-top: 0; color: #4a4a4a;">नया प्रोडक्ट जोड़ें</h3>
                <button id="close-panel-btn" style="position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer; font-size: 18px;">×</button>
            </div>
            <div class="panel-body">
                <form id="product-add-form">
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="product-title" style="display: block; margin-bottom: 5px; font-weight: bold;">प्रोडक्ट टाइटल</label>
                        <input type="text" id="product-title" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="product-description" style="display: block; margin-bottom: 5px; font-weight: bold;">डिस्क्रिप्शन</label>
                        <textarea id="product-description" rows="3" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="product-price-inr" style="display: block; margin-bottom: 5px; font-weight: bold;">प्राइस (₹)</label>
                        <input type="number" id="product-price-inr" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="product-price-usd" style="display: block; margin-bottom: 5px; font-weight: bold;">प्राइस ($) - ऑप्शनल</label>
                        <input type="number" id="product-price-usd" step="0.01" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <p style="margin-top: 5px; font-size: 0.8rem; color: #666;">
                            (खाली छोड़ने पर ऑटोमैटिक कन्वर्ट होगा)
                        </p>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="product-category" style="display: block; margin-bottom: 5px; font-weight: bold;">श्रेणी</label>
                        <select id="product-category" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="electronics">इलेक्ट्रॉनिक्स</option>
                            <option value="fashion">फैशन</option>
                            <option value="home">होम</option>
                            <option value="beauty">ब्यूटी</option>
                            <option value="fitness">फिटनेस</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="product-link" style="display: block; margin-bottom: 5px; font-weight: bold;">Buy Now लिंक</label>
                        <input type="url" id="product-link" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="product-image" style="display: block; margin-bottom: 5px; font-weight: bold;">प्रोडक्ट इमेज</label>
                        <input type="file" id="product-image" accept="image/*" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <button type="submit" style="background-color: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; width: 100%;">प्रोडक्ट जोड़ें</button>
                </form>
            </div>
        `;
        
        // Add the panel to the body
        document.body.appendChild(panelContainer);
        
        // Create a button to toggle the panel
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-panel-btn';
        toggleButton.textContent = 'नया प्रोडक्ट जोड़ें';
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '70px';
        toggleButton.style.right = '20px';
        toggleButton.style.backgroundColor = '#4CAF50';
        toggleButton.style.color = 'white';
        toggleButton.style.padding = '10px 15px';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '4px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.zIndex = '999';
        
        // Add the toggle button to the body
        document.body.appendChild(toggleButton);
        
        // Add event listeners
        toggleButton.addEventListener('click', function() {
            if (panelContainer.style.display === 'none') {
                panelContainer.style.display = 'block';
                toggleButton.style.display = 'none';
            }
        });
        
        document.getElementById('close-panel-btn').addEventListener('click', function() {
            panelContainer.style.display = 'none';
            toggleButton.style.display = 'block';
        });
        
        document.getElementById('product-add-form').addEventListener('submit', function(e) {
            e.preventDefault();
            addNewProduct();
        });
    }
    
    // Function to add delete buttons to products
    function addDeleteButtonsToProducts() {
        // Add admin indicator
        const header = document.querySelector('header');
        const adminIndicator = document.createElement('div');
        adminIndicator.className = 'admin-indicator';
        adminIndicator.textContent = 'एडमिन मोड';
        adminIndicator.style.position = 'absolute';
        adminIndicator.style.top = '10px';
        adminIndicator.style.right = '10px';
        adminIndicator.style.backgroundColor = '#ff4500';
        adminIndicator.style.color = 'white';
        adminIndicator.style.padding = '5px 10px';
        adminIndicator.style.borderRadius = '4px';
        adminIndicator.style.fontSize = '0.8rem';
        header.style.position = 'relative';
        header.appendChild(adminIndicator);
        
        // Wait for products to be rendered
        setTimeout(() => {
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach((card, index) => {
                // Create delete button
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-product-btn';
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                deleteButton.style.position = 'absolute';
                deleteButton.style.top = '10px';
                deleteButton.style.right = '10px';
                deleteButton.style.backgroundColor = '#ff4500';
                deleteButton.style.color = 'white';
                deleteButton.style.border = 'none';
                deleteButton.style.borderRadius = '50%';
                deleteButton.style.width = '30px';
                deleteButton.style.height = '30px';
                deleteButton.style.display = 'flex';
                deleteButton.style.justifyContent = 'center';
                deleteButton.style.alignItems = 'center';
                deleteButton.style.cursor = 'pointer';
                deleteButton.style.zIndex = '10';
                
                // Set position relative on card for absolute positioning
                card.style.position = 'relative';
                
                // Add delete button to card
                card.appendChild(deleteButton);
                
                // Add click event to delete button
                deleteButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (confirm('क्या आप वाकई इस प्रोडक्ट को डिलीट करना चाहते हैं?')) {
                        deleteProduct(index);
                    }
                });
                
                // Add edit link button
                const buyNowButton = card.querySelector('.affiliate-btn.buy-now');
                if (buyNowButton) {
                    const editButton = document.createElement('button');
                    editButton.textContent = 'एडिट लिंक';
                    editButton.style.marginLeft = '10px';
                    editButton.style.cursor = 'pointer';
                    editButton.style.backgroundColor = '#4CAF50';
                    editButton.style.color = 'white';
                    editButton.style.border = 'none';
                    editButton.style.borderRadius = '4px';
                    editButton.style.padding = '5px 10px';
                    editButton.style.fontSize = '0.8rem';
                    
                    // Add the edit button next to the Buy Now button
                    buyNowButton.parentNode.appendChild(editButton);
                    
                    // Add click event to edit button
                    editButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const currentUrl = buyNowButton.href;
                        const newUrl = prompt('Buy Now लिंक दर्ज करें:', currentUrl);
                        
                        if (newUrl && newUrl !== currentUrl) {
                            buyNowButton.href = newUrl;
                            
                            // Save to localStorage for persistence
                            const customProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
                            if (customProducts[index]) {
                                customProducts[index].affiliateLinks[0].url = newUrl;
                                localStorage.setItem('customProducts', JSON.stringify(customProducts));
                            }
                            
                            alert('लिंक अपडेट किया गया!');
                        }
                    });
                }
            });
        }, 1000); // Wait for products to render
    }
    
    // Function to make footer editable
    function makeFooterEditable() {
        // Make email editable
        const emailElement = document.getElementById('contact-email');
        if (emailElement) {
            makeElementEditable(emailElement, 'Email दर्ज करें:');
        }
        
        // Make phone editable
        const phoneElement = document.getElementById('contact-phone');
        if (phoneElement) {
            makeElementEditable(phoneElement, 'फोन नंबर दर्ज करें:');
        }
        
        // Make social links editable
        const socialLinks = [
            { id: 'social-facebook', prompt: 'Facebook लिंक दर्ज करें:' },
            { id: 'social-instagram', prompt: 'Instagram लिंक दर्ज करें:' },
            { id: 'social-twitter', prompt: 'Twitter लिंक दर्ज करें:' },
            { id: 'social-youtube', prompt: 'YouTube लिंक दर्ज करें:' }
        ];
        
        socialLinks.forEach(link => {
            const element = document.getElementById(link.id);
            if (element) {
                element.style.position = 'relative';
                
                // Add edit icon
                const editIcon = document.createElement('span');
                editIcon.innerHTML = '✏️';
                editIcon.style.position = 'absolute';
                editIcon.style.top = '-10px';
                editIcon.style.right = '-10px';
                editIcon.style.backgroundColor = '#4CAF50';
                editIcon.style.color = 'white';
                editIcon.style.borderRadius = '50%';
                editIcon.style.width = '20px';
                editIcon.style.height = '20px';
                editIcon.style.display = 'flex';
                editIcon.style.justifyContent = 'center';
                editIcon.style.alignItems = 'center';
                editIcon.style.fontSize = '12px';
                editIcon.style.cursor = 'pointer';
                
                element.appendChild(editIcon);
                
                // Add click event
                editIcon.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const currentUrl = element.href;
                    const newUrl = prompt(link.prompt, currentUrl);
                    
                    if (newUrl && newUrl !== currentUrl) {
                        element.href = newUrl;
                        localStorage.setItem(link.id, newUrl);
                    }
                });
                
                // Load saved link if exists
                const savedLink = localStorage.getItem(link.id);
                if (savedLink) {
                    element.href = savedLink;
                }
            }
        });
    }
    
    // Helper function to make elements editable
    function makeElementEditable(element, promptText) {
        // Store original text
        const originalText = element.textContent;
        
        // Add edit icon
        const editIcon = document.createElement('span');
        editIcon.innerHTML = '✏️';
        editIcon.style.marginLeft = '5px';
        editIcon.style.cursor = 'pointer';
        editIcon.style.fontSize = '12px';
        
        element.appendChild(editIcon);
        
        // Add click event
        editIcon.addEventListener('click', function() {
            const newText = prompt(promptText, element.textContent);
            
            if (newText && newText !== element.textContent) {
                // Remove edit icon temporarily
                element.removeChild(editIcon);
                
                // Update text
                element.textContent = newText;
                
                // Save to localStorage
                localStorage.setItem(element.id, newText);
                
                // Add edit icon back
                element.appendChild(editIcon);
            }
        });
        
        // Load saved text if exists
        const savedText = localStorage.getItem(element.id);
        if (savedText) {
            // Remove edit icon temporarily
            if (element.contains(editIcon)) {
                element.removeChild(editIcon);
            }
            
            // Update text
            element.textContent = savedText;
            
            // Add edit icon back
            element.appendChild(editIcon);
        }
    }
    
    // Function to add banner ad controls
    function addBannerAdControls() {
        // Create banner ad control panel
        const bannerControlPanel = document.createElement('div');
        bannerControlPanel.id = 'banner-control-panel';
        bannerControlPanel.className = 'admin-panel';
        bannerControlPanel.style.position = 'fixed';
        bannerControlPanel.style.bottom = '20px';
        bannerControlPanel.style.right = '20px';
        bannerControlPanel.style.backgroundColor = '#fff';
        bannerControlPanel.style.padding = '15px';
        bannerControlPanel.style.borderRadius = '8px';
        bannerControlPanel.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.2)';
        bannerControlPanel.style.zIndex = '999';
        
        bannerControlPanel.innerHTML = `
            <h4 style="margin-top: 0; margin-bottom: 10px;">बैनर एड्स कंट्रोल</h4>
            <button id="edit-banner-btn" style="background-color: #4CAF50; color: white; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; width: 100%; margin-bottom: 10px;">बैनर एड्स एडिट करें</button>
            <div style="font-size: 0.8rem; color: #666;">
                <p>बैनर एड्स हर 3 प्रोडक्ट्स के बाद दिखाई देंगे</p>
            </div>
        `;
        
        document.body.appendChild(bannerControlPanel);
        
        // Add event listener to edit banner button
        document.getElementById('edit-banner-btn').addEventListener('click', function() {
            showBannerEditDialog();
        });
    }
    
    // Function to show banner edit dialog
    function showBannerEditDialog() {
        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'banner-edit-dialog';
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = '#fff';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.2)';
        dialog.style.zIndex = '1001';
        dialog.style.width = '80%';
        dialog.style.maxWidth = '500px';
        
        // Get saved banner HTML
        const savedBannerHTML = localStorage.getItem('bannerAdHTML') || '';
        
        dialog.innerHTML = `
            <h3 style="margin-top: 0;">बैनर एड्स HTML एडिट करें</h3>
            <p style="font-size: 0.9rem; color: #666;">HTML कोड यहां पेस्ट करें (AdSense या Affiliate Banner):</p>
            <textarea id="banner-html" rows="10" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 15px;">${savedBannerHTML}</textarea>
            <div style="display: flex; justify-content: flex-end;">
                <button id="cancel-banner-edit" style="background-color: #ccc; color: #333; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">रद्द करें</button>
                <button id="save-banner-edit" style="background-color: #4CAF50; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer;">सेव करें</button>
            </div>
        `;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '1000';
        
        // Add to body
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
        
        // Add event listeners
        document.getElementById('cancel-banner-edit').addEventListener('click', function() {
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
        });
        
        document.getElementById('save-banner-edit').addEventListener('click', function() {
            const bannerHTML = document.getElementById('banner-html').value;
            localStorage.setItem('bannerAdHTML', bannerHTML);
            alert('बैनर एड्स सेव किए गए! पेज रिफ्रेश करने पर दिखाई देंगे।');
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
            location.reload();
        });
    }
    
    // Function to add a new product
    function addNewProduct() {
        // Get form values
        const title = document.getElementById('product-title').value;
        const description = document.getElementById('product-description').value;
        const priceINR = parseInt(document.getElementById('product-price-inr').value);
        let priceUSD = document.getElementById('product-price-usd').value;
        const category = document.getElementById('product-category').value;
        const buyNowLink = document.getElementById('product-link').value;
        const imageFile = document.getElementById('product-image').files[0];
        
        // If USD price is not provided, convert from INR
        if (!priceUSD) {
            // Using a fixed exchange rate for simplicity (1 USD = 83 INR approximately)
            priceUSD = (priceINR / 83).toFixed(2);
        }
        
        // Convert image to base64
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            
            // Create a new product object
            const newProduct = {
                id: Date.now(), // Use timestamp as a unique ID
                title: title,
                description: description,
                price: priceINR,
                priceUSD: parseFloat(priceUSD),
                image: imageData, // Store image as base64
                category: category,
                affiliateLinks: [
                    { name: "buy", url: buyNowLink }
                ]
            };
            
            // Get existing products from localStorage or use empty array
            let customProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
            
            // Add the new product
            customProducts.push(newProduct);
            
            // Save to localStorage
            localStorage.setItem('customProducts', JSON.stringify(customProducts));
            
            // Show success message
            alert('नया प्रोडक्ट सफलतापूर्वक जोड़ा गया!');
            
            // Reset the form
            document.getElementById('product-add-form').reset();
            
            // Refresh the page to show the new product
            location.reload();
        };
        
        // Read the image file as data URL (base64)
        reader.readAsDataURL(imageFile);
    }
    
    // Function to delete a product
    function deleteProduct(index) {
        // Get all products (default + custom)
        const defaultProducts = products || [];
        let customProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
        
        // Determine if we're deleting a default product or custom product
        if (index < defaultProducts.length) {
            // Create a list of hidden default products if it doesn't exist
            let hiddenProducts = JSON.parse(localStorage.getItem('hiddenProducts')) || [];
            
            // Add the product ID to hidden products
            hiddenProducts.push(defaultProducts[index].id);
            
            // Save to localStorage
            localStorage.setItem('hiddenProducts', JSON.stringify(hiddenProducts));
        } else {
            // Adjust index for custom products array
            const customIndex = index - defaultProducts.length;
            
            // Remove the product from custom products
            if (customIndex >= 0 && customIndex < customProducts.length) {
                customProducts.splice(customIndex, 1);
                
                // Save to localStorage
                localStorage.setItem('customProducts', JSON.stringify(customProducts));
            }
        }
        
        // Refresh the page to update the product list
        location.reload();
    }
});
