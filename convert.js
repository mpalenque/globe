const fs = require('fs');

// Read the audience data - fix the path to include the 'globe' subdirectory
const audienceData = require('./globe/audience_geo_data_compact.json');

// Create the new structure
const formattedData = {};

audienceData.forEach(([company, data]) => {
  // Initialize the company object
  formattedData[company] = {};
  
  // Process data triplets
  for (let i = 0; i < data.length; i += 3) {
    // Convert lat, lon to string key
    const lat = data[i];
    const lon = data[i + 1];
    const value = data[i + 2];
    
    const key = `${lat},${lon}`;
    formattedData[company][key] = value;
  }
});

// Write to file - also save to the globe subdirectory
fs.writeFileSync(
  './globe/audience_transformed.json', 
  JSON.stringify(formattedData, null, 2)
);

console.log('Transformed audience data saved to globe/audience_transformed.json');