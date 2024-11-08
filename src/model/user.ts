import { UserModel } from "./user.model";

export class Admin implements UserModel{
	userId: number | null;
	userName: string;
	conferenceId: number | null;
	constructor(){
		this.userId = null;
		this.userName = '';
		this.conferenceId = null;
	}
}
export class User implements UserModel{
	userId: number | null;
	userName: string;
	conferenceId: number | null;
	constructor(){
		this.userId = null;
		this.userName = '';
		this.conferenceId = null;
	}
}