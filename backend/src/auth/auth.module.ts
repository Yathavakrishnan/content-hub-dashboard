import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { User } from '../entities/user.entity.js';
import { Role } from '../entities/role.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
