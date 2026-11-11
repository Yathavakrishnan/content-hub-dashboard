import{Injectable,NotFoundException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity.js';
import { Post } from '../entities/post.entity.js';
import { Role } from '../entities/role.entity.js';
import { User } from '../entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async findAll(search?: string, role?: string) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    if (search) {
      query.andWhere(
        '(LOWER(user.name) LIKE :search OR LOWER(user.email) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    if (role) {
      query.andWhere('LOWER(role.name) = :role', { role: role.toLowerCase() });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { role: true },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    let role = await this.roleRepository.findOne({ where: { name: createUserDto.role } });

    if (!role) {
      role = this.roleRepository.create({ name: createUserDto.role });
      await this.roleRepository.save(role);
    }

    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password ?? '',
      role_id: role.id,
      role,
    });

    return this.userRepository.save(user);
  }

  async update(id: number, payload: Partial<CreateUserDto>) {
    const user = await this.findOne(id);

    if (payload.role) {
      let role = await this.roleRepository.findOne({ where: { name: payload.role } });
      if (!role) {
        role = this.roleRepository.create({ name: payload.role });
        await this.roleRepository.save(role);
      }
      user.role_id = role.id;
      user.role = role;
    }

    const { role: _role, password: _password, ...profile } = payload;
    Object.assign(user, profile);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    const userPosts = await this.postRepository.find({
      where: { user_id: id },
    });
    const postIds = userPosts.map((post) => post.id);

    await this.likeRepository.delete({ user_id: id });
    if (postIds.length > 0) {
      await this.likeRepository
        .createQueryBuilder()
        .delete()
        .where('post_id IN (:...postIds)', { postIds })
        .execute();
      await this.postRepository.delete(postIds);
    }

    await this.userRepository.remove(user);
    return user;
  }
}
