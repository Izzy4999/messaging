export interface UserSign {
    firstName:string,
    lastName:string,
    userName:string,
    DOB?: Date,
    email:string,
    password:string,
}
export interface LogUser {
  userName?: string;
  email?: string;
  password: string;
}