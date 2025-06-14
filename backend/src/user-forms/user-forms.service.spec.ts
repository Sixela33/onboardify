import { Test, TestingModule } from '@nestjs/testing';
import { UserFormsService } from './user-forms.service';

describe('UserFormsService', () => {
  let service: UserFormsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFormsService],
    }).compile();

    service = module.get<UserFormsService>(UserFormsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
