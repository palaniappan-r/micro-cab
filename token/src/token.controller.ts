import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) { }

    @MessagePattern('create_token')
    public createToken(payload : string[]) : string {
        const token : string = this.tokenService.createToken(payload[0] , payload[1])
        return token
    }

    @MessagePattern('decode_token')
    public decodeToken(token : string) : any {
        const data : any = this.tokenService.decodeToken(token)
        return data
    }

}