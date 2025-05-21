// Save, load, and export functionality for the event space layout application
const SaveLoad = {
    // Initialize save and load functionality
    init: function() {
        // Set up save button
        document.getElementById('btn-save').addEventListener('click', function() {
            document.getElementById('save-modal').classList.remove('hidden');
        });
        
        // Set up load button
        document.getElementById('btn-load').addEventListener('click', function() {
            SaveLoad.populateSavedLayouts();
            document.getElementById('load-modal').classList.remove('hidden');
        });
        
        // Set up export button
        document.getElementById('btn-export-pdf').addEventListener('click', function() {
            SaveLoad.exportToPDF();
        });
        
        // Set up clear button
        document.getElementById('btn-clear').addEventListener('click', function() {
            if (confirm('Are you sure you want to clear the current layout?')) {
                Grid.clearAll();
            }
        });
        
        // Set up save form
        document.getElementById('save-form').addEventListener('submit', function(event) {
            event.preventDefault();
            SaveLoad.saveLayout();
        });
        
        // Set up close modal buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', function() {
                this.closest('.modal').classList.add('hidden');
            });
        });
    },
    
    // Save current layout
    saveLayout: function() {
        const layoutName = document.getElementById('layout-name').value;
        if (!layoutName) return;
        
        // Get event information
        const eventInfo = {
            name: document.getElementById('event-name').value,
            date: document.getElementById('event-date').value,
            clientName: document.getElementById('client-name').value,
            clientContact: document.getElementById('client-contact').value,
            guestCount: document.getElementById('guest-count').value
        };
        
        // Get all items
        const items = Items.getAllItems();
        
        // Create layout object
        const layout = {
            name: layoutName,
            eventInfo: eventInfo,
            items: items,
            createdAt: new Date().toISOString()
        };
        
        // Get existing layouts
        let layouts = JSON.parse(localStorage.getItem('eventSpaceLayouts') || '[]');
        
        // Check if layout with same name exists
        const existingIndex = layouts.findIndex(l => l.name === layoutName);
        if (existingIndex !== -1) {
            // Replace existing layout
            layouts[existingIndex] = layout;
        } else {
            // Add new layout
            layouts.push(layout);
        }
        
        // Save layouts
        localStorage.setItem('eventSpaceLayouts', JSON.stringify(layouts));
        
        // Close modal
        document.getElementById('save-modal').classList.add('hidden');
        
        // Reset form
        document.getElementById('layout-name').value = '';
        
        // Show confirmation
        alert(`Layout "${layoutName}" saved successfully!`);
    },
    
    // Populate saved layouts
    populateSavedLayouts: function() {
        const savedLayoutsContainer = document.getElementById('saved-layouts');
        savedLayoutsContainer.innerHTML = '';
        
        // Get saved layouts
        const layouts = JSON.parse(localStorage.getItem('eventSpaceLayouts') || '[]');
        
        if (layouts.length === 0) {
            savedLayoutsContainer.innerHTML = '<p>No saved layouts found.</p>';
            return;
        }
        
        // Sort layouts by creation date (newest first)
        layouts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Create layout items
        layouts.forEach(layout => {
            const layoutItem = document.createElement('div');
            layoutItem.className = 'saved-layout-item';
            layoutItem.innerHTML = `
                <div class="layout-name">${layout.name}</div>
                <div class="layout-date">Created: ${new Date(layout.createdAt).toLocaleDateString()}</div>
                <div class="layout-actions">
                    <button class="btn-load-layout">Load</button>
                    <button class="btn-delete-layout">Delete</button>
                </div>
            `;
            
            // Load layout
            layoutItem.querySelector('.btn-load-layout').addEventListener('click', function() {
                SaveLoad.loadLayout(layout);
                document.getElementById('load-modal').classList.add('hidden');
            });
            
            // Delete layout
            layoutItem.querySelector('.btn-delete-layout').addEventListener('click', function() {
                if (confirm(`Are you sure you want to delete layout "${layout.name}"?`)) {
                    SaveLoad.deleteLayout(layout.name);
                    SaveLoad.populateSavedLayouts();
                }
            });
            
            savedLayoutsContainer.appendChild(layoutItem);
        });
    },
    
    // Load layout
    loadLayout: function(layout) {
        // Load event information
        document.getElementById('event-name').value = layout.eventInfo.name || '';
        document.getElementById('event-date').value = layout.eventInfo.date || '';
        document.getElementById('client-name').value = layout.eventInfo.clientName || '';
        document.getElementById('client-contact').value = layout.eventInfo.clientContact || '';
        document.getElementById('guest-count').value = layout.eventInfo.guestCount || '';
        
        // Load items
        Items.loadItems(layout.items);
    },
    
    // Delete layout
    deleteLayout: function(layoutName) {
        // Get saved layouts
        let layouts = JSON.parse(localStorage.getItem('eventSpaceLayouts') || '[]');
        
        // Filter out the layout to delete
        layouts = layouts.filter(layout => layout.name !== layoutName);
        
        // Save layouts
        localStorage.setItem('eventSpaceLayouts', JSON.stringify(layouts));
    },
    
    // Export to PDF
    exportToPDF: function() {
        // Get event information
        const eventInfo = {
            name: document.getElementById('event-name').value || 'Untitled Event',
            date: document.getElementById('event-date').value || 'No date specified',
            clientName: document.getElementById('client-name').value || 'No client specified',
            clientContact: document.getElementById('client-contact').value || 'No contact information',
            guestCount: document.getElementById('guest-count').value || 'No guest count specified'
        };
        
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Add title
        doc.setFontSize(20);
        doc.text('Event Space Layout', 105, 20, { align: 'center' });
        
        // Add event information
        doc.setFontSize(12);
        doc.text(`Event: ${eventInfo.name}`, 20, 40);
        doc.text(`Date: ${eventInfo.date}`, 20, 50);
        doc.text(`Client: ${eventInfo.clientName}`, 20, 60);
        doc.text(`Contact: ${eventInfo.clientContact}`, 20, 70);
        doc.text(`Guests: ${eventInfo.guestCount}`, 20, 80);
        
        // Capture layout as image
        const gridContainer = document.getElementById('grid-container');
        
        // Use html2canvas to capture the layout
        html2canvas(gridContainer).then(canvas => {
            // Add layout image
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 170;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            doc.addImage(imgData, 'PNG', 20, 90, imgWidth, imgHeight);
            
            // Add item counts
            const items = Items.getAllItems();
            const roundTables = items.filter(item => item.type === 'round-table').length;
            const rectTables = items.filter(item => item.type === 'rect-table').length;
            const chairs = items.filter(item => item.type === 'chair').length;
            
            doc.text('Item Counts:', 20, 100 + imgHeight);
            doc.text(`Round Tables (5'): ${roundTables}`, 20, 110 + imgHeight);
            doc.text(`Rectangle Tables (5'x3'): ${rectTables}`, 20, 120 + imgHeight);
            doc.text(`Chairs: ${chairs}`, 20, 130 + imgHeight);
            doc.text(`Total Seating Capacity: ${chairs}`, 20, 140 + imgHeight);
            
            // Add footer
            doc.setFontSize(10);
            doc.text('Generated by Event Space Layout Planner', 105, 285, { align: 'center' });
            
            // Save the PDF
            doc.save(`${eventInfo.name.replace(/\s+/g, '_')}_layout.pdf`);
        });
    }
};

// Initialize save and load functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if html2canvas is available, if not, load it
    if (typeof html2canvas === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = function() {
            SaveLoad.init();
        };
        document.head.appendChild(script);
    } else {
        SaveLoad.init();
    }
});
