// src/flickr/flickr.module.ts
import { Module,  } from '@nestjs/common';
import { FlickrService } from './flicker.service';
import { PrismaService } from '@prisma/services/prisma.service';
import { HttpModule } from '@nestjs/axios';
import {FlickrController} from "./flicker.controller";
@Module({
  imports: [HttpModule],
  providers: [FlickrService, PrismaService, PrismaService],
  controllers: [FlickrController],
  exports: [FlickrService],
})
export class FlickrModule {
  constructor() {
}
}
