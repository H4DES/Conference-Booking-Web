import { User } from './user'


export interface ConferenceModel {
    conferenceId: string | null; // Nullable int
    conferenceName: string | null; // Nullable string
    capacity: number | null; // Nullable int
    isActive: boolean | null; // Nullable boolean
    userDtos: User[];
}