import { LoginModel } from "./login.model";

export class Login implements LoginModel{
	userName: string;
	password: string;
	token: string

	constructor(){
		this.userName = '';
		this.password = '';
		this.token = '';
	}
}
