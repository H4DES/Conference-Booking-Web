import { LoginModel } from "./login.model";

export class Login implements LoginModel{
	userName: string;
	password: string;
	token: string;
	conferenceId: number | null;

	constructor(){
		this.userName = '';
		this.password = '';
		this.token = '';
		this.conferenceId = null;
	}
}
