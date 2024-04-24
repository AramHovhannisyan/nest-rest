import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registration(userDto: CreateUserDto) {
    const condidate = await this.userService.getUserByEmail(userDto.email);
    if (condidate) {
      throw new HttpException(
        'User with this email exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { email, password } = userDto;
    const hashPassword = await bcrypt.hash(password, 5);

    const user = await this.userService.createUser({
      email,
      password: hashPassword,
    });

    const payload = {
      id: user.dataValues.id,
      email: user.dataValues.email,
      roles: user.dataValues.roles,
    };

    return this.generateToken(payload);
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);

    return this.generateToken({ ...user.dataValues });
  }

  private async generateToken(payload) {
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);

    if (!user) {
      throw new UnauthorizedException({ message: 'Incorrect email' });
    }

    const isMatch = await bcrypt.compare(userDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException({ message: 'Incorrect pass' });
    }

    return user;
  }
}
