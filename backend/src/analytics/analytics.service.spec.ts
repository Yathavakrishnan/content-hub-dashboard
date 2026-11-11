import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service.js';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: 'PostRepository', useValue: { find: async () => [] } },
        { provide: 'LikeRepository', useValue: { count: async () => 0 } },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
