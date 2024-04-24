import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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

      return true;
    } catch (error) {
      console.log(error);
      const message = error.message || 'Unauthorized';
      throw new UnauthorizedException({ message });
    }
  }
}
