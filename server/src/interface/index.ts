export interface ISignIn {
    firstName: string;
    lastName: string;
    mobileNo: string;
}

export interface IChat {
    from: string;
    to: string;
    message: string;
}

export interface IUser {
    _id: string;
    password: string;
    mobileNo: string;
    __v: number;
}