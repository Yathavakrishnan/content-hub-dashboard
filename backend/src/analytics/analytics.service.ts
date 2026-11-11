import { InjectRepository } from '@nestjs/typeorm';
import {Injectable,NotFoundException} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity.js';
import { Post } from '../entities/post.entity.js';

@Injectable()
export class AnalyticsService {
	constructor(
		@InjectRepository(Post)
		private readonly postRepository: Repository<Post>,
		@InjectRepository(Like)
		private readonly likeRepository: Repository<Like>,
	) {}

	async getSummary() {
		const posts = await this.postRepository.find();
		const totalLikes = await this.likeRepository.count();
		const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
		const topPost = [...posts].sort((a, b) => b.views - a.views)[0];

		return {
			totalPosts: posts.length,
			totalViews,
			totalLikes,
			topPost: topPost
				? { id: topPost.id, title: topPost.title, views: topPost.views }
				: null,
			posts: await Promise.all(
				posts.map(async (post) => ({
					id: post.id,
					title: post.title,
					views: post.views,
					likes: await this.likeRepository.count({ where: { post_id: post.id } }),
				})),
			),
		};
	}
}
