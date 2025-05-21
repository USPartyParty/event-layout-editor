# Event Space Layout Application - Design Document

## Overview
This document outlines the design and architecture for the Event Space Layout Application, a web-based tool that allows users to organize items in their event space using a drag-and-drop interface with a snapping grid mechanism.

## Application Structure

### Directory Structure
```
event_space_layout_app/
├── index.html           # Main application entry point
├── css/
│   ├── styles.css       # Main stylesheet
│   └── normalize.css    # CSS reset for cross-browser consistency
├── js/
│   ├── app.js           # Main application logic
│   ├── grid.js          # Grid and snapping functionality
│   ├── items.js         # Table and chair item definitions
│   ├── drag-drop.js     # Drag and drop functionality
│   ├── templates.js     # Predefined layout templates
│   ├── save-load.js     # Save and load functionality
│   ├── export.js        # PDF export functionality
│   └── ui.js            # UI interactions and event handlers
└── assets/
    ├── room_layout.png  # Base room layout image
    ├── tables/          # Table images (to be created)
    ├── chairs/          # Chair images (to be created)
    └── icons/           # UI icons (to be created)
```

## Core Components

### 1. Canvas and Grid System
- Canvas size: 30' x 40' (scaled appropriately for screen display)
- Grid size: 1' x 1' (30 x 40 grid cells)
- Room features: Bathroom, Kitchenette, Storage, Entry, Door
- Implementation: HTML5 Canvas or SVG with grid overlay

### 2. Drag and Drop System
- Draggable items: Tables (5' round, 5' x 3' rectangle) and chairs
- Snapping: Items snap to 1' x 1' grid
- Rotation: Items can be rotated (especially tables)
- Implementation: Interact.js or custom HTML5 drag-and-drop

### 3. Item Definitions
- Round Table: 5' diameter (5 x 5 grid cells), comes with 5 chairs
- Rectangle Table: 5' x 3' (5 x 3 grid cells), comes with 2 chairs
- Chairs: Represented as individual items that can be moved independently
- Implementation: JavaScript objects with properties for size, shape, rotation

### 4. Templates System
- Predefined layouts: Maximum chairs, maximum tables, mixed layout
- Custom layouts: User-created layouts that can be saved
- Implementation: JSON structures defining item positions and properties

### 5. Save/Load System
- Save: Store layouts in browser localStorage
- Load: Retrieve saved layouts from localStorage
- Implementation: JSON serialization/deserialization

### 6. Export System
- PDF Export: Generate PDF of current layout with event details
- Implementation: jsPDF or similar library

### 7. Event Information Form
- Fields: Event name, date, client contact name, contact info, number of guests
- Implementation: HTML form with validation

### 8. User Interface
- Design inspiration: https://celebrationcenterwi.com/
- Target users: Non-technical event planners
- Implementation: Clean, intuitive interface with clear instructions

## Technical Considerations

### Browser Compatibility
- Target browsers: Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design: Works on desktop and tablets

### Future Online Deployment
- Code structure allows for easy migration to online hosting
- Data storage designed to work with both local and server-based storage

### Performance Considerations
- Optimize for smooth dragging and dropping
- Efficient rendering of multiple items
- Responsive UI even with many items on the canvas

## Implementation Plan
1. Set up basic HTML/CSS structure
2. Implement grid system and room layout display
3. Create draggable items (tables and chairs)
4. Implement snapping grid mechanism
5. Add rotation functionality
6. Implement save/load functionality
7. Create predefined templates
8. Implement PDF export
9. Add event information form
10. Polish UI and ensure usability
11. Test and validate application
