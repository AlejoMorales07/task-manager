import { Controller, Post, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ImageProcessingService, ImageProcessingResult } from '../services/image-processing.service';

@ApiTags('image-processing')
@Controller('images')
export class ImageProcessingController {
  constructor(private readonly imageProcessingService: ImageProcessingService) {}

  @Post('process-image1')
  @ApiOperation({ 
    summary: 'Process image1 to remove white background',
    description: 'Removes white background from image1.png and creates transparent version'
  })
  @ApiQuery({ 
    name: 'threshold', 
    required: false, 
    description: 'Tolerance for white color detection (0-255)', 
    example: 10 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Image processed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        inputPath: { type: 'string' },
        outputPath: { type: 'string' },
        originalSize: { type: 'number' },
        processedSize: { type: 'number' },
        dimensions: {
          type: 'object',
          properties: {
            width: { type: 'number' },
            height: { type: 'number' }
          }
        },
        message: { type: 'string' }
      }
    }
  })
  async processImage1(@Query('threshold') threshold?: number): Promise<ImageProcessingResult> {
    try {
      const processThreshold = threshold ? parseInt(threshold.toString()) : 10;
      
      if (processThreshold < 0 || processThreshold > 255) {
        throw new HttpException('Threshold must be between 0 and 255', HttpStatus.BAD_REQUEST);
      }
      
      const result = await this.imageProcessingService.processImage1(processThreshold);
      
      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      return result;
      
    } catch (error: any) {
      throw new HttpException(
        `Failed to process image: ${error?.message || 'Unknown error'}`, 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('available')
  @ApiOperation({ 
    summary: 'List available images',
    description: 'Get list of available images in the assets folder'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of available images',
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string' }
        },
        count: { type: 'number' }
      }
    }
  })
  async getAvailableImages(): Promise<{ images: string[], count: number }> {
    const images = await this.imageProcessingService.getAvailableImages();
    return {
      images,
      count: images.length
    };
  }
}