// Drag and drop functionality for the event space layout application
const DragDrop = {
    // Initialize drag and drop
    init: function() {
        // Set up draggable items from palette
        this.setupPaletteItems();
        
        // Set up draggable items in the layout
        this.setupLayoutItems();
        
        // Set up item selection
        this.setupItemSelection();
        
        // Set up item property buttons
        this.setupItemProperties();
    },
    
    // Set up draggable items from palette
    setupPaletteItems: function() {
        const paletteItems = document.querySelectorAll('.item-palette .item');
        
        paletteItems.forEach(item => {
            interact(item).draggable({
                inertia: false,
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        endOnly: true
                    })
                ],
                autoScroll: true,
                
                onstart: function(event) {
                    const type = event.target.getAttribute('data-type');
                    const itemType = Items.types[type];
                    
                    // Create ghost element
                    const ghost = document.createElement('div');
                    ghost.className = `layout-item ${itemType.className} ghost`;
                    ghost.style.width = `${itemType.width * 20}px`; // Approximate size for ghost
                    ghost.style.height = `${itemType.height * 20}px`;
                    ghost.style.opacity = '0.5';
                    ghost.style.position = 'absolute';
                    ghost.style.zIndex = '1000';
                    ghost.style.pointerEvents = 'none';
                    
                    document.body.appendChild(ghost);
                    event.target._ghost = ghost;
                },
                
                onmove: function(event) {
                    const ghost = event.target._ghost;
                    if (ghost) {
                        ghost.style.left = `${event.clientX - ghost.offsetWidth / 2}px`;
                        ghost.style.top = `${event.clientY - ghost.offsetHeight / 2}px`;
                    }
                },
                
                onend: function(event) {
                    const ghost = event.target._ghost;
                    if (ghost) {
                        ghost.remove();
                        delete event.target._ghost;
                    }
                }
            });
        });
        
        // Set up dropzone for grid container
        const gridContainer = document.getElementById('grid-container');
        
        interact(gridContainer).dropzone({
            accept: '.item',
            overlap: 0.5,
            
            ondropactivate: function(event) {
                event.target.classList.add('drop-active');
            },
            
            ondragenter: function(event) {
                event.target.classList.add('drop-target');
                event.relatedTarget.classList.add('can-drop');
            },
            
            ondragleave: function(event) {
                event.target.classList.remove('drop-target');
                event.relatedTarget.classList.remove('can-drop');
            },
            
            ondrop: function(event) {
                const type = event.relatedTarget.getAttribute('data-type');
                const itemType = Items.types[type];
                
                // Get drop position relative to grid container
                const rect = event.target.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                
                // Convert to grid position
                const gridPos = Grid.getGridPosition(x, y);
                
                // Create item at grid position
                const item = Items.createItem(type, gridPos.x, gridPos.y);
                
                // Select the new item
                if (item) {
                    Grid.selectItem(item);
                }
            },
            
            ondropdeactivate: function(event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove('drop-target');
            }
        });
    },
    
    // Set up draggable items in the layout
    setupLayoutItems: function() {
        // Use event delegation for layout items
        interact('#layout-items').on('down', function(event) {
            if (event.target.classList.contains('layout-item')) {
                // Select the item
                Grid.selectItem(event.target);
            }
        });
        
        // Make layout items draggable
        interact('.layout-item').draggable({
            inertia: false,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            autoScroll: true,
            
            onstart: function(event) {
                // Select the item
                Grid.selectItem(event.target);
                
                // Store original position
                const x = parseInt(event.target.dataset.x);
                const y = parseInt(event.target.dataset.y);
                const width = parseInt(event.target.dataset.width);
                const height = parseInt(event.target.dataset.height);
                
                event.target._originalPos = { x, y, width, height };
                
                // Mark cells as unoccupied
                Grid.markCells(x, y, width, height, false);
            },
            
            onmove: function(event) {
                const target = event.target;
                
                // Get current position
                let x = parseFloat(target.dataset.x || 0);
                let y = parseFloat(target.dataset.y || 0);
                
                // Update position
                x += event.dx / (document.getElementById('grid-container').offsetWidth / Grid.width);
                y += event.dy / (document.getElementById('grid-container').offsetHeight / Grid.height);
                
                // Update element position
                target.style.left = `${x * (document.getElementById('grid-container').offsetWidth / Grid.width)}px`;
                target.style.top = `${y * (document.getElementById('grid-container').offsetHeight / Grid.height)}px`;
                
                // Store position temporarily
                target._currentPos = { x, y };
            },
            
            onend: function(event) {
                const target = event.target;
                const originalPos = target._originalPos;
                const currentPos = target._currentPos;
                
                if (!currentPos) return;
                
                // Snap to grid
                const gridX = Math.round(currentPos.x);
                const gridY = Math.round(currentPos.y);
                
                // Check if new position is valid
                if (Grid.areCellsAvailable(gridX, gridY, originalPos.width, originalPos.height)) {
                    // Update position
                    target.dataset.x = gridX;
                    target.dataset.y = gridY;
                    
                    // Update element position
                    target.style.left = `${gridX * (document.getElementById('grid-container').offsetWidth / Grid.width)}px`;
                    target.style.top = `${gridY * (document.getElementById('grid-container').offsetHeight / Grid.height)}px`;
                    
                    // Mark cells as occupied
                    Grid.markCells(gridX, gridY, originalPos.width, originalPos.height, true);
                } else {
                    // Revert to original position
                    target.dataset.x = originalPos.x;
                    target.dataset.y = originalPos.y;
                    
                    // Update element position
                    target.style.left = `${originalPos.x * (document.getElementById('grid-container').offsetWidth / Grid.width)}px`;
                    target.style.top = `${originalPos.y * (document.getElementById('grid-container').offsetHeight / Grid.height)}px`;
                    
                    // Mark original cells as occupied
                    Grid.markCells(originalPos.x, originalPos.y, originalPos.width, originalPos.height, true);
                }
                
                // Clean up
                delete target._originalPos;
                delete target._currentPos;
            }
        });
    },
    
    // Set up item selection
    setupItemSelection: function() {
        // Click on grid container background to deselect
        document.getElementById('grid-container').addEventListener('click', function(event) {
            if (event.target === this || event.target.id === 'grid-overlay' || event.target.id === 'room-layout') {
                Grid.selectItem(null);
            }
        });
    },
    
    // Set up item property buttons
    setupItemProperties: function() {
        // Rotate button
        document.getElementById('btn-rotate').addEventListener('click', function() {
            Grid.rotateSelectedItem();
        });
        
        // Delete button
        document.getElementById('btn-delete').addEventListener('click', function() {
            Grid.deleteSelectedItem();
        });
    }
};

// Initialize drag and drop when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    DragDrop.init();
});
