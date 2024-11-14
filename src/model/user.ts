import { UserModel } from "./user.model";

export class Admin implements UserModel{
	userId: string | null;
	userName: string;
	conferenceId: string | null;
	userRole: string[];
	constructor(){
		this.userId = null;
		this.userName = '';
		this.conferenceId = null;
		this.userRole = [];
	}
    
}
export class User implements UserModel{
	userId: string | null;
	userName: string;
	conferenceId: string | null;
	userRole: string[];
	constructor(){
		this.userId = null;
		this.userName = '';
		this.conferenceId = null;
		this.userRole = [];
	}
}