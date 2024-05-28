import {Controller, Delete, Get, Param, Query} from '@nestjs/common';
import {PrismaService} from '../prisma/services/prisma.service';
import {Prisma} from "@common/generated/client";
import SortOrder = Prisma.SortOrder;

@Controller('photos')
export class PhotosController {
    constructor(private readonly prisma: PrismaService) {}

    @Get()
    async getPhotos(@Query('page') page: number = 1) {
        const take = 10;
        const skip = (page - 1) * take;
        const photos = await this.prisma.photo.findMany({
            skip,
            take,
            orderBy:{
                publishedAt: SortOrder.desc
            }
        });
        return photos;
    }

    @Get('tags')
    async getTags() {
        const tags = await this.prisma.$queryRaw`
      SELECT UNNEST(tags) as tag, COUNT(*) as count
      FROM "Photo"
      GROUP BY tag
      ORDER BY count DESC
      LIMIT 10;
    `;
        return tags;
    }

    @Get('tagged/:tag')
    async getPhotosByTag(@Param('tag') tag: string, @Query('page') page: number = 1) {
        const take = 10;
        const skip = (page - 1) * take;
        return this.prisma.photo.findMany({
            where: {
                tags: {
                    has: tag,
                },
            },
            skip,
            take,
            orderBy: {
                publishedAt: SortOrder.desc
            }
        });
    }

    @Delete(':id')
    async deletePhoto(@Param('id') id: number) {
        await this.prisma.photo.delete({
            where: { id },
        });
    }
}
