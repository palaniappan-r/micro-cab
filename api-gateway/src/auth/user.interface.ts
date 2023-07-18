export enum Role {
    Admin = 'admin',
    Customer = 'customer',
    Driver = 'driver'
}

export interface IAuthenticate {
    readonly user: any;
    readonly token: string
}