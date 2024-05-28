import { Test, TestingModule } from '@nestjs/testing';
import { FlickerController } from './flicker.controller';

describe('CatController', () => {
  let controller: FlickerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlickerController],
    }).compile();

    controller = module.get<FlickerController>(FlickerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
