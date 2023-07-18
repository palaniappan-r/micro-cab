// user.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private user: any;

  setUser(user: any) {
    this.user = user;
  }

  getUser(): any {
    return this.user;
  }
}
