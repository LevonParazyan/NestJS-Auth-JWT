import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/create-auth.dto';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  @ApiOkResponse({
    status: 200,
    description: 'The user got his credentials',
  })
  async getProfile(@Request() req: any) {
    return req.user;
  }

  @Post('login')
  @ApiCreatedResponse({ description: 'You have successfully logged in.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('register')
  @ApiOkResponse({
    status: 200,
    description: 'The user has been successfully registered.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
