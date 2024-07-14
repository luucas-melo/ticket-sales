import { Module } from '@nestjs/common';
import { SpotsController } from './spots.controller';
import { SpotsService } from '@app/core';

@Module({
  controllers: [SpotsController],
  providers: [SpotsService],
})
export class SpotsModule {}
