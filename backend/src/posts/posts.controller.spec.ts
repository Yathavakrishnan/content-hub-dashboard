import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller.js';
import { PostsService } from './posts.service.js';

describe('PostsController', () => {
  let controller: PostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            findAll: async () => [],
            create: async () => ({ id: 1, title: 'Post' }),
            update: async () => ({ id: 1, title: 'Updated Post' }),
            remove: async () => ({ id: 1, title: 'Removed Post' }),
            like: async () => ({ postId: 1, likes: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
