import { RegisterModel } from "./register.model";

export class Register implements RegisterModel{
	userName: string;
	password: string;
	email: string;
	firstName: string;
	lastName: string;

	constructor(){
		this.userName = '';
		this.password = '';
		this.email = '';
		this.firstName = '';
		this.lastName = '';
	}
}
