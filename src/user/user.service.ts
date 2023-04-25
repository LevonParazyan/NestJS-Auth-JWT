import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserInterface } from './interface/user.interface';
import { HashService } from '../auth/hash.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}
  async createUser(payload: UserInterface) {
    const exists = await this.userRepository.findOneBy({
      email: payload.email,
    });
    if (exists) {
      throw new ConflictException('User with that email already exists.');
    }
    try {
      payload.password = await this.hashService.hash(payload.password);
      this.userRepository.save(payload);
      return {
        message: 'User successfully created.',
        payload,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllUsers() {
    return this.userRepository.find();
  }

  async findUserById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async removeUser(id: string) {
    return this.userRepository.delete({ id });
  }
}
