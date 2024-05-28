import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma/prisma.module';
import { FlickrModule } from './flicker/flicker.module';
import {FlickrService} from "./flicker/flicker.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    PrismaModule,
    FlickrModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private flickrService: FlickrService) {console.log('AppModule initialized');}

  async onModuleInit() {
    await this.flickrService.fetchAndStorePhotos();
  }
}
