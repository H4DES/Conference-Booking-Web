import { ConferenceModel } from "./conference.model";
import { User } from "./user";

export class Conference implements ConferenceModel {
  conferenceId: string | null; // Nullable int
  conferenceName: string | null; // Nullable string
  capacity: number | null; // Nullable int
  isActive: boolean | null; // Nullable boolean
  userDtos: User[];

  constructor() {
    this.conferenceId = null,
    this.conferenceName = '',
    this.capacity = 0,
    this.isActive = null;
    this.userDtos = [];
   }

}
