import { PostsService } from './posts.service.js';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: 'PostRepository', useValue: { find: async () => [], count: async () => 0 } },
        { provide: 'LikeRepository', useValue: { count: async () => 0, findOne: async () => null, create: (value: any) => value, save: async (value: any) => value, delete: async () => undefined } },
        { provide: 'UserRepository', useValue: { findOne: async () => ({ id: 1, name: 'Test User' }) } },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
