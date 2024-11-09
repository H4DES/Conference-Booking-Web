import { RegisterModel } from "./register.model";

export class Register implements RegisterModel{
	userName: string;
	password: string;
	email: string;

	constructor(){
		this.userName = '';
		this.password = '';
		this.email = '';
	}
}
