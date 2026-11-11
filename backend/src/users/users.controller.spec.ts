import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: async () => [],
            findOne: async () => ({ id: 1, name: 'Test User' }),
            create: async () => ({ id: 1, name: 'Test User' }),
            update: async () => ({ id: 1, name: 'Updated User' }),
            remove: async () => ({ id: 1, name: 'Removed User' }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
