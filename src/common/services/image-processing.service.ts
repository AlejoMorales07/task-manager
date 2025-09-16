import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface ImageProcessingResult {
  success: boolean;
  inputPath: string;
  outputPath: string;
  originalSize: number;
  processedSize: number;
  dimensions: {
    width: number;
    height: number;
  };
  message: string;
}

@Injectable()
export class ImageProcessingService {
  private readonly assetsPath = join(process.cwd(), 'assets', 'images');

  /**
   * Remove white background from image and make it transparent
   * @param inputPath Path to input image file
   * @param outputPath Path for output image file  
   * @param threshold Tolerance for white color detection (0-255), default 10
   * @returns Promise<ImageProcessingResult>
   */
  async removeWhiteBackground(
    inputPath: string, 
    outputPath: string, 
    threshold: number = 10
  ): Promise<ImageProcessingResult> {
    try {
      // Validate input file exists
      await fs.access(inputPath);
      
      const originalStats = await fs.stat(inputPath);
      
      // Read the input image
      const image = sharp(inputPath);
      const metadata = await image.metadata();
      
      // Get raw pixel data
      const { data, info } = await image
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      const { width, height, channels } = info;
      const pixelArray = new Uint8Array(data);
      
      // Create new buffer with alpha channel
      const newData = new Uint8Array(width * height * 4); // RGBA
      
      let transparentPixels = 0;
      
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
        
        if (isWhite) transparentPixels++;
        
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
      
      const processedStats = await fs.stat(outputPath);
      
      const transparencyPercentage = ((transparentPixels / (width * height)) * 100).toFixed(1);
      
      return {
        success: true,
        inputPath,
        outputPath,
        originalSize: originalStats.size,
        processedSize: processedStats.size,
        dimensions: { width, height },
        message: `Successfully processed image. Made ${transparencyPercentage}% of pixels transparent.`
      };
      
    } catch (error: any) {
      return {
        success: false,
        inputPath,
        outputPath,
        originalSize: 0,
        processedSize: 0,
        dimensions: { width: 0, height: 0 },
        message: `Error processing image: ${error?.message || 'Unknown error'}`
      };
    }
  }

  /**
   * Process the default image1 file
   * @param threshold Tolerance for white color detection
   * @returns Promise<ImageProcessingResult>
   */
  async processImage1(threshold: number = 10): Promise<ImageProcessingResult> {
    const inputPath = join(this.assetsPath, 'image1.png');
    const outputPath = join(this.assetsPath, 'image1-transparent.png');
    
    return this.removeWhiteBackground(inputPath, outputPath, threshold);
  }

  /**
   * Get information about available images in assets folder
   * @returns Promise<string[]> Array of image filenames
   */
  async getAvailableImages(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.assetsPath);
      return files.filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file));
    } catch (error) {
      return [];
    }
  }
}