/**
 * Helper utility to manage company colors for the WebGL Globe
 */

const CompanyColors = {
  // Default color palette
  defaultPalette: {
    'blue': '#1565C0',
    'red': '#C62828',
    'green': '#2E7D32',
    'purple': '#6A1B9A',
    'orange': '#E65100',
    'teal': '#00695C',
    'pink': '#AD1457',
    'brown': '#4E342E',
    'yellow': '#F9A825',
    'gray': '#455A64'
  },
  
  // Generate a color for a company based on its name
  getColorForCompany: function(companyName, customPalette = {}) {
    if (!companyName) return '#1565C0'; // Default blue
    
    const palette = Object.assign({}, this.defaultPalette, customPalette);
    
    // If company name contains certain words, use those colors
    const colorWords = Object.keys(palette);
    for (const word of colorWords) {
      if (companyName.toLowerCase().includes(word)) {
        return palette[word];
      }
    }
    
    // Otherwise, use a hash of the company name to select a color
    const hash = this.hashString(companyName);
    const paletteColors = Object.values(palette);
    const colorIndex = hash % paletteColors.length;
    return paletteColors[colorIndex];
  },
  
  // Simple hash function for strings
  hashString: function(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  },
  
  // Generate a color map for a list of companies
  generateColorMap: function(companies, customPalette = {}) {
    const colorMap = {};
    companies.forEach(company => {
      colorMap[company] = this.getColorForCompany(company, customPalette);
    });
    return colorMap;
  },
  
  // Apply company colors to an existing globe
  applyColorsToGlobe: function(globe, pointToCompanyMap, companyColors) {
    if (!globe || !globe.applyColors) {
      console.error("Invalid globe object");
      return false;
    }
    
    return globe.applyColors(pointToCompanyMap, companyColors);
  }
};

// Make it available globally
window.CompanyColors = CompanyColors;
