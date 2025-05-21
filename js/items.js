// Item definitions for the event space layout application
const Items = {
    types: {
        'round-table': {
            name: 'Round Table (5\')',
            width: 5,
            height: 5,
            className: 'round-table-item',
            chairs: 5
        },
        'rect-table': {
            name: 'Rectangle Table (5\'x3\')',
            width: 5,
            height: 3,
            className: 'rect-table-item',
            chairs: 2
        },
        'chair': {
            name: 'Chair',
            width: 1,
            height: 1,
            className: 'chair-item',
            chairs: 0
        }
    },
    
    // Create a new item
    createItem: function(type, x, y) {
        const itemType = this.types[type];
        if (!itemType) return null;
        
        // Check if position is valid
        if (!Grid.areCellsAvailable(x, y, itemType.width, itemType.height)) {
            return null;
        }
        
        // Create item element
        const item = document.createElement('div');
        item.className = `layout-item ${itemType.className}`;
        item.dataset.type = type;
        item.dataset.x = x;
        item.dataset.y = y;
        item.dataset.width = itemType.width;
        item.dataset.height = itemType.height;
        item.dataset.rotation = 0;
        
        // Set item position and size
        const container = document.getElementById('grid-container');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        item.style.width = `${itemType.width * (containerWidth / Grid.width)}px`;
        item.style.height = `${itemType.height * (containerHeight / Grid.height)}px`;
        item.style.left = `${x * (containerWidth / Grid.width)}px`;
        item.style.top = `${y * (containerHeight / Grid.height)}px`;
        
        // Mark cells as occupied
        Grid.markCells(x, y, itemType.width, itemType.height, true);
        
        // Add item to container
        Grid.itemsContainer.appendChild(item);
        
        // Add chairs if needed
        if (type === 'round-table') {
            this.addChairsAroundRoundTable(x, y, itemType.width);
        } else if (type === 'rect-table') {
            this.addChairsAroundRectTable(x, y, itemType.width, itemType.height);
        }
        
        return item;
    },
    
    // Add chairs around a round table
    addChairsAroundRoundTable: function(tableX, tableY, tableSize) {
        // Calculate center of the table
        const centerX = tableX + Math.floor(tableSize / 2);
        const centerY = tableY + Math.floor(tableSize / 2);
        const radius = Math.floor(tableSize / 2) + 1;
        
        // Add 5 chairs around the table
        const chairPositions = [
            { x: centerX, y: centerY - radius }, // Top
            { x: centerX + radius, y: centerY }, // Right
            { x: centerX, y: centerY + radius }, // Bottom
            { x: centerX - radius, y: centerY }, // Left
            { x: centerX + Math.floor(radius * 0.7), y: centerY - Math.floor(radius * 0.7) } // Top-right
        ];
        
        chairPositions.forEach(pos => {
            if (Grid.areCellsAvailable(pos.x, pos.y, 1, 1)) {
                this.createItem('chair', pos.x, pos.y);
            }
        });
    },
    
    // Add chairs around a rectangle table
    addChairsAroundRectTable: function(tableX, tableY, tableWidth, tableHeight) {
        // Add 2 chairs on the long sides
        const chairPositions = [
            { x: tableX + Math.floor(tableWidth / 2), y: tableY - 1 }, // Top middle
            { x: tableX + Math.floor(tableWidth / 2), y: tableY + tableHeight } // Bottom middle
        ];
        
        chairPositions.forEach(pos => {
            if (Grid.areCellsAvailable(pos.x, pos.y, 1, 1)) {
                this.createItem('chair', pos.x, pos.y);
            }
        });
    },
    
    // Get all items as an array of objects
    getAllItems: function() {
        const items = [];
        const itemElements = document.querySelectorAll('.layout-item');
        
        itemElements.forEach(item => {
            items.push({
                type: item.dataset.type,
                x: parseInt(item.dataset.x),
                y: parseInt(item.dataset.y),
                width: parseInt(item.dataset.width),
                height: parseInt(item.dataset.height),
                rotation: parseInt(item.dataset.rotation || 0)
            });
        });
        
        return items;
    },
    
    // Load items from an array of objects
    loadItems: function(items) {
        // Clear existing items
        Grid.clearAll();
        
        // Create new items
        items.forEach(item => {
            const newItem = this.createItem(item.type, item.x, item.y);
            if (newItem && item.rotation) {
                newItem.dataset.rotation = item.rotation;
                newItem.style.transform = `rotate(${item.rotation}deg)`;
                
                // If rotation is 90 or 270 degrees, swap width and height
                if (item.rotation % 180 !== 0) {
                    newItem.dataset.width = item.height;
                    newItem.dataset.height = item.width;
                    
                    const container = document.getElementById('grid-container');
                    const containerWidth = container.offsetWidth;
                    const containerHeight = container.offsetHeight;
                    
                    newItem.style.width = `${item.height * (containerWidth / Grid.width)}px`;
                    newItem.style.height = `${item.width * (containerHeight / Grid.height)}px`;
                }
            }
        });
    }
};
