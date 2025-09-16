const sharp = require('sharp');
const fs = require('fs');

// Create a simple signature-like image with white background
async function createSampleSignature() {
  try {
    // Create a white background (300x150)
    const width = 300;
    const height = 150;
    
    // Create SVG signature
    const signatureSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- White background -->
        <rect width="100%" height="100%" fill="white"/>
        
        <!-- Sample signature in black -->
        <g stroke="black" stroke-width="3" fill="none">
          <!-- Letter A-like shape -->
          <path d="M 50 120 L 80 50 L 110 120 M 65 90 L 95 90"/>
          
          <!-- Letter M-like shape -->
          <path d="M 130 120 L 130 50 L 150 80 L 170 50 L 170 120"/>
          
          <!-- Underline -->
          <path d="M 40 130 L 180 130"/>
          
          <!-- Small decorative curve -->
          <path d="M 190 80 Q 210 60 230 80 Q 250 100 230 120"/>
        </g>
      </svg>
    `;

    // Convert SVG to PNG with white background
    await sharp(Buffer.from(signatureSvg))
      .png()
      .toFile('./assets/images/image1.png');
    
    console.log('Sample signature created successfully at ./assets/images/image1.png');
    
    // Also create info about the image
    const info = {
      description: 'Sample signature with white background for testing transparent background removal',
      dimensions: `${width}x${height}`,
      format: 'PNG',
      background: 'white',
      signature_color: 'black',
      created: new Date().toISOString()
    };
    
    fs.writeFileSync('./assets/images/image1-info.json', JSON.stringify(info, null, 2));
    console.log('Image info saved to ./assets/images/image1-info.json');
    
  } catch (error) {
    console.error('Error creating sample signature:', error);
  }
}

createSampleSignature();