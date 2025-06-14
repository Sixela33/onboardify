import { Test, TestingModule } from '@nestjs/testing';
import { UserFormsController } from './user-forms.controller';
import { UserFormsService } from './user-forms.service';

describe('UserFormsController', () => {
  let controller: UserFormsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFormsController],
      providers: [UserFormsService],
    }).compile();

    controller = module.get<UserFormsController>(UserFormsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
