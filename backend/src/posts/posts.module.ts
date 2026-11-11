import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity.js';
import { Like } from '../entities/like.entity.js';
import { User } from '../entities/user.entity.js';
import { PostsController } from './posts.controller.js';
import { PostsService } from './posts.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like, User])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
