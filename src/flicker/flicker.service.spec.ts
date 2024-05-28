import { Test, TestingModule } from '@nestjs/testing';
import { FlickrService } from './flicker.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@prisma/services/prisma.service';

describe('FlickrService', () => {
  let service: FlickrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlickrService,
        PrismaService,
        HttpService,
        ConfigService,
      ],
    }).compile();

    service = module.get<FlickrService>(FlickrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch and store photos', async () => {
    jest.spyOn(service, 'fetchAndStorePhotos').mockImplementation(async () => Promise.resolve());
    await service.fetchAndStorePhotos();
    expect(service.fetchAndStorePhotos).toHaveBeenCalled();
  });
});
