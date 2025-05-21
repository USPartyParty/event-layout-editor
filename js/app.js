// Main application logic for the event space layout application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize application components
    // Grid and DragDrop are initialized in their respective files
    
    // Add event listener for window resize
    window.addEventListener('resize', function() {
        // Redraw grid and update item positions
        Grid.handleResize();
    });
    
    // Load html2canvas for PDF export
    if (typeof html2canvas === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(script);
    }
    
    // Initialize export functionality
    const exportButton = document.getElementById('btn-export-pdf');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            SaveLoad.exportToPDF();
        });
    }
    
    console.log('Event Space Layout Application initialized');
});
