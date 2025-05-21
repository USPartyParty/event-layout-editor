// UI interactions and event handlers for the event space layout application
const UI = {
    // Initialize UI
    init: function() {
        // Set up modal close on outside click
        this.setupModalCloseOnOutsideClick();
        
        // Load html2canvas if needed
        this.loadHtml2Canvas();
    },
    
    // Set up modal close on outside click
    setupModalCloseOnOutsideClick: function() {
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            modal.addEventListener('click', function(event) {
                if (event.target === this) {
                    this.classList.add('hidden');
                }
            });
        });
    },
    
    // Load html2canvas if needed
    loadHtml2Canvas: function() {
        if (typeof html2canvas === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            document.head.appendChild(script);
        }
    }
};

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    UI.init();
});
