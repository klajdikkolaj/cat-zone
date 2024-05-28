import { Controller, Get, Query, Delete, Param } from '@nestjs/common';
import {FlickrService} from "./flicker.service";

@Controller('photos')
export class FlickrController {
    constructor(private readonly flickrService: FlickrService) {}
    @Get()
    async getPhotos(@Query('page') page: number = 1) {
        console.log('Entered getPhotos');
        const take = 10;
        const skip = (page - 1) * take;
        return this.flickrService.getPhotos({ skip, take });
    }

    @Get('tags')
    async getTags() {
        console.log('Entered getTags');
        return this.flickrService.getTags();
    }

    @Get('tagged/:tag')
    async getPhotosByTag(@Param('tag') tag: string, @Query('page') page: number = 1) {
        const take = 10;
        const skip = (page - 1) * take;
        return this.flickrService.getPhotosByTag(tag, { skip, take });
    }

    @Delete(':id')
    async deletePhoto(@Param('id') id: number) {
        return this.flickrService.deletePhoto(id);
    }
}
