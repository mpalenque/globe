// Touch Controls for WebGL Globe
(() => {
  // Check if the device supports touch events
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Only apply touch controls if it's a touch device
  if (!isTouchDevice) return;
  
  // Wait for globe to be initialized
  window.addEventListener('load', () => {
    const container = document.getElementById('container');
    const globe = window.globe; // Access the globe object from the main script
    
    if (!globe || !container) return;
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchMoved = false;
    let lastDistance = 0;
    let rotationSpeed = 0.3;
    
    // Initialize touch variables for rotation
    let lon = 0;
    let lat = 0;
    let phi = 0;
    let theta = 0;
    
    // Touch start event
    container.addEventListener('touchstart', (event) => {
      event.preventDefault();
      
      touchMoved = false;
      
      if (event.touches.length === 1) {
        // Single touch - for rotation
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        
        // Store current rotation
        if (globe.rotation) {
          lon = globe.rotation.lon || 0;
          lat = globe.rotation.lat || 0;
        }
      } 
      else if (event.touches.length === 2) {
        // Two finger touch - for zoom
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        lastDistance = Math.sqrt(dx * dx + dy * dy);
      }
    }, { passive: false });
    
    // Touch move event
    container.addEventListener('touchmove', (event) => {
      event.preventDefault();
      touchMoved = true;
      
      if (event.touches.length === 1) {
        // Single touch - handle rotation
        const touchCurrentX = event.touches[0].clientX;
        const touchCurrentY = event.touches[0].clientY;
        
        // Calculate movement delta
        const deltaX = touchCurrentX - touchStartX;
        const deltaY = touchCurrentY - touchStartY;
        
        // Update rotation based on finger movement
        lon = (lon - deltaX * rotationSpeed) % 360;
        lat = Math.max(-85, Math.min(85, lat + deltaY * rotationSpeed));
        
        // Convert lat/lon to 3D rotation
        phi = THREE.MathUtils.degToRad(90 - lat);
        theta = THREE.MathUtils.degToRad(lon);
        
        // Update camera target position
        const radius = globe.camera.position.length();
        globe.camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
        globe.camera.position.y = radius * Math.cos(phi);
        globe.camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
        globe.camera.lookAt(globe.scene.position);
        
        // Store current position for next move
        touchStartX = touchCurrentX;
        touchStartY = touchCurrentY;
        
        // Store rotation for reference
        if (!globe.rotation) globe.rotation = {};
        globe.rotation.lon = lon;
        globe.rotation.lat = lat;
      } 
      else if (event.touches.length === 2) {
        // Handle pinch zoom
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate zoom factor based on pinch difference
        const zoomFactor = distance / lastDistance;
        
        // Apply zoom by adjusting camera position
        const currentDistance = globe.camera.position.length();
        const newDistance = Math.max(250, Math.min(600, currentDistance / zoomFactor));
        
        // Update camera position while maintaining direction
        const direction = globe.camera.position.clone().normalize();
        globe.camera.position.copy(direction.multiplyScalar(newDistance));
        
        // Update for next movement
        lastDistance = distance;
      }
    }, { passive: false });
    
    // Touch end event
    container.addEventListener('touchend', (event) => {
      if (!touchMoved && event.changedTouches.length === 1) {
        // Handle tap as click for selecting UI elements
        const touchX = event.changedTouches[0].clientX;
        const touchY = event.changedTouches[0].clientY;
        
        // Check if tap is on a company element
        const companies = document.querySelectorAll('.company');
        companies.forEach((company) => {
          const rect = company.getBoundingClientRect();
          if (touchX >= rect.left && touchX <= rect.right && 
              touchY >= rect.top && touchY <= rect.bottom) {
            company.click(); // Trigger the click event
          }
        });
        
        // Check if tap is on a year element
        const years = document.querySelectorAll('.year');
        years.forEach((year) => {
          const rect = year.getBoundingClientRect();
          if (touchX >= rect.left && touchX <= rect.right && 
              touchY >= rect.top && touchY <= rect.bottom) {
            year.click(); // Trigger the click event
          }
        });
        
        // Check control buttons
        const controlButtons = document.querySelectorAll('.control-button');
        controlButtons.forEach((button) => {
          const rect = button.getBoundingClientRect();
          if (touchX >= rect.left && touchX <= rect.right && 
              touchY >= rect.top && touchY <= rect.bottom) {
            button.click(); // Trigger the click event
          }
        });
      }
    }, { passive: false });
    
    // Prevent default touch behavior to avoid page scrolling while interacting with the globe
    document.addEventListener('touchmove', (event) => {
      if (event.target.closest('#container')) {
        event.preventDefault();
      }
    }, { passive: false });
    
    console.log('Touch controls enabled for globe visualization');
  });
})();