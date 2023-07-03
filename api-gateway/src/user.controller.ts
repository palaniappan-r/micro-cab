import { Controller, Get , Inject , Post , Put , Delete, Res , Body , HttpStatus , Param, Query} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy
    ) {}

  @Get('/customer')
  public async getTest(@Res() response , @Query() params : any): Promise<any> {
    let data = await firstValueFrom(this.userServiceClient.send('get_cust' , params.customerId))
    {
      return response.status(HttpStatus.FOUND).json({
        message: 'Customer has been found',
        data});
    }
  }

  @Post('/customer')
  public async createStudent(@Res() response, @Body() createCustomerDto) : Promise<any>{
    let data = await firstValueFrom(this.userServiceClient.send('create_cust' , createCustomerDto))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Customer has been created successfully',
        data});
    }
  }

  @Put('/customer')
  public async updateCustomerById(@Res() response, @Body() updateCustomerDto , @Query() params : any) : Promise<any>{
    const payload = [updateCustomerDto , params.customerId]
    let data = await firstValueFrom(this.userServiceClient.send('update_cust' , payload))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Customer has been updated successfully',
        data});
    }
  }

  //To-Do : Chk if user is logged in first
  @Delete('/customer')
  public async deleteCustomerBuId(@Res() response, @Query() params : any) : Promise<any>{
    let data = await firstValueFrom(this.userServiceClient.send('delete_cust' , params.customerId))
    {
      return response.status(HttpStatus.CONTINUE).json({
        message: 'Customer has been deleted successfully',
        data});
    }
  }
}
