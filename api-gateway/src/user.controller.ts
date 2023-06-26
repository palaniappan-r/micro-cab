import { Controller, Get , Inject} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('users')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy
    ) {}

  @Get('/test')
  public async getTest(): Promise<any> {
    let data = await this.userServiceClient.send('test' , "")
    return data;
  }
}
