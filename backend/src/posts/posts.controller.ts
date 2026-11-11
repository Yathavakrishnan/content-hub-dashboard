import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { PostsService } from './posts.service.js';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: any) {
    return this.postsService.create(createPostDto, req.user.sub);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() payload: Partial<CreatePostDto>) {
    return this.postsService.update(+id, payload);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @Post(':id/view')
  view(@Param('id') id: string) {
    return this.postsService.view(+id);
  }

  @Post(':id/like')
  like(@Param('id') id: string, @Req() req: any) {
    return this.postsService.like(+id, req.user);
  }
}
