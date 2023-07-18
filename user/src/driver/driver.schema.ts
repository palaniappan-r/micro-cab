import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { IDriver } from './driver.interface';
import { GeoJsonObject } from 'geojson';

export const DriverSchema = new mongoose.Schema<IDriver>(
  {
    driverId: {
      type: String
    },
    name: {
      type : String,
      required : [true, "Name cannot be empty"],

    },
    email: {
      type: String,
      required: [true, 'Email can not be empty'],
      unique : true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Email should be valid',
      ]
    },
    password: {
      type: String,
      required: [true, "Password cannot be empty"],
      minLength: [8 , "Password should be atleast 8 chars long"]
    },
    status: {
      type: Boolean
    },
    driveLoc: {
      type: [Number],
    }
  }
)

DriverSchema.methods.encryptPassword = (password : string) : Promise<string> => {
  let salt_rounds = 10 //TO-DO -> Add in env
  return bcrypt.hash(String(password), salt_rounds);
}

DriverSchema.pre('save' , async function (next) {
  if(!this.isModified('password')){
    next()
  }
  this.password = await this.encryptPassword(this.password)
  next()
})