import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException({
          message: 'Authorization Header Not Provided',
        });
      }

      const isBearer = request.headers.authorization.split(' ')[0];
      const token = request.headers.authorization.split(' ')[1];

      if (isBearer != 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }

      const user = this.jwtService.verify(token);
      request.user = user;

      const permissionExists = user.roles.some((userRole) =>
        requiredRoles.includes(userRole.value),
      );

      if (!permissionExists) {
        throw new HttpException('You dont have access', HttpStatus.FORBIDDEN);
      }

      return true;
    } catch (error) {
      console.log(error);
      const message = error.message || 'Forbidden';
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
