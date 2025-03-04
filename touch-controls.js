(function() {
  // This script adds touch support to the DAT.Globe implementation
  
  // Wait until the globe is initialized
  window.addEventListener('load', function() {
    // Get the container element
    const container = document.getElementById('container');
    if (!container) return;
    
    let isDragging = false;
    let previousTouchX = 0;
    let previousTouchY = 0;
    let startDistance = 0;
    
    // Store original globe mouse handlers to chain them
    const globeInstance = window.globe;
    if (!globeInstance || !globeInstance._onMouseDown || !globeInstance._onMouseMove || !globeInstance._onMouseUp) {
      console.warn('Globe instance or mouse handlers not found');
      return;
    }
    
    // Touch event handlers
    function handleTouchStart(event) {
      event.preventDefault();
      
      if (event.touches.length === 1) {
        // Single touch - start rotation
        isDragging = true;
        previousTouchX = event.touches[0].clientX;
        previousTouchY = event.touches[0].clientY;
        
        // Simulate mouse event for the original handler
        const mouseEvent = new MouseEvent('mousedown', {
          clientX: previousTouchX,
          clientY: previousTouchY,
          button: 0
        });
        container.dispatchEvent(mouseEvent);
      } else if (event.touches.length === 2) {
        // Two touches - start zoom
        isDragging = false;
        
        // Calculate distance between two points for pinch zoom
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        startDistance = Math.sqrt(dx * dx + dy * dy);
      }
    }
    
    function handleTouchMove(event) {
      event.preventDefault();
      
      if (!globeInstance) return;
      
      if (event.touches.length === 1 && isDragging) {
        // Single touch move - rotate the globe
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        
        // Simulate mouse event for the original handler
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: touchX,
          clientY: touchY
        });
        container.dispatchEvent(mouseEvent);
        
        previousTouchX = touchX;
        previousTouchY = touchY;
      } else if (event.touches.length === 2) {
        // Two touch move - pinch zoom
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate zoom direction based on pinch gesture
        const delta = distance - startDistance;
        startDistance = distance;
        
        // Simulate wheel event for zoom
        const wheelEvent = new WheelEvent('wheel', {
          deltaY: -delta * 0.5  // Negative for zoom in, positive for zoom out
        });
        container.dispatchEvent(wheelEvent);
      }
    }
    
    function handleTouchEnd(event) {
      // End rotation or zoom
      if (event.touches.length === 0) {
        isDragging = false;
        
        // Simulate mouse up event for the original handler
        const mouseEvent = new MouseEvent('mouseup');
        container.dispatchEvent(mouseEvent);
      } else if (event.touches.length === 1) {
        // If we were pinch zooming and now have 1 finger, reset for rotation
        previousTouchX = event.touches[0].clientX;
        previousTouchY = event.touches[0].clientY;
        isDragging = true;
      }
    }
    
    // Add touch event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);
    
    console.log('Touch controls initialized for globe');
  });
})();
