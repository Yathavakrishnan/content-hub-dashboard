import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import jwt from 'jsonwebtoken';
import { createHash, timingSafeEqual } from 'node:crypto';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity.js';
import { User } from '../entities/user.entity.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';

type LoginDto = {
  email: string;
  password: string;
};

const hashPassword = (password: string) =>
  createHash('sha256').update(password).digest('hex');

const verifyPassword = (password: string, storedHash: string) => {
  const hash = hashPassword(password);
  return timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createAuthDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    let role = await this.roleRepository.findOne({ where: { name: 'user' } });

    if (!role) {
      role = this.roleRepository.create({ name: 'user' });
      await this.roleRepository.save(role);
    }

    const passwordHash = hashPassword(createAuthDto.password);

    const user = this.userRepository.create({
      name: createAuthDto.name,
      email: createAuthDto.email,
      password: passwordHash,
      role_id: role.id,
      role,
    });

    const savedUser = await this.userRepository.save(user);

    const { password: _password, ...safeUser } = savedUser;
    return safeUser;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = verifyPassword(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name || 'user',
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret-key', {
      expiresIn: '1h',
    });

    return { access_token: accessToken };
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
