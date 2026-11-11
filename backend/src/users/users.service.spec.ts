import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let service: UsersService;
  let users: any[];

  beforeEach(async () => {
    users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: { name: 'user' } },
      { id: 2, name: 'Jane Admin', email: 'jane@example.com', role: { name: 'admin' } },
    ];

    const createQueryBuilder = () => {
      let searchTerm = '';
      let roleFilter = '';

      const qb = {
        leftJoinAndSelect: () => qb,
        andWhere: (condition: string, params?: any) => {
          if (params?.search) {
            searchTerm = String(params.search).replace(/%/g, '').toLowerCase();
          }
          if (params?.role) {
            roleFilter = String(params.role).toLowerCase();
          }
          return qb;
        },
        getMany: async () => {
          let result = [...users];

          if (searchTerm) {
            result = result.filter((user) =>
              user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm),
            );
          }

          if (roleFilter) {
            result = result.filter((user) => user.role?.name?.toLowerCase() === roleFilter);
          }

          return result;
        },
      };

      return qb;
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useValue: {
            createQueryBuilder,
            findOne: async ({ where }: any) => users.find((user) => user.id === where.id) ?? null,
            create: (value: any) => ({ ...value, id: users.length + 1 }),
            save: async (value: any) => {
              const existingIndex = users.findIndex((user) => user.id === value.id);
              if (existingIndex >= 0) {
                users[existingIndex] = value;
              } else {
                users.push(value);
              }
              return value;
            },
            remove: async (value: any) => {
              const index = users.findIndex((user) => user.id === value.id);
              if (index >= 0) users.splice(index, 1);
              return value;
            },
          },
        },
        {
          provide: 'RoleRepository',
          useValue: {
            findOne: async ({ where }: any) => ({ id: 1, name: where.name }),
            create: (value: any) => ({ ...value, id: 1 }),
            save: async (value: any) => value,
          },
        },
        {
          provide: 'PostRepository',
          useValue: {
            find: async () => [],
            delete: async () => undefined,
          },
        },
        {
          provide: 'LikeRepository',
          useValue: {
            delete: async () => undefined,
            createQueryBuilder: () => ({ delete: () => ({ where: () => ({ execute: async () => undefined }) }) }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should search and filter users by name and role', async () => {
    const results = await service.findAll('john', 'user');

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ name: 'John Doe' });
  });

  it('should remove a user by id', async () => {
    const removed = await service.remove(1);

    expect(removed).toBeTruthy();
    expect((await service.findAll())).toHaveLength(1);
    expect((await service.findAll())[0]).toMatchObject({ name: 'Jane Admin' });
  });
});
