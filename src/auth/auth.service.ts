import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/create-auth.dto';
import { HashService } from './hash.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async validateUser(payload: any): Promise<any> {
    const user = await this.userService.getUserByEmail(payload.email);
    if (!user) {
      throw new NotFoundException('User was not found');
    }
    try {
      if (
        user &&
        (await this.hashService.compare(payload.password, user.password))
      ) {
        const { email, password } = user;
        return { email, password };
      }
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login(authDto: AuthDto): Promise<{ access_token: string }> {
    try {
      const validUser = await this.validateUser(authDto);
      if (!validUser) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      const payload = { email: validUser.email, password: validUser.password };
      const access_token = this.jwtService.sign(payload);
      return { access_token };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
