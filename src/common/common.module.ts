import { Module } from '@nestjs/common';
import { ImageProcessingService } from './services/image-processing.service';
import { ImageProcessingController } from './controllers/image-processing.controller';

@Module({
  providers: [ImageProcessingService],
  controllers: [ImageProcessingController],
  exports: [ImageProcessingService]
})
export class CommonModule {}