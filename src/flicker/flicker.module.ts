// src/flickr/flickr.module.ts
import { Module,  } from '@nestjs/common';
import { FlickrService } from './flicker.service';
import { PrismaService } from '@prisma/services/prisma.service';
import { HttpModule } from '@nestjs/axios';
import {FlickrController} from "./flicker.controller";
import {FlickrScheduler} from "./flicker.scheduler";
@Module({
  imports: [HttpModule],
  providers: [FlickrService, PrismaService, PrismaService, FlickrScheduler],
  controllers: [FlickrController],
  exports: [FlickrService],
})
export class FlickrModule {
  constructor() {
}
}
