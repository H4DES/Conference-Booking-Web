import { Admin } from "./adminUsers";
import { ConferenceModel } from "./conference.model";

export class Conference implements ConferenceModel {
  conferenceId: number | null; // Nullable int
  conferenceName: string | null; // Nullable string
  capacity: number | null; // Nullable int
  isActive: boolean | null; // Nullable boolean
  adminUserDtos: Admin[];

  constructor() {
    this.conferenceId = 0,
    this.conferenceName = '',
    this.capacity = 0,
    this.isActive = null;
    this.adminUserDtos = [];
   }

}
