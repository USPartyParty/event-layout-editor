// Templates for the event space layout application
const Templates = {
    // Initialize templates
    init: function() {
        // Set up template buttons
        this.setupTemplateButtons();
    },
    
    // Set up template buttons
    setupTemplateButtons: function() {
        // Max chairs template
        document.getElementById('template-max-chairs').addEventListener('click', function() {
            Templates.loadMaxChairsTemplate();
        });
        
        // Max tables template
        document.getElementById('template-max-tables').addEventListener('click', function() {
            Templates.loadMaxTablesTemplate();
        });
        
        // Mixed layout template
        document.getElementById('template-mixed').addEventListener('click', function() {
            Templates.loadMixedTemplate();
        });
    },
    
    // Load max chairs template
    loadMaxChairsTemplate: function() {
        // Clear existing layout
        Grid.clearAll();
        
        // Calculate how many chairs can fit in the room
        // Allocating 2' x 2' per chair as specified in requirements
        const chairsPerRow = Math.floor(Grid.width / 2);
        const rows = Math.floor(Grid.height / 2);
        
        // Leave space for walkways and room features
        const startX = 1;
        const startY = 1;
        const endX = Grid.width - 2;
        const endY = Grid.height - 10; // Leave space for bathroom, kitchenette, storage
        
        // Place chairs in a grid pattern
        for (let y = startY; y < endY; y += 2) {
            for (let x = startX; x < endX; x += 2) {
                // Skip bathroom area
                if (x < 8 && y > Grid.height - 15 && y < Grid.height - 5) {
                    continue;
                }
                
                // Skip kitchenette and storage area
                if (y > Grid.height - 8) {
                    continue;
                }
                
                // Skip entry area
                if (x > Grid.width - 5 && y > Grid.height - 15) {
                    continue;
                }
                
                Items.createItem('chair', x, y);
            }
        }
    },
    
    // Load max tables template
    loadMaxTablesTemplate: function() {
        // Clear existing layout
        Grid.clearAll();
        
        // Place round tables (5' diameter)
        const roundTables = [
            {x: 3, y: 3},
            {x: 12, y: 3},
            {x: 21, y: 3},
            {x: 3, y: 12},
            {x: 12, y: 12},
            {x: 21, y: 12},
            {x: 3, y: 21},
            {x: 12, y: 21},
            {x: 21, y: 21}
        ];
        
        roundTables.forEach(pos => {
            if (Grid.areCellsAvailable(pos.x, pos.y, 5, 5)) {
                Items.createItem('round-table', pos.x, pos.y);
            }
        });
        
        // Place rectangle tables (5' x 3')
        const rectTables = [
            {x: 3, y: 30},
            {x: 12, y: 30},
            {x: 21, y: 30}
        ];
        
        rectTables.forEach(pos => {
            if (Grid.areCellsAvailable(pos.x, pos.y, 5, 3)) {
                Items.createItem('rect-table', pos.x, pos.y);
            }
        });
    },
    
    // Load mixed layout template
    loadMixedTemplate: function() {
        // Clear existing layout
        Grid.clearAll();
        
        // Place round tables with chairs
        const roundTables = [
            {x: 5, y: 5},
            {x: 18, y: 5},
            {x: 5, y: 15},
            {x: 18, y: 15},
            {x: 12, y: 25}
        ];
        
        roundTables.forEach(pos => {
            if (Grid.areCellsAvailable(pos.x, pos.y, 5, 5)) {
                Items.createItem('round-table', pos.x, pos.y);
            }
        });
        
        // Place rectangle tables with chairs
        const rectTables = [
            {x: 5, y: 30},
            {x: 18, y: 30}
        ];
        
        rectTables.forEach(pos => {
            if (Grid.areCellsAvailable(pos.x, pos.y, 5, 3)) {
                Items.createItem('rect-table', pos.x, pos.y);
            }
        });
        
        // Add additional chairs
        const additionalChairs = [
            {x: 12, y: 10},
            {x: 13, y: 10},
            {x: 14, y: 10},
            {x: 12, y: 20},
            {x: 13, y: 20},
            {x: 14, y: 20}
        ];
        
        additionalChairs.forEach(pos => {
            if (Grid.areCellsAvailable(pos.x, pos.y, 1, 1)) {
                Items.createItem('chair', pos.x, pos.y);
            }
        });
    }
};

// Initialize templates when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    Templates.init();
});
