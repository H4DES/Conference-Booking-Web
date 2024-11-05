export interface BookingModel {
    bookingId: number | null; // Nullable int
    approvedBy: string; // Required string
    bookedDate: string;
    bookingStart: string | null; // Nullable Date
    bookingEnd: string | null; // Nullable Date
    organizer: string | null; // Nullable string
    department: string | null; // Nullable string
    contactNumber: string | null; // Nullable string
    emailAddress: string | null; // Nullable string
    expectedAttendees: number | null; // Nullable int
    purpose: string; // Required string
    description: string | null; // Nullable string
    status: string | null; // Nullable string
    conferenceId: number; // Required int
}