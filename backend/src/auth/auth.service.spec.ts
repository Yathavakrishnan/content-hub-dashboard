import { Test, TestingModule } from '@nestjs/testing';
import { createHash, timingSafeEqual } from 'node:crypto';
import { AuthService } from './auth.service.js';
import { Role } from '../entities/role.entity.js';
import { User } from '../entities/user.entity.js';

const hashPassword = (password: string) =>
  createHash('sha256').update(password).digest('hex');

const verifyPassword = (password: string, storedHash: string) => {
  const hashedInput = hashPassword(password);
  return timingSafeEqual(Buffer.from(hashedInput), Buffer.from(storedHash));
};

describe('AuthService', () => {
  let service: AuthService;
  let users: User[];

  beforeEach(async () => {
    users = [];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'UserRepository',
          useValue: {
            findOne: async ({ where }: any) => users.find((user) => user.email === where.email) ?? null,
            create: (user: Partial<User>) => ({ ...user, id: users.length + 1 }),
            save: async (user: Partial<User>) => {
              const existing = users.findIndex((item) => item.email === user.email);
              if (existing >= 0) {
                users[existing] = { ...users[existing], ...user } as User;
                return users[existing];
              }
              users.push(user as User);
              return user as User;
            },
          },
        },
        {
          provide: 'RoleRepository',
          useValue: {
            findOne: async ({ where }: any) => {
              if (where.name === 'user') {
                return { id: 1, name: 'user' } as Role;
              }
              return null;
            },
            create: (role: Partial<Role>) => ({ ...role, id: 1 }),
            save: async (role: Partial<Role>) => role as Role,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should hash passwords and omit the plain text from the returned payload', async () => {
    const result = await service.register({
      name: 'John',
      email: 'john@gmail.com',
      password: 'Password123',
    });

    expect(result).toMatchObject({
      name: 'John',
      email: 'john@gmail.com',
    });
    expect(result).not.toHaveProperty('password');

    const storedUser = users[0];
    expect(storedUser).toBeDefined();
    expect(storedUser.password).not.toBe('Password123');
    expect(verifyPassword('Password123', storedUser.password)).toBe(true);
  });

  it('should validate user credentials and return a signed jwt token', async () => {
    await service.register({
      name: 'John',
      email: 'john@gmail.com',
      password: 'Password123',
    });

    const result = await service.login({
      email: 'john@gmail.com',
      password: 'Password123',
    });

    expect(result).toHaveProperty('access_token');
    expect(typeof result.access_token).toBe('string');
    expect(result.access_token.length).toBeGreaterThan(20);
  });
});
