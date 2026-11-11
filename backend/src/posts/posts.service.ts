import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity.js';
import { Post } from '../entities/post.entity.js';
import { User } from '../entities/user.entity.js';
import { CreatePostDto } from './dto/create-post.dto.js';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    const posts = await this.postRepository.find({
      relations: { user: true },
    });

    return Promise.all(
      posts.map(async (post) => ({
        ...post,
        likes: await this.likeRepository.count({ where: { post_id: post.id } }),
      })),
    );
  }

  async create(createPostDto: CreatePostDto, userId?: number) {
    const user = userId
      ? await this.userRepository.findOne({ where: { id: userId } })
      : null;

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const post = this.postRepository.create({
      title: createPostDto.title,
      description: createPostDto.content,
      user_id: user.id,
      views: 0,
    });

    return this.postRepository.save(post);
  }

  async update(id: number, payload: Partial<CreatePostDto>) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }

    if (payload.title !== undefined) post.title = payload.title;
    if (payload.content !== undefined) post.description = payload.content;

    return this.postRepository.save(post);
  }

  async remove(id: number) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }

    await this.likeRepository.delete({ post_id: id });
    await this.postRepository.remove(post);
    return post;
  }

  async view(id: number) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }

    post.views += 1;
    await this.postRepository.save(post);

    return { postId: post.id, views: post.views };
  }

  async like(id: number, user: any) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }

    const existingLike = await this.likeRepository.findOne({
      where: { post_id: id, user_id: user.sub },
    });

    if (existingLike) {
      return { message: 'You already liked this post' };
    }

    const like = this.likeRepository.create({
      post_id: id,
      user_id: user.sub,
    });

    await this.likeRepository.save(like);

    return {
      postId: id,
      likedBy: user?.email,
      likes: await this.likeRepository.count({ where: { post_id: id } }),
    };
  }
}
