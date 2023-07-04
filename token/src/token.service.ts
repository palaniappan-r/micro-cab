import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
    constructor (
        private readonly jwtService : JwtService
    ){}

    //To-Do : change role to enum later
    public createToken(userId : string , role : string) : string {
        const token = this.jwtService.sign(
            {
              userId,
              role
            },
            {
              expiresIn: 30 * 24 * 60 * 60,
            },
          );
        return token
    }

    public async decodeToken(token: string) {
        let result = null
          try {
            const tokenData = this.jwtService.decode(token) as {
              exp: number;
              userId: any;
              role: string
            };
            if (!tokenData || tokenData.exp <= Math.floor(+new Date() / 1000)) {
              result = null;
            } else {
              result = {
                userId: tokenData.userId,
                role: tokenData.role
              };
            }
          } catch (e) {
            result = null;
          }
        return result;
      }
}