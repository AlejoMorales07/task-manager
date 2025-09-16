const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Remove white background from an image and make it transparent
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path for output image
 * @param {number} threshold - Tolerance for white color detection (0-255)
 * @returns {Promise<void>}
 */
async function removeWhiteBackground(inputPath, outputPath, threshold = 10) {
  try {
    console.log(`Processing: ${inputPath}`);
    
    // Read the input image
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Image dimensions: ${metadata.width}x${metadata.height}`);
    console.log(`Original format: ${metadata.format}`);
    
    // Get raw pixel data
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const { width, height, channels } = info;
    const pixelArray = new Uint8Array(data);
    
    // Create new buffer with alpha channel
    const newData = new Uint8Array(width * height * 4); // RGBA
    
    for (let i = 0; i < pixelArray.length; i += channels) {
      const pixelIndex = Math.floor(i / channels);
      const newIndex = pixelIndex * 4;
      
      const r = pixelArray[i];
      const g = pixelArray[i + 1];
      const b = pixelArray[i + 2];
      
      // Check if pixel is close to white
      const isWhite = r >= (255 - threshold) && 
                     g >= (255 - threshold) && 
                     b >= (255 - threshold);
      
      // Copy RGB values
      newData[newIndex] = r;     // R
      newData[newIndex + 1] = g; // G
      newData[newIndex + 2] = b; // B
      newData[newIndex + 3] = isWhite ? 0 : 255; // A (transparent if white)
    }
    
    // Create new image with transparent background
    await sharp(newData, {
      raw: {
        width: width,
        height: height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);
    
    console.log(`✅ Transparent image saved to: ${outputPath}`);
    
    // Get output file size
    const stats = fs.statSync(outputPath);
    console.log(`📊 Output file size: ${(stats.size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Error processing image:', error);
    throw error;
  }
}

/**
 * Process image1 specifically (as mentioned in requirements)
 */
async function processImage1() {
  const inputPath = './assets/images/image1.png';
  const outputPath = './assets/images/image1-transparent.png';
  
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input image not found: ${inputPath}`);
    return;
  }
  
  console.log('🎯 Processing image1 to remove white background...\n');
  
  await removeWhiteBackground(inputPath, outputPath, 10);
  
  console.log('\n📋 Summary:');
  console.log(`📥 Input: ${inputPath}`);
  console.log(`📤 Output: ${outputPath}`);
  console.log('✨ White background removed and made transparent');
  
  return outputPath;
}

/**
 * CLI functionality
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Default: process image1
    await processImage1();
  } else if (args.length >= 2) {
    // Custom input/output paths
    const inputPath = args[0];
    const outputPath = args[1];
    const threshold = args[2] ? parseInt(args[2]) : 10;
    
    await removeWhiteBackground(inputPath, outputPath, threshold);
  } else {
    console.log(`
Usage:
  node remove-white-background.js                           # Process image1.png
  node remove-white-background.js <input> <output> [threshold] # Process custom image
  
Examples:
  node remove-white-background.js
  node remove-white-background.js signature.png signature-transparent.png
  node remove-white-background.js signature.png signature-transparent.png 20
`);
  }
}

// Export for use as module
module.exports = {
  removeWhiteBackground,
  processImage1
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}