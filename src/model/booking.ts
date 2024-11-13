import { BookingModel } from "./booking.model";

export class Booking implements BookingModel{
  bookingId: number | null; // Nullable int
  approvedBy: string; // Required string
  bookedDate: string;
  bookingStart: string;
  bookingEnd: string;
  organizer: string | null; // Nullable string
  department: string | null; // Nullable string
  contactNumber: string | null; // Nullable string
  emailAddress: string | null; // Nullable string
  expectedAttendees: number | null; // Nullable int
  purpose: string; // Required string
  description: string | null; // Nullable string
  statusCode: number | null; // Nullable string
  recurringType: string | null;
  recurringEndDate: string | null;
  conferenceId: number; // Required int

  constructor() { 
    this.bookingId = 0;//
    this.approvedBy = '';
    this.bookedDate = '';
    this.bookingStart = '';//
    this.bookingEnd = '';//
    this.organizer = '';//
    this.department = '';//
    this.contactNumber = '';//
    this.emailAddress = '';//
    this.expectedAttendees = null;//
    this.purpose = '';//
    this.description = '';
    this.statusCode = null;//Default to pending when inserting
    this.recurringType = null;
    this.recurringEndDate = null;
    this.conferenceId = 0;
  }


}
