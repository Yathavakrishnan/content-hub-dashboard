import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../entities/like.entity.js';
import { Post } from '../entities/post.entity.js';
import { User } from '../entities/user.entity.js';
import { Role } from '../entities/role.entity.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Post, Like])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
