const fs = require('fs');

// Load the original data
const rawData = fs.readFileSync('./aggregated_audience_data_by_country.json', 'utf8');
let data;
try {
  // First try to parse the file normally
  data = JSON.parse(rawData);
  console.log("Successfully parsed the JSON");
} catch (e) {
  console.log("Initial parsing failed, attempting to fix JSON format");
  try {
    // If direct parsing fails, try to fix common JSON issues
    let fixedData = rawData.trim();
    // Check if it starts with the field name without proper JSON object wrapper
    if (fixedData.startsWith('"aggregated_audience_data_by_country":')) {
      fixedData = `{${fixedData}}`;
    } else if (fixedData.startsWith('aggregated_audience_data_by_country')) {
      fixedData = `{"${fixedData}}`;
    }
    data = JSON.parse(fixedData);
    console.log("Successfully parsed the JSON after fixing format");
  } catch (e2) {
    console.error("Error parsing JSON:", e2);
    process.exit(1);
  }
}

// Add this mapping for country names to ISO codes
const countryNameToCode = {
  "Algeria": "DZ",
  "Argentina": "AR",
  "Australia": "AU",
  "Austria": "AT",
  "Bangladesh": "BD",
  "Belarus": "BY",
  "Belgium": "BE",
  "Bolivia": "BO",
  "Brazil": "BR",
  "Bulgaria": "BG",
  "Canada": "CA",
  "Chile": "CL",
  "China": "CN",
  "Colombia": "CO",
  "Costa Rica": "CR",
  "Czech Republic": "CZ",
  "Denmark": "DK",
  "Dominican Republic": "DO",
  "Ecuador": "EC",
  "Egypt": "EG",
  "Finland": "FI",
  "France": "FR",
  "Germany": "DE",
  "Greece": "GR",
  "Guatemala": "GT",
  "Hong Kong": "HK",
  "Hungary": "HU",
  "India": "IN",
  "Indonesia": "ID",
  "Ireland": "IE",
  "Israel": "IL",
  "Italy": "IT",
  "Japan": "JP",
  "Jordan": "JO",
  "Kenya": "KE",
  "Malaysia": "MY",
  "Mexico": "MX",
  "Morocco": "MA",
  "Netherlands": "NL",
  "New Zealand": "NZ",
  "Nigeria": "NG",
  "Norway": "NO",
  "Pakistan": "PK",
  "Paraguay": "PY",
  "Peru": "PE",
  "Philippines": "PH",
  "Poland": "PL",
  "Portugal": "PT",
  "Romania": "RO",
  "Russia": "RU",
  "Saudi Arabia": "SA",
  "Singapore": "SG",
  "South Africa": "ZA",
  "South Korea": "KR",
  "Spain": "ES",
  "Sweden": "SE",
  "Switzerland": "CH",
  "Taiwan": "TW",
  "Thailand": "TH",
  "Turkey": "TR",
  "UAE": "AE",
  "Ukraine": "UA",
  "United Kingdom": "GB",
  "United States": "US",
  "Uruguay": "UY",
  "Venezuela": "VE",
  "Vietnam": "VN"
};

// Country code to coordinates mapping (country centers)
const countryCoordinates = {
  "DZ": [28.0339, 1.6596],
  "AR": [-38.4161, -63.6167],
  "AU": [-25.2744, 133.7751],
  "AT": [47.5162, 14.5501],
  "BD": [23.685, 90.3563],
  "BY": [53.7098, 27.9534],
  "BE": [50.8503, 4.3517],
  "BO": [-16.2902, -63.5887],
  "BR": [-14.235, -51.9253],
  "BG": [42.7339, 25.4858],
  "CA": [56.1304, -106.3468],
  "CL": [-35.6751, -71.5430],
  "CN": [35.8617, 104.1954],
  "CO": [4.5709, -74.2973],
  "CR": [9.7489, -83.7534],
  "CZ": [49.8175, 15.4730],
  "DK": [56.2639, 9.5018],
  "DO": [18.7357, -70.1627],
  "EC": [-1.8312, -78.1834],
  "EG": [26.8206, 30.8025],
  "FI": [61.9241, 25.7482],
  "FR": [46.2276, 2.2137],
  "DE": [51.1657, 10.4515],
  "GR": [39.0742, 21.8243],
  "GT": [15.7835, -90.2308],
  "HK": [22.3193, 114.1694],
  "HU": [47.1625, 19.5033],
  "IN": [20.5937, 78.9629],
  "ID": [-0.7893, 113.9213],
  "IE": [53.1424, -7.6921],
  "IL": [31.0461, 34.8516],
  "IT": [41.8719, 12.5674],
  "JP": [36.2048, 138.2529],
  "JO": [30.5852, 36.2384],
  "KE": [-0.0236, 37.9062],
  "MY": [4.2105, 101.9758],
  "MX": [23.6345, -102.5528],
  "MA": [31.7917, -7.0926],
  "NL": [52.1326, 5.2913],
  "NZ": [-40.9006, 174.8860],
  "NG": [9.0820, 8.6753],
  "NO": [60.4720, 8.4689],
  "PK": [30.3753, 69.3451],
  "PY": [-23.4425, -58.4438],
  "PE": [-9.1900, -75.0152],
  "PH": [12.8797, 121.7740],
  "PL": [51.9194, 19.1451],
  "PT": [39.3999, -8.2245],
  "RO": [45.9432, 24.9668],
  "RU": [61.5240, 105.3188],
  "SA": [23.8859, 45.0792],
  "SG": [1.3521, 103.8198],
  "ZA": [-30.5595, 22.9375],
  "KR": [35.9078, 127.7669],
  "ES": [40.4637, -3.7492],
  "SE": [60.1282, 18.6435],
  "CH": [46.8182, 8.2275],
  "TW": [23.6978, 120.9605],
  "TH": [15.8700, 100.9925],
  "TR": [38.9637, 35.2433],
  "AE": [23.4241, 53.8478],
  "UA": [48.3794, 31.1656],
  "GB": [55.3781, -3.4360],
  "US": [37.0902, -95.7129],
  "UY": [-32.5228, -55.7658],
  "VE": [6.4238, -66.5897],
  "VN": [14.0583, 108.2772]
};

