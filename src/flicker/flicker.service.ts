import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/services';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FlickrService {
    private readonly apiKey: string;
    private readonly apiSecret: string;
    private readonly logger = new Logger(FlickrService.name);

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        private httpService: HttpService,
    ) {
        this.apiKey = this.configService.get<string>('FLICKR_API_KEY');
        this.apiSecret = this.configService.get<string>('FLICKR_API_SECRET');
    }

    async fetchAndStorePhotos() {
        try {
            const response = await firstValueFrom(
                this.httpService.get('https://www.flickr.com/services/rest/', {
                    params: {
                        method: 'flickr.photos.search',
                        api_key: this.apiKey,
                        tags: 'cat',
                        format: 'json',
                        nojsoncallback: 1,
                        per_page: 500,
                    },
                }),
            );


            const photos = response.data.photos.photo.map((item) => ({
                publishedAt: new Date(),
                imageUrl: `https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`,
                tags: ['cat'],
            }));

            await this.prisma.photo.createMany({
                data: photos,
            });
        } catch (error) {
            this.logger.error('Error fetching or storing photos', error);
            throw error;
        }
    }

    async getPhotos(params: { skip: number; take: number }) {
        const photos = await this.prisma.photo.findMany({
            skip: params.skip,
            take: params.take,
            orderBy: { publishedAt: 'desc' },
        });
        return photos.map(photo => ({
            ...photo,
            id: photo.id.toString(), // Convert BigInt to string
        }));
    }

    async getTags() {
        const tags:any[] = await this.prisma.$queryRaw`
      SELECT UNNEST(tags) as tag, COUNT(*) as count
      FROM "Photo"
      GROUP BY tag
      ORDER BY count DESC
      LIMIT 10;
    `;
        return tags.map(tag => ({
            tag: tag.tag,
            count: Number(tag.count), // Convert BigInt to number
        }));
    }

    async getPhotosByTag(tag: string, params: { skip: number; take: number }) {
        return this.prisma.photo.findMany({
            where: {
                tags: {
                    has: tag,
                },
            },
            skip: params.skip,
            take: params.take,
            orderBy: { publishedAt: 'desc' },
        });
    }

    async deletePhoto(id: number) {
        return this.prisma.photo.delete({
            where: { id },
        });
    }
}
