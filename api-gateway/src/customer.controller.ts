import { Controller, Get , Inject , Post , Put , Delete, Res , Body , HttpStatus , Param, Query , UseGuards} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { HasRoles } from './auth/roles.decorator';
import { Role } from './auth/role.enum';
import { RolesGuard } from './auth/role.guard';
import { UserService } from './auth/user.service'; 
import { AuthGuard } from '@nestjs/passport';


@HasRoles(Role.CUSTOMER)
@Controller('customer')
export class CustomerController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    private userService : UserService
    ) {}

  @Post('/create')
  public async createStudent(@Res() response, @Body() createCustomerDto) : Promise<any>{
    let data = await firstValueFrom(this.userServiceClient.send('create_cust' , createCustomerDto))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Customer has been created successfully',
        data});
    }
  }

  @Post('/login')
  public async test(@Res() response , @Body() loginDto : any): Promise<any> {
    let data = await firstValueFrom(this.userServiceClient.send('login_cust' , [loginDto.customerId , loginDto.password]))
    {
      return response.status(HttpStatus.FOUND).json({
        message: 'Customer has been logged in',
        data});
    }
  }
  
  @UseGuards(AuthGuard('jwt') , RolesGuard)
  @Get('/getAll')
  public async getAllCustomers(@Res() response): Promise<any> {
    let data = await firstValueFrom(this.userServiceClient.send('get_all_cust' , ""))
    {
      return response.status(HttpStatus.FOUND).json({
        message: 'Customers have been found',
        data});
    }
  }

  @UseGuards(AuthGuard('jwt') , RolesGuard)
  @Get('/getById')
  public async getCustomer(@Res() response , @Query() params : any): Promise<any> {
    let data = await firstValueFrom(this.userServiceClient.send('get_cust' , params.customerId))
    {
      return response.status(HttpStatus.FOUND).json({
        message: 'Customer has been found',
        data});
    }
  }

  @UseGuards(AuthGuard('jwt') , RolesGuard)
  @Put('/update')
  public async updateCustomerById(@Res() response, @Body() updateCustomerDto) : Promise<any>{
    const user = this.userService.getUser()
    const payload = [updateCustomerDto , user.userId]
    let data = await firstValueFrom(this.userServiceClient.send('update_cust' , payload))
    {
      return response.status(HttpStatus.CREATED).json({
        message: 'Customer has been updated successfully',
        data});
    }
  }

  //To-Do : Chk if user is logged in first
  @UseGuards(AuthGuard('jwt') , RolesGuard)
  @Delete('/delete')
  public async deleteCustomerBuId(@Res() response) : Promise<any>{
    const user = this.userService.getUser()
    let data = await firstValueFrom(this.userServiceClient.send('delete_cust' , user.userId))
    {
      return response.status(HttpStatus.CONTINUE).json({
        message: 'Customer has been deleted successfully',
        data});
    }
  }
}
