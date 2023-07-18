import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { UserService } from './user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector , private userService: UserService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    this.userService.setUser(user)
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}