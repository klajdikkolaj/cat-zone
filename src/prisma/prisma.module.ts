import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './services/'

@Module({
    imports: [ConfigModule], // Import ConfigModule if you use it in PrismaService
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}
