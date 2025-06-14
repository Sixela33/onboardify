import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private UserRepo: Repository<User>) {}

  async updateHashedRefreshToken(userId: string, hashedRefreshToken?: string) {
    return await this.UserRepo.update(
      { id: userId }, 
      { hashedRefreshToken: hashedRefreshToken || "" }
    );
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.UserRepo.create(createUserDto);
    return await this.UserRepo.save(user);
  }

  async findByEmail(email: string) {
    return await this.UserRepo.findOne({
      where: {
        email,
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    return this.UserRepo.findOne({
      where: { id: id },
      select: [
        'id',
        'firstName',
        'lastName',
        'avatarUrl',
        'hashedRefreshToken',
        'role',
      ],
    });
  }
}
