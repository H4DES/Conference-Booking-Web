import { AdminModel } from "./admin.model";

export class Admin implements AdminModel{
	userId: number | null;
	userName: string;
	conferenceId: number | null;
	constructor(){
		this.userId = null;
		this.userName = '';
		this.conferenceId = null;
	}
}
