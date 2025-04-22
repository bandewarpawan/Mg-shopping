// admin.js - Admin interface for managing affiliate links

document.addEventListener('DOMContentLoaded', function() {
    // Check if admin mode is enabled
    const isAdminMode = localStorage.getItem('adminMode') === 'true';
    
    // Create admin login button
    createAdminLoginButton();
    
    // If admin mode is enabled, show admin interface
    if (isAdminMode) {
        showAdminInterface();
    }
    
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
            alert('एडमिन मोड सक्रिय किया गया है। अब आप एफिलिएट लिंक्स को एडिट कर सकते हैं।');
            location.reload();
        } else if (password !== null) {
            alert('गलत पासवर्ड!');
        }
    }
    
    // Function to show admin interface
    function showAdminInterface() {
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
        
        // Make Buy Now buttons editable
        makeButtonsEditable();
    }
    
    // Function to make Buy Now buttons editable
    function makeButtonsEditable() {
        const buyNowButtons = document.querySelectorAll('.affiliate-btn.buy-now');
        
        buyNowButtons.forEach((button, index) => {
            // Add edit button instead of icon
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
            button.parentNode.appendChild(editButton);
            
            // Add click event to edit button
            editButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const currentUrl = button.href;
                const newUrl = prompt('एफिलिएट लिंक दर्ज करें:', currentUrl);
                
                if (newUrl && newUrl !== currentUrl) {
                    button.href = newUrl;
                    
                    // Save to localStorage for persistence
                    localStorage.setItem(`affiliateLink_${index}`, newUrl);
                    
                    alert('एफिलिएट लिंक अपडेट किया गया!');
                }
            });
            
            // Load saved link if exists
            const savedLink = localStorage.getItem(`affiliateLink_${index}`);
            if (savedLink) {
                button.href = savedLink;
            }
        });
    }
});
