import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
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
                        extras: 'tags',
                        format: 'json',
                        nojsoncallback: 1,
                        per_page: 500,
                    },
                }),
            );

            const photos = response.data.photos.photo.map((item) => ({
                publishedAt: new Date(),
                imageUrl: `https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`,
                tags: item.tags.split(' '),
            }));

            await this.prisma.photo.createMany({
                data: photos,
            });
        } catch (error) {
            this.logger.error('Error fetching or storing photos', error);
            throw new HttpException('Error fetching or storing photos', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getPhotos(params: { skip: number; take: number }) {
        try {
            const photos = await this.prisma.photo.findMany({
                skip: params.skip,
                take: params.take,
                orderBy: { publishedAt: 'desc' },
            });

            return photos.map(photo => ({
                ...photo,
                id: photo.id.toString(), // Convert BigInt to string
            }));
        } catch (error) {
            this.logger.error('Error fetching photos', error);
            throw new HttpException('Error fetching photos', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getTags() {
        try {
            const tags : any[] = await this.prisma.$queryRaw`
        SELECT UNNEST(tags) as tag, COUNT(*) as count
        FROM "Photo"
        WHERE 'cat' = ANY(tags)
        GROUP BY tag
        ORDER BY count DESC
        LIMIT 10;
      `;

            return tags.map(tag => ({
                tag: tag.tag,
                count: Number(tag.count), // Convert BigInt to number
            }));
        } catch (error) {
            this.logger.error('Error fetching tags', error);
            throw new HttpException('Error fetching tags', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getPhotosByTag(tag: string, params: { skip: number; take: number }) {
        try {
            const photos = await this.prisma.photo.findMany({
                where: {
                    tags: {
                        has: tag,
                    },
                },
                skip: params.skip,
                take: params.take,
                orderBy: { publishedAt: 'desc' },
            });

            return photos.map(photo => ({
                ...photo,
                id: photo.id.toString(), // Convert BigInt to string
            }));
        } catch (error) {
            this.logger.error('Error fetching photos by tag', error);
            throw new HttpException('Error fetching photos by tag', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deletePhoto(id: number) {
        try {
            const photo = await this.prisma.photo.delete({
                where: { id },
            });

            return {
                ...photo,
                id: photo.id.toString(), // Convert BigInt to string
            };
        } catch (error) {
            this.logger.error('Error deleting photo', error);
            throw new HttpException('Error deleting photo', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
