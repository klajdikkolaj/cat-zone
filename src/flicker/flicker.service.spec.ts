import { Test, TestingModule } from '@nestjs/testing';
import { FlickerService } from './flicker.service';

describe('CatService', () => {
  let service: FlickerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlickerService],
    }).compile();

    service = module.get<FlickerService>(FlickerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
