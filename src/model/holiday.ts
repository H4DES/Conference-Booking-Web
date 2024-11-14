import { HolidayModel } from "./holiday.model";

export class Holiday implements HolidayModel {
    holidayId: string | null;
    holidayName: string | null;
    holidayDate: string | null;

    constructor(){
    	this.holidayId = null;
    	this.holidayName = null;
    	this.holidayDate = null;
    }
}
