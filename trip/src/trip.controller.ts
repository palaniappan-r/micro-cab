import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { TripService } from './trip.service';

@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TripService) { }

}