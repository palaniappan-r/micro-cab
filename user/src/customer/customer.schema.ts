import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { ICustomer } from './customer.interface';
import { minLength } from 'class-validator';

// Schemas can be created like this using SchemaFactory as well
// @Schema()
// export class Customer {
//   @Prop({required : true})
//   name: string;

//   @Prop({required : true})
//   email: string;

//   @Prop({required : true})
//   balance: number;
// }

// export const CustomerSchema = SchemaFactory.createForClass(Customer);

export const CustomerSchema = new mongoose.Schema<ICustomer>(
  {
    customerId: {
      type: 
    }
    name: {
      type : String,
      required : [true, "Name cannot be empty"],

    },
    email: {
      type: String,
      required: [true, 'Email can not be empty'],
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Email should be valid',
      ],
    },
    password: {
      type: String,
      required: [true, "Password cannot be empty"],
      minLength: [8 , "Password should be atleast 8 chars long"]
    },
  }
)

CustomerSchema.methods.encryptPassword = (password : string) : Promise<string> => {
  let salt_rounds = 10 //TO-DO -> Add in env
  return bcrypt.hash(String(password), salt_rounds);
}

// CustomerSchema.methods.comparePassword = (password : string) : boolean => {
//   return bcrypt.compare(password  , this.password)
// }

CustomerSchema.methods.comparePassword = (password1 : string , password2 : string) : boolean => {
  return bcrypt.compare(password1  , password2)
}

CustomerSchema.pre('save' , async function (next) {
  if(!this.isModified('password')){
    next()
  }
  this.password = await this.encryptPassword(this.password)
  next()
})