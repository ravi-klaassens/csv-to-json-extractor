const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create a blue rounded rectangle favicon
async function generateFavicon() {
  try {
    // Create a blue square with rounded corners
    await sharp({
      create: {
        width: 32,
        height: 32,
        channels: 4,
        background: { r: 59, g: 130, b: 246, alpha: 1 } // #3B82F6 (blue)
      }
    })
      .composite([
        {
          input: Buffer.from(
            `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#3B82F6"/>
            </svg>`
          ),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toFile(path.join(__dirname, '../public/favicon.png'));
    
    console.log('Favicon generated successfully!');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon(); 