import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: async (payload: any) => ({
              id: 1,
              name: payload.name,
              email: payload.email,
            }),
            login: async (payload: any) => ({
              access_token: `mock-token-${payload.email}`,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should register a new user without exposing the plain-text password', async () => {
    const payload = {
      name: 'John',
      email: 'john@gmail.com',
      password: 'Password123',
    };

    const result = await controller.register(payload);

    expect(result).toMatchObject({
      name: 'John',
      email: 'john@gmail.com',
    });
    expect(result).not.toHaveProperty('password');
  });

  it('should login a user and return an access token', async () => {
    const result = await controller.login({
      email: 'john@gmail.com',
      password: 'Password123',
    });

    expect(result).toHaveProperty('access_token');
    expect(typeof result.access_token).toBe('string');
  });
});
