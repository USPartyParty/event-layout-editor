// Grid system for the event space layout application
const Grid = {
    // Grid dimensions in feet
    width: 30,
    height: 40,
    // Cell size in feet
    cellSize: 1,
    // Grid element
    element: null,
    // Layout items container
    itemsContainer: null,
    // Grid cells
    cells: [],
    // Selected item
    selectedItem: null,
    
    // Initialize the grid
    init: function() {
        this.element = document.getElementById('grid-overlay');
        this.itemsContainer = document.getElementById('layout-items');
        
        // Calculate cell dimensions based on container size
        const container = document.getElementById('grid-container');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // Create grid cells
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.width = `${containerWidth / this.width}px`;
                cell.style.height = `${containerHeight / this.height}px`;
                cell.style.left = `${x * (containerWidth / this.width)}px`;
                cell.style.top = `${y * (containerHeight / this.height)}px`;
                
                this.element.appendChild(cell);
                this.cells.push({
                    element: cell,
                    x: x,
                    y: y,
                    occupied: false
                });
            }
        }
        
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    },
    
    // Handle window resize
    handleResize: function() {
        // Recalculate cell dimensions
        const container = document.getElementById('grid-container');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // Update cell positions and sizes
        for (let i = 0; i < this.cells.length; i++) {
            const cell = this.cells[i];
            const x = i % this.width;
            const y = Math.floor(i / this.width);
            
            cell.element.style.width = `${containerWidth / this.width}px`;
            cell.element.style.height = `${containerHeight / this.height}px`;
            cell.element.style.left = `${x * (containerWidth / this.width)}px`;
            cell.element.style.top = `${y * (containerHeight / this.height)}px`;
        }
        
        // Update item positions
        const items = document.querySelectorAll('.layout-item');
        items.forEach(item => {
            const x = parseInt(item.dataset.x);
            const y = parseInt(item.dataset.y);
            const width = parseInt(item.dataset.width);
            const height = parseInt(item.dataset.height);
            
            item.style.width = `${width * (containerWidth / this.width)}px`;
            item.style.height = `${height * (containerHeight / this.height)}px`;
            item.style.left = `${x * (containerWidth / this.width)}px`;
            item.style.top = `${y * (containerHeight / this.height)}px`;
        });
    },
    
    // Get cell at position
    getCellAt: function(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        
        return this.cells[y * this.width + x];
    },
    
    // Check if cells are available for an item
    areCellsAvailable: function(x, y, width, height) {
        // Check if any part of the item is outside the grid
        if (x < 0 || x + width > this.width || y < 0 || y + height > this.height) {
            return false;
        }
        
        // Check if any cell is occupied
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const cell = this.getCellAt(x + j, y + i);
                if (cell.occupied) {
                    return false;
                }
            }
        }
        
        return true;
    },
    
    // Mark cells as occupied or unoccupied
    markCells: function(x, y, width, height, occupied) {
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const cell = this.getCellAt(x + j, y + i);
                if (cell) {
                    cell.occupied = occupied;
                }
            }
        }
    },
    
    // Get grid position from pixel coordinates
    getGridPosition: function(pixelX, pixelY) {
        const container = document.getElementById('grid-container');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        const cellWidth = containerWidth / this.width;
        const cellHeight = containerHeight / this.height;
        
        const x = Math.floor(pixelX / cellWidth);
        const y = Math.floor(pixelY / cellHeight);
        
        return { x, y };
    },
    
    // Get pixel coordinates from grid position
    getPixelPosition: function(gridX, gridY) {
        const container = document.getElementById('grid-container');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        const cellWidth = containerWidth / this.width;
        const cellHeight = containerHeight / this.height;
        
        const x = gridX * cellWidth;
        const y = gridY * cellHeight;
        
        return { x, y };
    },
    
    // Select an item
    selectItem: function(item) {
        // Deselect previous item
        if (this.selectedItem) {
            this.selectedItem.classList.remove('selected');
        }
        
        // Select new item
        this.selectedItem = item;
        if (item) {
            item.classList.add('selected');
            document.getElementById('item-properties').classList.remove('hidden');
        } else {
            document.getElementById('item-properties').classList.add('hidden');
        }
    },
    
    // Rotate selected item
    rotateSelectedItem: function() {
        if (!this.selectedItem) return;
        
        const item = this.selectedItem;
        const currentRotation = parseInt(item.dataset.rotation || 0);
        const newRotation = (currentRotation + 90) % 360;
        
        // Swap width and height if rotating by 90 or 270 degrees
        if ((currentRotation % 180 === 0 && newRotation % 180 !== 0) ||
            (currentRotation % 180 !== 0 && newRotation % 180 === 0)) {
            
            // Get current position and dimensions
            const x = parseInt(item.dataset.x);
            const y = parseInt(item.dataset.y);
            const width = parseInt(item.dataset.width);
            const height = parseInt(item.dataset.height);
            
            // Mark current cells as unoccupied
            this.markCells(x, y, width, height, false);
            
            // Swap dimensions
            item.dataset.width = height;
            item.dataset.height = width;
            
            // Check if new position is valid
            if (!this.areCellsAvailable(x, y, height, width)) {
                // Revert if invalid
                item.dataset.width = width;
                item.dataset.height = height;
                this.markCells(x, y, width, height, true);
                return;
            }
            
            // Update item size
            const container = document.getElementById('grid-container');
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            
            item.style.width = `${height * (containerWidth / this.width)}px`;
            item.style.height = `${width * (containerHeight / this.height)}px`;
            
            // Mark new cells as occupied
            this.markCells(x, y, height, width, true);
        }
        
        // Update rotation
        item.dataset.rotation = newRotation;
        item.style.transform = `rotate(${newRotation}deg)`;
    },
    
    // Delete selected item
    deleteSelectedItem: function() {
        if (!this.selectedItem) return;
        
        const item = this.selectedItem;
        const x = parseInt(item.dataset.x);
        const y = parseInt(item.dataset.y);
        const width = parseInt(item.dataset.width);
        const height = parseInt(item.dataset.height);
        
        // Mark cells as unoccupied
        this.markCells(x, y, width, height, false);
        
        // Remove item
        item.remove();
        this.selectItem(null);
    },
    
    // Clear all items
    clearAll: function() {
        // Remove all items
        this.itemsContainer.innerHTML = '';
        
        // Mark all cells as unoccupied
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i].occupied = false;
        }
        
        this.selectItem(null);
    }
};

// Initialize grid when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    Grid.init();
});
