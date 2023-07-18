import { Document } from 'mongoose';

export interface ICustomer extends Document{
    customerId: string;
    name: string;
    email : string;
    password: string;
    balance : number;
    compareCustPassword: (password: string) => Promise<boolean>; 
    encryptPassword: (password: string) => Promise<string>;
}