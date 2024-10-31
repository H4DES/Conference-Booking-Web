import { Admin } from "./admin";

export interface ConferenceModel {
    conferenceId: number | null; // Nullable int
    conferenceName: string | null; // Nullable string
    capacity: number | null; // Nullable int
    isActive: boolean | null; // Nullable boolean
    admin: Admin[];
}