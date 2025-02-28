const fs = require('fs');
const path = require('path');

// Read the original JSON file
const filePath = path.join(__dirname, 'audience_geo_data_compact.json');

try {
    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Process each company's data
    const formattedData = data.map(companyEntry => {
        const companyName = companyEntry[0];
        const values = companyEntry[1].map(value => {
            if (typeof value === 'number') {
                if (Number.isInteger(value)) {
                    // For integers, just keep them as is
                    return value;
                } else {
                    // For decimals, round to 3 decimal places
                    return Number(value.toFixed(3));
                }
            }
            return value;
        });
        
        return [companyName, values];
    });
    
    // Write the formatted data back to the original file
    fs.writeFileSync(filePath, JSON.stringify(formattedData));
    console.log("File has been converted successfully.");
    
} catch (error) {
    console.error('Error processing file:', error);
}