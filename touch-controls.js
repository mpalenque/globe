/**
 * Touch controls for WebGL Globe
 * Enables touch-based rotation and zooming on mobile devices
 */

(function() {
  // Wait for DOM and globe to be available
  window.addEventListener('DOMContentLoaded', function() {
    // Give time for globe to initialize
    setTimeout(initTouchControls, 1000);
  });
  
  function initTouchControls() {
    if (!window.globe) return;
    
    const container = document.getElementById('container');
    const globe = window.globe;
    
    // Track touch state
    let touchStartX = 0;
    let touchStartY = 0;
    let touchMoveX = 0;
    let touchMoveY = 0;
    let isDragging = false;
    let lastDistance = 0;
    
    // Touch sensitivity settings
    const rotationSpeed = 0.005; 
    const zoomSensitivity = 0.01;
    const minZoom = 300;
    const maxZoom = 800;
    
    // Handle touch events
    container.addEventListener('touchstart', handleTouchStart, false);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, false);
    
    function handleTouchStart(event) {
      event.preventDefault();
      isDragging = true;
      
      // Single touch rotation
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      } 
      // Pinch zoom
      else if (event.touches.length === 2) {
        lastDistance = getTouchDistance(event);
      }
    }
    
    function handleTouchMove(event) {
      if (!isDragging) return;
      event.preventDefault();
      
      // Single touch rotation
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        touchMoveX = touch.clientX;
        touchMoveY = touch.clientY;
        
        // Calculate rotation delta
        const deltaX = touchMoveX - touchStartX;
        const deltaY = touchMoveY - touchStartY;
        
        // Apply rotation to the globe
        if (globe.rotation) {
          globe.rotation.y += deltaX * rotationSpeed;
          globe.rotation.x += deltaY * rotationSpeed;
        }
        
        // Update starting position for next move
        touchStartX = touchMoveX;
        touchStartY = touchMoveY;
      } 
      // Pinch zoom
      else if (event.touches.length === 2) {
        const currentDistance = getTouchDistance(event);
        const delta = currentDistance - lastDistance;
        
        // Apply zoom to the camera
        if (globe.camera) {
          const newDistance = globe.camera.position.z - delta * zoomSensitivity;
          globe.camera.position.z = Math.max(minZoom, Math.min(maxZoom, newDistance));
        }
        
        lastDistance = currentDistance;
      }
    }
    
    function handleTouchEnd() {
      isDragging = false;
    }
    
    function getTouchDistance(event) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
    
    console.log("Touch controls initialized for WebGL Globe");
  }
})();