// Transform function that matches population909500.json format
function transformData() {
  // Log the data structure to debug
  console.log("Available keys in data:", Object.keys(data));
  
  // Find the audience data regardless of the exact key name
  let audienceData;
  if (data.aggregated_audience_data_by_country) {
    audienceData = data.aggregated_audience_data_by_country;
    console.log("Found data under 'aggregated_audience_data_by_country' key");
  } else if (data.aggregated_audience_data_by_cou) {
    audienceData = data.aggregated_audience_data_by_cou;
    console.log("Found data under 'aggregated_audience_data_by_cou' key");
  } else if (Array.isArray(data)) {
    audienceData = data;
    console.log("Data is directly an array");
  } else {
    // Look for any array in the data object
    for (const key in data) {
      if (Array.isArray(data[key])) {
        audienceData = data[key];
        console.log(`Found array data under '${key}' key`);
        break;
      }
    }
  }
  
  if (!audienceData || !Array.isArray(audienceData)) {
    console.error("audienceData is not an array:", typeof audienceData);
    console.error("Available data structure:", JSON.stringify(data).substring(0, 200) + "...");
    throw new Error("Invalid data structure - couldn't find audience data array");
  }
  
  console.log(`Found ${audienceData.length} audience data entries`);
  
  // Debug the first few entries to understand the structure
  console.log("Sample data (first entry):", JSON.stringify(audienceData[0], null, 2));
  
  const companiesMap = {};
  let skippedEntries = 0;
  let processedEntries = 0;
  
  audienceData.forEach(entry => {
    if (!entry || !entry.parent_company) {
      skippedEntries++;
      return; // Skip entries without parent company
    }
    
    const company = entry.parent_company;
    if (!companiesMap[company]) {
      companiesMap[company] = [];
    }
    
    // Get country code either directly or from country_name to code mapping
    let countryCode = entry.country;
    
    // If we don't have coordinates for that code and we have a country_name
    if (!countryCoordinates[countryCode] && entry.country_name) {
      // Try to find it in our mapping
      countryCode = countryNameToCode[entry.country_name];
    }
    
    // Only proceed if we have coordinates for this country
    if (countryCoordinates[countryCode]) {
      const [latitude, longitude] = countryCoordinates[countryCode];
      
      // Make sure deduplicated_audience exists and is numeric
      if (entry.deduplicated_audience !== undefined && 
          !isNaN(Number(entry.deduplicated_audience)) && 
          Number(entry.deduplicated_audience) > 0) {
        
        const audienceValue = Number(entry.deduplicated_audience)/1000000; // Scale down for visualization
        
        // Add the points in the flattened format [lat, lon, value, lat, lon, value, ...]
        companiesMap[company].push(latitude, longitude, audienceValue);
        processedEntries++;
      } else {
        console.log(`Skipping entry with invalid audience data: ${company}, ${countryCode}`);
      }
    } else {
      console.log(`No coordinates found for country code: ${countryCode}, country name: ${entry.country_name}`);
      skippedEntries++;
    }
  });
  
  console.log(`Processed ${processedEntries} entries, skipped ${skippedEntries} entries`);
  
  // Convert to the final format like ["Brainly", [lat, lon, value, lat, lon, value, ...]]
  return Object.entries(companiesMap).map(([company, points]) => {
    return [company, points];
  });
}

// ...existing code...

// Replace the formatting part with this updated version
try {
  const transformedData = transformData();
  console.log(`Generated data for ${transformedData.length} companies`);
  
  // Crear formato compacto sin espacios ni saltos de línea
  const formattedJson = transformedData.map(([company, points]) => {
    // Format company element with proper quotes
    const companyElement = `"${company}"`;
    
    // Format the coordinates as a flat array without any spaces or newlines
    let pointsArray = '[';
    
    for (let i = 0; i < points.length; i += 3) {
      const lat = points[i];
      const lon = points[i+1];
      const value = points[i+2];
      
      // Add coordinate set (lat, lon, value) with fixed precision
      pointsArray += `${lat.toFixed(4)},${lon.toFixed(4)},${value.toFixed(4)}`;
      
      // Add comma if not the last triplet
      if (i + 3 < points.length) {
        pointsArray += ',';
      }
    }
    
    // Close the points array
    pointsArray += ']';
    
    // Return the company with its points array with no spaces
    return `[${companyElement},${pointsArray}]`;
  }).join(',');
  
  // Create a compact JSON array with no spaces or line breaks
  const finalJson = '[' + formattedJson + ']';
  
  // Write the compact output to a file
  fs.writeFileSync('./globe/audience_geo_data.json', finalJson);
  console.log('Data transformation completed. Created audience_geo_data.json');
} catch (error) {
  console.error("Error during transformation:", error);
}