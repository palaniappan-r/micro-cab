import { Controller, Get , Inject , Post , Put , Delete, Res , Body , HttpStatus , Param, Query} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('customer')
export class CustomerController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy
    ) {}

  @Get('/login')
  public async test(@Res() response , @Query() params : any): Promise<any> {
    let data = await firstValueFrom(this.userServiceClient.send('login_cust' , params.customerId))
    {
      return response.status(HttpStatus.FOUND).json({
        message: 'Customer has been logged in',
        data});
    }
  }
  
  @Get('/getAll')
  public async getAllCustomers(@Res() response): Promise<any> {
    let data = await firstValueFrom(this.userServiceClient.send('get_all_cust' , ""))
    {
      return response.status(HttpStatus.FOUND).json({
        message: 'Customers have been found',
        data});
    }
  }

  @Get('/findById')
  public async getCustomer(@Res() response , @Query() params : any): Promise<any> {
    let data = await firstValueFrom(this.userServiceClient.send('get_cust' , params.customerId))
    {
      return response.status(HttpStatus.FOUND).json({
        message: 'Customer has been found',
        data});
    }
  }

  @Post('/create')
  public async createStudent(@Res() response, @Body() createCustomerDto) : Promise<any>{
    let data = await firstValueFrom(this.userServiceClient.send('create_cust' , createCustomerDto))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Customer has been created successfully',
        data});
    }
  }

  //To-Do : only update the logged in user
  @Put('/update')
  public async updateCustomerById(@Res() response, @Body() updateCustomerDto , @Query() params : any) : Promise<any>{
    //For now, the customerId is passed as a query param, later, it'll be taken from the auth cookie
    const payload = [updateCustomerDto , params.customerId]
    let data = await firstValueFrom(this.userServiceClient.send('update_cust' , payload))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Customer has been updated successfully',
        data});
    }
  }

  //To-Do : Chk if user is logged in first
  @Delete('/delete')
  public async deleteCustomerBuId(@Res() response, @Query() params : any) : Promise<any>{
    let data = await firstValueFrom(this.userServiceClient.send('delete_cust' , params.customerId))
    {
      return response.status(HttpStatus.CONTINUE).json({
        message: 'Customer has been deleted successfully',
        data});
    }
  }
}
