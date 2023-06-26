import { Controller, Get } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor() { }
  @MessagePattern('test')
  public async test() : Promise<string> {
    return "User microservice running"
  }
}