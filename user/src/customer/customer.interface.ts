import { Document } from 'mongoose';

export interface ICustomer extends Document{
    customerId: string;
    name: string;
    email : string;
    password: string;
    balance : number;
    comparePassword: (password: string) => Promise<boolean>; 
    encryptPassword: (password: string) => Promise<string>;
}