import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FlickrService } from './flicker.service';

@Injectable()
export class FlickrScheduler {
    private readonly logger = new Logger(FlickrScheduler.name);

    constructor(private readonly flickrService: FlickrService) {}

    @Cron('0 * * * *')
    async handleCron() {
        this.logger.debug('Called every hour to fetch new cat photos');
        await this.flickrService.fetchAndStorePhotos();
    }
}
