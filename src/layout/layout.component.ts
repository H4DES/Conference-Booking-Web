import { CommonModule, DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { CheckboxModule } from 'primeng/checkbox';
import { Booking } from '../model/booking';
import { Title } from '@angular/platform-browser';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ConferenceService } from '../services/conference-service/conference.service';
import { BookingService } from '../services/booking-service/booking.service';
import { Conference } from '../model/conference';
import { retry, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth-service/auth.service';
import { SidebarComponent } from '../app/sidebar/sidebar.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { User } from '../model/user';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';
import { SweetAlertComponent } from '../app/sweet-alert/sweet-alert.component';
import { TabViewModule } from 'primeng/tabview';
import { Status } from '../model/status';
import { TooltipModule } from 'primeng/tooltip';
import { Holiday } from '../model/holiday';
import { HolidayService } from '../services/holiday-service/holiday.service';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

interface ConferenceRoom {
  name: string;
  code: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
              CommonModule,
              RouterOutlet,
              RouterLink,
              FullCalendarModule,
              FormsModule,
              DialogModule,
              ButtonModule,
              InputTextModule,
              KeyFilterModule,
              DropdownModule, 
              CheckboxModule,
              CalendarModule,
              FloatLabelModule,
              SidebarModule,
              ButtonModule,
              RippleModule,
              AvatarModule,
              StyleClassModule,
              DividerModule,
              TagModule,
              SidebarComponent,
              ScrollPanelModule,
              PanelModule,
              DataViewModule,
              BadgeModule,
              ToastModule,
              TabViewModule,
              SweetAlertComponent,
              TooltipModule
            ],
  providers: [MessageService, DatePipe],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  // encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {
  isExtendModalVisible: boolean = false;
  isBookingModalVisible: boolean = false;
  isEventModalVisible: boolean = false;
  isAdminEventModalVisible: boolean = false;
  currentTime: Date = new Date();
  selectedDate: string = '';
  formattedDate: string = '';
  // currentDate: Date | null = null;
  currentStep: number = 1;
  checked: boolean = false;
  currentTitle: string = "Organizer Information";
  currentID: string = '';
  data: Booking = new Booking();
  bookingById: Booking = new Booking;
  tokenRole!: string | null;
  time: Date[] | undefined;
  private timer: any;
  private timer2: any;
  formattedTimeNow: string = ""
  bookingByDate: Booking[] = [];
  formattedDateNow: string = new Date().toISOString().slice(0, 10);
  admins: User[] = [];
  recurringEndDate!: Date | null;
  userConferenceId: number | null = null;
  selectedEndTime: Date | null = null;
  recurringOptions: { name: string, type: string }[] = [
    { name: 'Daily', type: 'daily' },
    { name: 'Weekly', type: 'weekly' },
    { name: 'Monthly', type: 'monthly' }
  ];
  notifBookings: { updates: Booking[], notice: Booking[], status: Booking[] } = {
    updates: [],
    notice: [],
    status: []
  };
  holidays: Holiday[] = [];
  holidayData: Holiday = new Holiday;



  //for side bar
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  @ViewChild('customAlert') customAlert!: SweetAlertComponent;
  private alertClosedSubscription?: Subscription;

  closeCallback(e: Event): void {
      this.sidebarRef.close(e);
  }

  sidebarVisible: boolean = false;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  eventLegend: string = "";

  //Dropdown part
  ConferenceRoom: Conference[] = [];
  ConferenceData: Conference = new Conference;
  selectedRoom: ConferenceRoom | undefined;

  constructor(private conferenceServ: ConferenceService,
              private bookingServ: BookingService, 
              private router: Router, 
              private AuthServ: AuthService,
              private messageServ: MessageService, private datePipe: DatePipe,
              private cdr: ChangeDetectorRef,
              private holidayServ: HolidayService,
              private toastr: ToastrService) {}

              showSweetAlert(
                message: string, 
                status: 'success' | 'error' | 'warning' | 'info', 
                title: string = 'Alert',
                isWarning: boolean = false
              ): void {
                if (this.customAlert) {
                  this.customAlert.title = title;
                  this.customAlert.message = message;
                  this.customAlert.status = status;
                  this.customAlert.showAlert();
            
                  // Unsubscribe any previous subscription to avoid multiple triggers
                  // this.alertClosedSubscription?.unsubscribe();
                  // if (isWarning) {
                  //   this.alertClosedSubscription = this.customAlert.alertClosed.subscribe(() => {
                  //     this.onAlertClosed();
                  //     this.alertClosedSubscription?.unsubscribe(); // Unsubscribe after triggering once
                  //   });
                  // }
                }
              }
              

              onAlertClosed(): void {
                if (this.customAlert.status === 'warning') this.isBookingModalVisible = true;
              }

              

  @ViewChild('step1', { static: true }) step1Template!: TemplateRef<any>;
  @ViewChild('step2', { static: true }) step2Template!: TemplateRef<any>;

  ngOnInit(): void {    
    this.onGetHolidays();
    this.tokenRole = this.AuthServ.getUserRole();
    this.formattedTimeNow = this.currentTime.toLocaleTimeString('en-GB', { hour12: false });
    this.startClock();
    this.onLoadConference();
    this.startEventOngoingChecker();
    this.GetUserConferenceId(String(this.AuthServ.getNameIdentifier()));
    this.notifiedBookings = new Set<string | null>();
    //sample data diri i load ang naa didto sa ConferenceBooking table
  //   this.ConferenceRoom = [
  //     { name: 'New York', code: 'NY' },
  //     { name: 'Rome', code: 'RM' },
  //     { name: 'London', code: 'LDN' },
  //     { name: 'Istanbul', code: 'IST' },
  //     { name: 'Paris', code: 'PRS' }
  // ];
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Only allow numbers and one dot, and limit input length to 20 characters
    if (!/^[0-9.]*$/.test(input.value)) {
      input.value = input.value.replace(/[^0-9.]/g, ''); // Remove any non-numeric or non-dot characters
    }
  }

  autoResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto'; // Reset height to recalculate
    textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height to fit content
  }

  DisplayBookingByID(id: string) {
    ////console.`Searching for booking with ID: ${id}`);
    const booking = this.bookingData.find(b => b.bookingId === id);
  
    if (booking) {
      this.bookingById = booking;
      //////console."Booking found:", this.bookingById);
    } 
    else {
      console.error("No booking found with the provided ID.");
    }
  }

  // GetUserConferenceId(id: string):{

  // }

  // DisplayBookingByID(id: number){
  //   this.bookingById = this.bookingData.find(b => b.bookingId === id)!;
  //   ////console."reached here");

    // this.bookingServ.onGetBookingByBookingId(id).subscribe({
    //   next: (res) => {
    //     ////console.res);
    //     if (res.isSuccess) {
    //       this.bookingById = res.data
    //       //console.table(this.bookingById)
          
    //     } else {
    //       alert("Get failed!");
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Error inserting:', err); // Log any errors
    //   },
    //   complete: () => {
    //     // this.onLoadConference();
    //   }
    // });
  // }

  GetUserConferenceId(id: string) {
    this.AuthServ.onGetUserConferenceId(id).subscribe({
      next: (res) => {
        if (res.isSuccess){
          this.userConferenceId = res.data
        }
        else{
          this.userConferenceId = null;
        }
      }
    })
  }

  get formattedEndTime(): string {
    // Check if bookingById.bookingEnd is available and not empty
    if (this.bookingById && this.bookingById.bookingEnd) {
      return (
        this.datePipe.transform(
          `1970-01-01T${this.bookingById.bookingEnd}`,
          'h:mm a'
        ) || ''
      );
    }
    return '';
  }
  
  get formattedStartTime(): string {
    // Check if bookingById.bookingStart is available and not empty
    if (this.bookingById && this.bookingById.bookingStart) {
      return (
        this.datePipe.transform(
          `1970-01-01T${this.bookingById.bookingStart}`,
          'h:mm a'
        ) || ''
      );
    }
    return '';
  }

  checkBookingConflictExtend(data: Booking): Booking | null {
    const bookingConflict = this.bookingData.find(x => {
      if (x.status === Status.approve){
        if (data.extendedTime! >= x.bookingStart && data.extendedTime! <= x.bookingEnd && x.bookedDate === data.bookedDate){
          return x;
        }
        return null;
      }
      return null;
    });
    return bookingConflict || null;
  }


  checkBookingConflict(data: Booking): Booking | null{
    const bookingConflict = this.bookingData.find(x => {
      if (x.status === Status.approve){
        if (data.bookingStart >= x.bookingStart && data.bookingStart <= x.bookingEnd && x.bookedDate === data.bookedDate) {
          return x;
        }
        if (data.bookingEnd >= x.bookingStart && data.bookingEnd <= x.bookingEnd && x.bookedDate === data.bookedDate) {
          return x;
        }
        if (data.bookingStart <= x.bookingStart && data.bookingEnd >= x.bookingEnd && x.bookedDate === data.bookedDate) {
          return x;
        }
      }
      return null;
    });
    return bookingConflict || null;
  }
  
 
  BookConference(data: Booking) {
    const proceedWithBookings = () => {
      // Convert the time to the correct format (HH:mm:ss) before sending to the backend
      const bookingStart = this.convertTimeToSQLFormat(this.data.bookingStart);
      const bookingEnd = this.convertTimeToSQLFormat(this.data.bookingEnd);

      // -- Validation handling for booking available time range -- //
      if(data.bookingStart >= '00:00:00' && data.bookingStart < '07:59:00') {
        this.isBookingModalVisible = false;
        this.showSweetAlert('Please select a booking time starting from 8:00 AM or later.', 'warning', 'Invalid Booking Time', true);
        return;
      }

      // -- Validation handling for start-end time -- //
      if(data.bookingStart > data.bookingEnd) {
        this.isBookingModalVisible = false;
        this.showSweetAlert("Booking end time can't be earlier than booking start time!", 'warning', 'Invalid Time Range', true);
        return;
      }

      // -- Validation if start and end is equal -- //
      if(data.bookingStart == data.bookingEnd){
        this.isBookingModalVisible = false;
        this.showSweetAlert("Booking start time can't be equal to booking end time!", 'warning', 'Invalid Time Range');
        return;
      }

      if (bookingStart && bookingEnd) {
        data.bookingStart = bookingStart;
        data.bookingEnd = bookingEnd;
      }
      if (Number(this.ConferenceData.capacity) < Number(data.expectedAttendees)){
        this.isBookingModalVisible = false;
        this.showSweetAlert(`The expected number of attendees has exceeded the conference capacity of ${this.ConferenceData.capacity}`, 'warning', 'Exceeded Conference Capacity', true);
        return;
      }
      if(data.recurringType){
        data.recurringEndDate = this.recurringEndDate!.toISOString().split('T')[0];

      }else{
        data.recurringType = null;
        data.recurringEndDate = null;
      }
      ////console.data.recurringEndDate);
      //console.table(data);
      data.bookingEnd = this.ExtraEndTime(data.bookingEnd, 5);
      this.bookingServ.onAddOrUpdateBooking(data).subscribe({
        next: (res) => {
          ////console.res);
          if (res.isSuccess) {
            this.isBookingModalVisible = false;
            this.showSweetAlert("Booking successfully completed!", 'success', 'Success!', false);
            this.data = new Booking();
          } else {
            this.isBookingModalVisible = false;
            this.showSweetAlert("Booking failed. Please try again.", 'error', 'Error!');
          }
        },
        error: (err) => {
          console.error('Error inserting:', err); // Log any errors
          this.isBookingModalVisible = false;
          this.showSweetAlert("An unexpected error occurred. Please try again later.", 'error', 'Error!');
        },
        complete: () => {
          this.recurringEndDate = null;
          this.onLoadConference(data.conferenceId!);
        }
      });
    }
    data.bookingId = null;
    data.conferenceId = this.currentID;
    data.bookedDate = this.selectedDate;

    // -- Validation handling for inputs -- //
    if (!data.organizer || !data.department || !data.contactNumber || !data.purpose || !data.bookingStart || !data.bookingEnd || !data.expectedAttendees) {
      this.isBookingModalVisible = false;
      ////console.this.formattedDateNow);
      this.showSweetAlert('All fields must be filled out before booking.', 'warning', 'Required Fields Missing', true);
      return;
    }

    const conflictBooking = this.checkBookingConflict(data);
    if (conflictBooking){
      //console.info('conflict found');
      this.isBookingModalVisible = false;
      Swal.fire({
        title: 'Booking Conflict',
        text: `Time slot already booked for ${conflictBooking.purpose}, continue booking?`,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((res) => {
        if (res.isDismissed){
          Swal.fire({
            title: 'Booking has been cancelled',
            icon: 'info'
          });
        } else {
          proceedWithBookings();
        }
      })
    } else{
      proceedWithBookings();
    }



    
  }

  onAddOrUpdateHoliday(data: Holiday){
    this.holidayServ.onAddOrUpdateHoliday(data).subscribe({
      next: (res) => {
        if (res.isSuccess){
          // Swal.fire("Successfully added holiday",);
          this.toastr.success(res.data, 'Success');
        }
        else{
          this.toastr.warning("Something went wrong, please try again later", "Notice");
          console.error(res.errorMessage);
        }
      },
      complete: () => {
        this.onGetHolidays();
      }
    });
  }

  addHoliday(date: string){
    const formattedDate = new Date(date).toLocaleDateString('en-CA');
    this.isBookingModalVisible = false;
    const holidayData: Holiday = new Holiday;
    holidayData.holidayDate = formattedDate;
    holidayData.holidayId = null;
    Swal.fire({
      title: `Set Holiday \n ${date}`,
      input: "text",
      inputPlaceholder: "Enter holiday name...",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      preConfirm: (text) => {
        if (!text) {
          Swal.showValidationMessage("Holiday name is required!");
        }
        return text;
      }
    }).then((result) => {
      if (result.isConfirmed){
        holidayData.holidayName = result.value;
        this.onAddOrUpdateHoliday(holidayData);
      }
    })
  }
  deleteHoliday(id: string){
    this.holidayServ.onHolidayDelete(id).subscribe({
      next: (res) => {
        if (res.isSuccess){
          this.toastr.success("Holiday removed!", "Success");
          this.holidays = [];
          this.onGetHolidays();
        }
        else{
          this.toastr.warning("Something went wrong, please try again", "Notice");
          console.error(res.errorMessage);
        }
      },
      complete: () => {
      }
    })
  }



  handleBooking(data: Booking, action: string) {
    const proceedHandling = () => {
      Swal.fire({
        title: "Booking Remarks (Optional)",
        text: "Would you like to add any remarks for this booking? This is optional.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#33d92e",
        confirmButtonText: "Add Remarks",
        cancelButtonText: "Accept Booking"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Add Your Remarks",
            input: "textarea",
            inputPlaceholder: "Enter remarks for this booking",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
            inputAttributes: {
              maxlength: "79" // Limit input to 79 characters
            },
            html: `
            <div id="charCount">79 characters remaining</div>
            `,
            didOpen: () => {
              const remarksInput = Swal.getInput() as HTMLTextAreaElement | null; // Access Swal's default input
              const charCount = Swal.getPopup()?.querySelector('#charCount') as HTMLDivElement | null;

              // Check if elements are found and add event listener
              if (remarksInput && charCount) {
                remarksInput.addEventListener('input', () => {
                  const remaining = 79 - remarksInput.value.length;
                  charCount.textContent = `${remaining} characters remaining`;
                });
              }
            },
            preConfirm: () => {
              const remarksInput = Swal.getInput() as HTMLTextAreaElement | null;
              return remarksInput ? remarksInput.value : "";
            }
          }).then((remarkResult) => {
            if (remarkResult.isConfirmed) {
              const remarks = remarkResult.value;
              data.status = Status.approve;
              data.description = remarks; // Store remarks in `data`
              this.showSweetAlert(`Booking ${this.bookingById.purpose} accepted successfully!`, 'success', 'Success!');
              this.checkEndedBookings(data);
              this.executeBookingUpdate(data);
            }else{
              this.isAdminEventModalVisible = true;
            }
          });
        }else {
          // debugger;
          data.status = Status.approve;
          data.description = "";
          this.showSweetAlert(`Booking ${this.bookingById.purpose} accepted successfully!`, 'success', 'Success!');
          this.checkEndedBookings(data);
          this.executeBookingUpdate(data);
        }
      });
    }
    if (action === "approve") {
      this.isAdminEventModalVisible = false;
      const conflictBooking = this.checkBookingConflict(data);
      if (conflictBooking){
        //console.info("conflict Found");
        Swal.fire({
          title: 'Booking conflict',
          text: 'Time slot already booked, continuing will automatically reject prior approved booking',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Continue',
          cancelButtonText: 'Cancel'
        }).then((res) => {
          if (res.isDismissed){
            Swal.fire({
              title: 'Cancelled',
              text: 'Booking approval has been cancelled',
              icon: 'info'
            });
           return;
          }
          else{
            proceedHandling();
          }
        });
      }else{
        proceedHandling();
      }
    } else if (action === "reject") {
      this.rejectBooking(data);
    }
  }

rejectBooking(data: Booking) {
    this.isAdminEventModalVisible = false;

    Swal.fire({
        title: "Are you sure?",
        text: `Do you want to reject ${this.bookingById.purpose}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, reject it!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Remarks",
                input: "textarea",
                inputPlaceholder: "State reason for rejecting this booking",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Submit",
                cancelButtonText: "Cancel",
                preConfirm: (remarks) => {
                    // Validate if remarks are empty
                    if (!remarks) {
                        Swal.showValidationMessage("Remarks cannot be empty");
                    }
                    return remarks;
                }
            }).then((remarkResult) => {
                if (remarkResult.isConfirmed) {
                    const remarks = remarkResult.value;
                    
                    data.status = Status.reject;
                    data.description = remarks; // Store remarks in `data`
                    ////console."Remarks set in data.description:", data.description);
                    Swal.fire({
                      title: "Success!",
                      text: `Booking ${this.bookingById.purpose} Rejected Successfully!`,
                      icon: "success",
                    });
                    this.executeBookingUpdate(data);
                }
            });
        }
    });
}

checkEndedBookings(data: Booking) {
  const currentDateTime = new Date(`${this.formattedDateNow}T${this.formattedTimeNow}`);
  const bookingEndDateTime = new Date(`${data.bookedDate}T${data.bookingEnd}`);

  if (currentDateTime >= bookingEndDateTime) {
    data.status = Status.end;
  }
}

ExtraEndTime(endTime: string, minutesToAdd: number): string {
  let [hours, minutes] = endTime.split(":").map(Number);

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes + minutesToAdd);

  let newHours = date.getHours().toString().padStart(2, "0");
  let newMinutes = date.getMinutes().toString().padStart(2, "0");

  return `${newHours}:${newMinutes}:00`;
}

toogleExtendMeetingModal(){
  this.isEventModalVisible = false;
  this.isExtendModalVisible = true;
}

extendMeeting(data: Booking, _extended: boolean) {
  if (data.extended == null && this.selectedEndTime == undefined){
    this.showSweetAlert("Please select valid time.", 'warning', 'Invalid Extend Time');
  }
  else{
    if(_extended){
      this.isAdminEventModalVisible = false;
      const _extendedTime: string = data.extendedTime ? data.extendedTime : 'invalid time';
      const conflictBooking = this.checkBookingConflictExtend(data);
      const proceedApproveExtend = () => {
        data.status = Status.extend;
        data.extended = true;
        data.bookingEnd = this.ExtraEndTime(_extendedTime, 5);
        this.executeBookingUpdate(data);
        this.showSweetAlert("Meeting extended successfully.", 'success', 'Succes!');
        ////console.this.bookingById);
      }
      if(conflictBooking){
        Swal.fire({
          title: 'Conflict booking found',
          text: `Requested extend time found for ${conflictBooking.purpose}`,
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Approve Extension'
        }).then((res) => {
          if (res.isConfirmed){
            proceedApproveExtend();
          }else {
            this.toastr.info('Extend approval cancelled');
          }
        })
      }else {
        proceedApproveExtend();
      }
    }
    else{
      this.isExtendModalVisible = false;
      const time = this.selectedEndTime?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      const conflictBooking = this.checkBookingConflictExtend(data);
      const proceedExtend = () => {
        data.extended = _extended;
        data.status = Status.extendPending
        data.extendedTime = `${time}:00`;
        this.executeBookingUpdate(data);
        this.showSweetAlert("Your request to extend the meeting has been submitted successfully.", 'success', 'Meeting Extension Requested');
      }
      if (conflictBooking){
        Swal.fire({
          title: 'Conflict booking found',
          text: `Extended time already booked for ${conflictBooking.purpose}, continue?`,
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'No',
          confirmButtonText: 'Yes'
        }).then((res) => {
          if (res.isConfirmed){
            proceedExtend();
          }else {
            this.toastr.info("Extend request cancelled", "Cancelled");
          }
        })
      }else {
        proceedExtend();
      }
    }
  }
}

cancelExtend(data: Booking){
  this.isAdminEventModalVisible = false;

    Swal.fire({
        title: "Are you sure?",
        text: `Do you want to reject request extend meeting for  ${this.bookingById.purpose}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, reject it!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Remarks",
                input: "textarea",
                inputPlaceholder: "State reason for rejecting request extend booking",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Submit",
                cancelButtonText: "Cancel",
                preConfirm: (remarks) => {
                    // Validate if remarks are empty
                    if (!remarks) {
                        Swal.showValidationMessage("Remarks cannot be empty");
                    }
                    return remarks;
                }
            }).then((remarkResult) => {
                if (remarkResult.isConfirmed) {
                    const remarks = remarkResult.value;
                    
                    data.extended = true;
                    data.status = Status.extendRejected;
                    data.description = remarks; // Store remarks in `data`
                    ////console."Remarks set in data.description:", data.description);
                    Swal.fire({
                      title: "Success!",
                      text: `Request extend booking for ${this.bookingById.purpose} Rejected Successfully!`,
                      icon: "success",
                    });
                    this.executeBookingUpdate(data);
                }
            });
        }
    });
}

forceEndBooking(data: Booking){
  this.isAdminEventModalVisible = false;
  Swal.fire({
    title: "End this booking?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, end it!"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Booking Ended!",
        text: "Meeting has been ended.",
        icon: "success"
      });
      data.status = Status.end;
      data.bookingEnd = this.formattedTimeNow;
      this.executeBookingUpdate(data);
    }else{
      this.isAdminEventModalVisible = true;
    }
  });
}

executeBookingUpdate(data: Booking) {
    this.bookingServ.onAddOrUpdateBooking(data).subscribe({
        next: (res) => {
            ////console."STATUS CHANGE!!!" + res + data);
            if (res.isSuccess) {
                //console.table(this.bookingData)
                this.isBookingModalVisible = false;
            } else {
                alert("Operation Failed!");
            }
        },
        error: (err) => {
            console.error("Error updating:", err);
        },
        complete: () => {
            this.onLoadConference(data.conferenceId!);
        }
    });
}



  // Helper function to format Date to 'YYYY-MM-DD'
  formatDateToSQLFormat(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, hence adding 1
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

  
  // Helper function to convert time (HH:mm) to SQL format (HH:mm:ss)
  convertTimeToSQLFormat(time: string): string {
    // Check if time is already in the correct format
    if (time && time.length === 5) {
      return `${time}:00`; // Append seconds to the HH:mm format
    }
    return '';
  }
  

  startClock(){
    // Update the time every second
    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }


  onUpdateStatus(data: Booking){
    this.bookingServ.onUpdateBookingStatus(data).subscribe({
      next: (res) => {
        if (res.isSuccess){
          this.onLoadCalendarEvents(String(this.ConferenceData.conferenceId));
        }
        else{
          console.error(res.errorMessage);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  startEventOngoingChecker(){
    this.timer2 = setInterval(() => {
      this.formattedTimeNow = this.currentTime.toLocaleTimeString('en-GB', { hour12: false });
      this.checkEventStarting(this.formattedTimeNow);
      this.checkUpcomingBooking(this.formattedTimeNow);
    }, 1000);
  }

  checkEventStarting(timeNow: string) {
    // debugger;
    // //console.info(`${this.formattedTimeNow}`);
    // ////console.this.bookingByDate.map(x => x.bookingStart <= timeNow));
    for (let booking of this.bookingByDate) {
        // Check if timeNow is less than bookingStart
        if (timeNow < booking.bookingStart) {
            continue; // Skip to the next booking
        }

        if (booking.status == Status.end){
          continue;
        }

        //SECTION A
        // Check if timeNow is greater than or equal to bookingEnd 
        
        if (timeNow >= booking.bookingEnd && booking.status == Status.ongoing) {
            booking.status = Status.end;
            this.executeBookingUpdate(booking);
            ////console."status DONE");
            continue; // Skip to the next booking
        }

        if (timeNow >= booking.bookingEnd && booking.status == Status.extendPending) {
          booking.status = Status.end;
          this.executeBookingUpdate(booking);
          ////console."status DONE");
          continue; // Skip to the next booking
        }

        if (timeNow >= booking.bookingEnd && booking.status == Status.extend) {
          booking.status = Status.end;
          this.executeBookingUpdate(booking);
          ////console."status DONE");
          continue; // Skip to the next booking
        }

        if (timeNow >= booking.bookingEnd && booking.status == Status.extendRejected) {
          booking.status = Status.end;
          this.executeBookingUpdate(booking);
          ////console."status DONE");
          continue; // Skip to the next booking
        }
        
      
        if (booking.status == Status.ongoing || booking.status == Status.extendPending || booking.status == Status.extend){
          continue;
        }
        // Check if timeNow is greater than or equal to bookingStart
        if (timeNow >= booking.bookingStart) {
            // booking.status = "ongoing";
            this.updateEvent();
            // this.updateBookingData.bookingId = booking.bookingId;
            // this.onUpdateStatus(this.updateBookingData);
            ////console."status ONGOING");
        }
    }

    ////console."Finished processing all bookings");
}

  
  getBookingByDate(){
    this.bookingByDate = this.bookingData.filter(b => b.bookedDate === this.formattedDateNow).sort((a, b) => {
      return a.bookingStart.localeCompare(b.bookingStart);
    });
  }


  ngOnDestroy(): void {
    this.alertClosedSubscription?.unsubscribe();

    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  resetModal() {
    this.currentStep = 1;
    // this.data = new Booking();
    this.checked = false; 
  }

  showDialog() {
    this.isBookingModalVisible = true;
    this.currentStep = 1;
  }

  showRoleEventDialog(){
    this.tokenRole = this.AuthServ.getUserRole();
      if (this.tokenRole === 'SuperAdmin'|| this.tokenRole === 'AdminRole' ){
        this.isAdminEventModalVisible = true;
      }
      else if(this.userConferenceId === this.ConferenceData.conferenceId){
        this.isAdminEventModalVisible = true;
      }
      else {
        this.isEventModalVisible = true;
      }
  }

  nextStep() {
    this.currentStep++;
    this.currentTitle = "Meeting Details";
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.currentTitle = "Organizer Information";
    }
  }

  getCurrentStepTemplate(): TemplateRef<any> {
    switch (this.currentStep) {
      case 1:
        return this.step1Template;
      case 2:
        return this.step2Template;
      default:
        return this.step1Template;
    }
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
    left: 'title',
    center: '',
    right: 'prev,next today'
  },
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: '2023-04-01' },
      { title: 'event 2', date: '2023-04-02' }
    ],
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    },
    // TIME FORMAT CHANGES
    eventContent: (arg) => {
      const startTime = arg.event.start;
      const endTime = arg.event.end;
      const status = arg.event.extendedProps['status']; // Get the status

      let dotClass = 'dot-black'; // Default class
      let iconClass = 'pi pi-circle-fill';
      let iconSize = '0.55rem';
      let titleStyle = '';

      // Assign classes based on the status
      switch (status) {
        case 'approved':
          dotClass = 'dot-green';
          break;
        case 'pending':
          dotClass = 'dot-orange';
          iconSize = '0.60rem';
          break;
        case 'ended':
          dotClass = 'dot-gray';
          break;
          case 'ongoing':
            dotClass = 'dot-blinking-red';
            break;
          case 'extension pending':
            dotClass = 'dot-glowing-blinking-red';
            break;
          case 'extension rejected':
            dotClass = 'dot-blinking-red';
            break;
          case 'extended':
            dotClass = 'dot-blinking-red';
            break;
        case 'rejected':
          dotClass = 'dot-rejected';
          iconClass = 'ri-close-circle-fill';
          iconSize = '0.75rem';
          titleStyle = 'text-decoration: line-through; color: rgb(236, 53, 20);';
          break;
        default:
          dotClass = 'dot-black'; // Fallback class
      }

      if (!startTime || !endTime) {
        return { html: `<div><strong>Time not available</strong></div>` };
      }

      const timeDisplay = `<span class="${iconClass} ${dotClass}" style="font-size: ${iconSize};"></span>
        ${startTime.getHours() % 12 || 12}${startTime.getHours() < 12 ? 'AM' : 'PM'}-${endTime.getHours() % 12 || 12}${endTime.getHours() < 12 ? 'AM' : 'PM'}`;

      const title = arg.event.title || 'No Title';
      const titleDisplay = `<span style="${titleStyle}"><b>${title}</b></span>`;

      return {
        html: `<div>${timeDisplay} ${titleDisplay}</div>`,
      };
    },

    eventDidMount: (info) => {
      info.el.style.backgroundColor = 'rgba(50,100,230, 0.2)';
      info.el.style.color = '#505050';
      info.el.style.padding = "4px 6px";
      info.el.style.margin = "1px";

      info.el.style.overflow = "hidden";
      info.el.style.whiteSpace = "nowrap"; // Prevent text from wrapping
      info.el.style.textOverflow = "ellipsis"; // Show "..." when text overflows

      // Set the event width to auto but constrained by its parent cell



      info.el.addEventListener('mouseenter', () => {
        info.el.style.backgroundColor = 'rgba(255, 0 ,0 , 0.5)'; // Change to a darker color
        info.el.style.color = '#ffffff';
      });
      info.el.addEventListener('mouseleave', () => {
        info.el.style.backgroundColor = 'rgba(50,100,230, 0.2)'; // Revert to original color
        info.el.style.color = '#505050';
      });
    },
    dayCellDidMount: (info) => {
      const originalDate = info.date; // Original Date object
      const newDate = new Date(originalDate); // Create a new Date object to avoid mutation
      newDate.setDate(newDate.getDate()); // Adjust to the correct date
      const formattedEventDate = newDate.toLocaleDateString('en-CA'); // Format to 'yyyy-MM-dd'

      // Find the holiday matching the current date
      const holiday = this.holidays.find((h: Holiday) => h.holidayDate === formattedEventDate);

      // Check if a holiday exists for the current day
      if (holiday) {
        // Find or create holiday content
        let holidayDiv = info.el.querySelector('.holiday-info') as HTMLElement;

        if (!holidayDiv) {
          // If the holiday content doesn't exist, create a new one
          holidayDiv = document.createElement('div');
          holidayDiv.classList.add('holiday-info');
          holidayDiv.style.position = 'absolute';
          holidayDiv.style.top = '50%';
          holidayDiv.style.left = '50%';
          holidayDiv.style.transform = 'translate(-50%, -50%)';
          holidayDiv.style.height = '100%';
          holidayDiv.style.width = '100%';
          holidayDiv.style.backgroundColor = '#FCF596';
          holidayDiv.style.fontWeight = 'bold';
          holidayDiv.style.fontSize = '1rem';
          holidayDiv.style.textAlign = 'center';
          holidayDiv.style.display = 'flex';
          holidayDiv.style.flexDirection = 'column';
          holidayDiv.style.justifyContent = 'center';
          holidayDiv.style.alignItems = 'center';
          holidayDiv.style.zIndex = '100';

          // Append the holiday content div to the day cell
          info.el.appendChild(holidayDiv);
        }

        // Set or reset the holiday content
        holidayDiv.innerHTML = `
          <span>${newDate.toLocaleString('default', { month: 'short' })} ${newDate.getDate()}</span>
          <span>${holiday.holidayName}</span>
        `;

        // Hide the day number and apply other styles
        const dayText = info.el.querySelector('.fc-daygrid-day-number');
        if (dayText) {
          (dayText as HTMLElement).style.display = 'none'; // Hide the day number
        }
        info.el.style.pointerEvents = 'none'; // Disable interaction
        info.el.style.position = 'relative'; // Ensure position is relative for the holiday content
      } else {
        // If no holiday, reset any previous holiday content
        const holidayDiv = info.el.querySelector('.holiday-info');
        if (holidayDiv) {
          holidayDiv.remove(); // Remove the holiday info if not a holiday day
        }

        // Ensure the day number is visible again
        const dayText = info.el.querySelector('.fc-daygrid-day-number') as HTMLElement;
        if (dayText) {
          dayText.style.display = ''; // Make sure the day number is visible
        }

        info.el.style.pointerEvents = ''; // Restore interaction
        info.el.style.position = ''; // Reset position style
      }
    },
    aspectRatio: 1.35,
    hiddenDays: [0],
    eventClick: this.handleEventClick.bind(this)
  };




  handleEventClick(info: any) {
    this.DisplayBookingByID(String(info.event.id));
    const eventDetails = `
      ID: ${info.event.id}
      Meeting Title: ${info.event.title}
      Start: ${info.event.start}
      End: ${info.event.end || 'Not set'}
      Description: ${info.event.extendedProps.description || 'No description'}
      Location: ${info.event.extendedProps.location || 'No location'}
      Speaker: ${info.event.extendedProps.speaker || 'No speaker'}
    `;
    this.showRoleEventDialog();
    // alert(eventDetails);  // Display the event details in an alert

  }



  handleDateClick(arg: any) {
    // Allow clicking on other days but not Sundays
    const date = arg.date;
    date.setDate(date.getDate());
    const formattedEventDate = date.toLocaleDateString('en-CA');
    const holiday = this.holidays.find(x => x.holidayDate === formattedEventDate);
    if (!holiday) {
      this.isBookingModalVisible = true;
      // Set the selected date from the clicked date (arg.dateStr is in YYYY-MM-DD format)
      this.selectedDate = arg.dateStr;
      this.formattedDate = this.convertDateToLongFormat(this.selectedDate);
    }
    if (holiday && this.tokenRole && this.tokenRole !== 'UserRole'){
      Swal.fire({
        title: holiday.holidayName!,
        text: "Remove this holiday?",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed){
          this.deleteHoliday(holiday.holidayId!);
        }
      })
    }
  }

  getFormattedSelectedDate(): string {
    return this.convertDateToLongFormat(this.selectedDate);
  }

  convertDateToLongFormat(dateString: string): string {
    const date = new Date(dateString); // Create a Date object from the string
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: '2-digit' 
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(date); // Return formatted date
  }

  toggleAccordion(collapseId: string): void {
    const element = document.getElementById(collapseId);
    if (element) {
      const bootstrapCollapse = new bootstrap.Collapse(element, { toggle: false }); // Initialize without toggling
      if (this.checked) {
        bootstrapCollapse.show(); // Open the accordion section when checked
      } else {
        bootstrapCollapse.hide(); // Close the accordion section when unchecked
      }
    }
  }

  getTagStyle(status: string | null): { [key: string]: string } {
    if (!status) {
      status = 'default';  // Set to a default string to avoid type issues
    }
    
    switch (status.toLowerCase()) {
      case 'approved':
        return { color: 'white', backgroundColor: 'green', padding: '3px' };

      case 'pending':
        return { color: 'white', backgroundColor: 'rgb(250, 162, 0)', padding: '3px' };

      case 'extension pending':
        return { color: 'white', backgroundColor: 'rgb(250, 162, 0)', padding: '3px' };

      case 'ongoing':
        return { color: 'rgb(254, 44, 46)', backgroundColor: 'white', padding: '2px', borderColor: 'white' };

      case 'extended':
        return { color: 'rgb(254, 44, 46)', backgroundColor: 'white', padding: '2px', borderColor: 'white' };

      case 'rejected':
        return { color: 'white', backgroundColor: '#f5182d', padding: '4px', border: 'white solid 1px' };

      case 'extension rejected':
        return { color: 'white', backgroundColor: '#f5182d', padding: '4px', border: 'white solid 1px' };
      
      case 'ended':
        return { color: 'white', backgroundColor: 'rgb(136, 136, 136)', padding: '4px',};

      default:
        return { color: 'red', backgroundColor: 'rgba(255, 0, 0, 0.1)' };
    }
  }

  
  updateEventStatus() {
  this.formattedTimeNow = this.currentTime.toLocaleTimeString('en-GB', { hour12: false });

  this.bookingData.forEach((booking: Booking) => {
    // Update status based on current time and existing conditions
    if (this.formattedTimeNow >= booking.bookingStart && booking.status !== Status.end) {
      booking.status = Status.ongoing;
    }

    // Update the status in the calendar if the event exists
  });
}


  updateEvent(){
   this.formattedTimeNow = this.currentTime.toLocaleTimeString('en-GB', { hour12: false });
      const events = this.bookingData.map((booking: Booking) => {

        if (this.formattedTimeNow >= booking.bookingStart && booking.status === Status.approve && this.formattedDateNow === booking.bookedDate){
          booking.status = Status.ongoing;
        }
        const event: {} = {
          id: booking.bookingId,
          title: booking.purpose || 'No Title',
          // CONCAT BOOKED DATE WITH THE TIME
          start: `${booking.bookedDate}T${booking.bookingStart}`,
          end: `${booking.bookedDate}T${booking.bookingEnd}`,
          extendedProps: {
          status: booking.status
        }
      };
      return event;
    });
    this.calendarOptions!.events = events;
  }

  // Api calls for data events
  bookingData: Booking[] = [];

  onLoadCalendarEvents(conferenceID: string) {
    this.bookingServ.onGetBookingByConferenceId(conferenceID).subscribe({
      next: (res) => {
        if(res.isSuccess){
          this.bookingData = res.data;
          //console.table(this.bookingData);
          this.updateEvent();
          this.getBookingByDate();
          this.formattedTimeNow = this.currentTime.toLocaleTimeString('en-GB', { hour12: false });
          this.checkUpcomingBooking(this.formattedTimeNow);
        }else {
          ////console.res.errorMessage);
        }
      },
      error: (err) => {
        console.error("Error loading bookings", err)
      }
    })    
  }

  onLoadConference(id: string = '') {
    this.conferenceServ.onGetAllConference().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.ConferenceRoom = res.data.filter(x => x.isActive)
          ////console."Conference Rooms: ", this.ConferenceRoom);
          
          // Set default to the first conference in the list
          if (this.ConferenceRoom.length > 0) {
            this.ConferenceData = id != '' ? this.ConferenceRoom.find(x => x.conferenceId === id)! : this.ConferenceRoom[0]; 
            
            // Call onConferenceChange here to load calendar events and alert the ID
            this.onConferenceChange();
          }
        } else {
          console.error("Error: " + res.errorMessage);
        }
      },
      error: (err) => {
        console.error("Error: " + err);
      }
    });
  }
  

  getConferenceName(): string[] {
    const conferenceName = new Set<string>();

    for(const items of this.ConferenceRoom){
      if(items.conferenceName){
        conferenceName.add(items.conferenceName);
      }
    }
    return Array.from(conferenceName);
  }
  onConferenceChange() {
    if (this.ConferenceData) {
      this.onLoadCalendarEvents(String(this.ConferenceData.conferenceId));
      ////console."Conference data changed!: " + this.ConferenceData.conferenceId?.toString());
      // this.currentID = parseInt(this.ConferenceData.conferenceId?.toString() || '0', 10);
      this.currentID = this.ConferenceData.conferenceId!;
      ////console.this.currentID);
      this.checkEventStarting(this.formattedTimeNow);
      this.notifiedBookings = new Set<string | null>();
      // alert(this.currentID);
    }
  }
  notifVisible: boolean = false;
  toggleNotif(){
    this.notifVisible = !this.notifVisible;
  }

  getStatusLabel(status: string): string {
        let statusText = '';
        let statusColor = '';

        switch (status.toLowerCase()) {
            case Status.approve:
                statusText = 'approved';
                statusColor = 'green';
                break;
            case Status.ongoing:
                statusText = 'ongoing';
                statusColor = 'red';
                break;
            case Status.end:
                statusText = 'ended';
                statusColor = 'gray';
                break;
            case Status.reject:
                statusText = 'rejected';
                statusColor = 'black';
                break;
            case Status.extend:
                statusText = 'extended';
                statusColor = 'red';
                break;
            case Status.extendPending:
                statusText = 'extend pending';
                statusColor = 'rgb(250, 162, 0)';
                break;
            default:
                statusText = 'unknown';
                statusColor = 'black';
                break;
        }

        return `${statusText}|${statusColor}`;
    }


  
  
  notifSound = new Audio('../assets/notifSound.wav');
  notifiedBookings = new Set<string | null>();
  notifCount: number = 0;
  checkUpcomingBooking(TimeNow: string) {
    this.notifBookings.updates = this.bookingByDate.filter(b => TimeNow >= this.subtractMinutes(b.bookingStart, 30) 
                                                     && !(TimeNow > b.bookingEnd)
                                                     && (b.status === Status.approve || b.status === Status.ongoing || b.status === Status.extend || b.status === Status.extendPending));
    
    this.notifBookings.status = this.bookingByDate.filter(b => (b.status === Status.approve || b.status === Status.cancel) && !this.notifBookings.updates.some(x => x.bookingId === b.bookingId));
    this.notifBookings.notice = this.bookingByDate.filter(b => b.status === Status.reject || b.status === Status.extendRejected);


    this.notifCount = Object.values(this.notifBookings).reduce((sum, array) => sum + array.length, 0);

    this.notifBookings.updates.forEach(x => {
      if (!this.notifiedBookings.has(x.bookingId)) {
        this.notifiedBookings.add(x.bookingId);
        this.messageServ.add({ severity: 'secondary', summary: `${x.purpose}`, detail: `${this.calculateTimeUntilStart(x.bookingStart)}` });
        this.notifSound.play().catch(err => console.error('Error playing notification sound', err));
      }
      
    });

      
    
    ////console."Checked the upcoming booked events");
  }

  notifStatusDescription(booking: Booking): string | null{
    if (booking.status === Status.cancel){
      return 'Meeting cancelled';
    }
    if (booking.status === Status.approve){
      return booking.description === '' ? 'Meeting approved!' : `Meeting approved\nRemarks: ${booking.description}`
    }
    return null;
  }

  subtractMinutes(time: string, minutes: number): string {
    const [hours, mins, secs] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(mins);
    date.setSeconds(secs || 0);
    date.setMinutes(date.getMinutes() - minutes);
    return date.toTimeString().split(' ')[0];
  }


  calculateTimeUntilStart(bookingStart: string): string {
    const start = new Date(`1970-01-01T${bookingStart}`);
    const now = new Date(`1970-01-01T${this.formattedTimeNow}`);
    const diff = start.getTime() - now.getTime();

    if (diff <= 0) return 'Meeting ongoing';

    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes === 0) {
      return 'Starting soon';
    }
  
    return minutes < 30
      ? `Starting in less than ${minutes} minutes`
      : `Starting soon`;
}

   

  onLogout(){
    localStorage.removeItem('authToken');
    this.router.navigateByUrl('/login');
  }

  // extendMeeting(data: Booking){
  //   data.status = Status.extend;
  //   this.bookingServ.onAddOrUpdateBooking(data).subscribe({
  //     next: (res) => {
  //       if (res.isSuccess){

  //       }
  //       else {

  //       }
  //     },
  //     error: (err) => {
  //       console.error(err);
  //     }
  //   });
  // }
  
  onGetHolidays(){
    this.holidayServ.onGetAllHolday().subscribe({
      next: (res) => {
        if (res.isSuccess){
          this.holidays = res.data;
          //console.info(res.data);
          this.initHoliday();
        }
        else {
          ////console.res.errorMessage);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  initHoliday() {
    if (this.holidays) {
      const dayCells = document.querySelectorAll('.fc-daygrid-day');

      // First, reset all day cells in case holidays were removed (including those in the new month)
      dayCells.forEach((dayCell) => {
        if (!(dayCell instanceof HTMLElement)) return; // Ensure it's an HTMLElement

        // Reset styles and content for all day cells
        const dayText = dayCell.querySelector('.fc-daygrid-day-number');
        if (dayText && dayText instanceof HTMLElement) {
          dayText.style.display = ''; // Restore the text visibility
        }

        (dayCell as HTMLElement).style.pointerEvents = ''; // Enable interaction
        (dayCell as HTMLElement).style.position = ''; // Reset position style

        // Clear any added holiday content if no holiday is present
        const holidayContent = dayCell.querySelector('.holiday-info');
        if (holidayContent) {
          holidayContent.remove(); // Remove the holiday box if exists
        }
      });

      // Now, apply new holiday styles and information
      this.holidays.forEach((holiday) => {
        const formattedDate = holiday.holidayDate; // Assuming holidayDate is in 'yyyy-MM-dd'

        const dayCell = Array.from(dayCells).find(
          (cell) => cell.getAttribute('data-date') === formattedDate
        );

        if (dayCell && formattedDate) { // Ensure formattedDate is not null
          // Add styles and holiday information
          const dayText = dayCell.querySelector('.fc-daygrid-day-number');
          if (dayText && dayText instanceof HTMLElement) {
            dayText.style.display = 'none'; // Hide the day number
          }

          (dayCell as HTMLElement).style.pointerEvents = 'none'; // Disable interaction
          (dayCell as HTMLElement).style.position = 'relative'; // Positioning for holiday info

          // Add the holiday box, making sure it doesn't interfere with day number
          let holidayDiv = dayCell.querySelector('.holiday-info') as HTMLElement;
          if (!holidayDiv) {
            // Create the holiday box only if it doesn't exist already
            holidayDiv = document.createElement('div') as HTMLElement;
            holidayDiv.classList.add('holiday-info');
            holidayDiv.style.position = 'absolute';
            holidayDiv.style.top = '50%';
            holidayDiv.style.left = '50%';
            holidayDiv.style.transform = 'translate(-50%, -50%)';
            holidayDiv.style.height = '100%';
            holidayDiv.style.width = '100%';
            holidayDiv.style.backgroundColor = '#FCF596';
            holidayDiv.style.fontWeight = 'bold';
            holidayDiv.style.fontSize = '1rem';
            holidayDiv.style.textAlign = 'center';
            holidayDiv.style.display = 'flex';
            holidayDiv.style.flexDirection = 'column';
            holidayDiv.style.justifyContent = 'center';
            holidayDiv.style.alignItems = 'center';
            holidayDiv.style.zIndex = '100';

            holidayDiv.innerHTML = `
              <span>${new Date(formattedDate).toLocaleString('default', { month: 'short' })} ${new Date(formattedDate).getDate()}</span>
              <span>${holiday.holidayName}</span>
            `;

            dayCell.appendChild(holidayDiv); // Append the holiday div to the day cell
          } else {
            // Reset the content in case the div already exists
            holidayDiv.innerHTML = `
              <span>${new Date(formattedDate).toLocaleString('default', { month: 'short' })} ${new Date(formattedDate).getDate()}</span>
              <span>${holiday.holidayName}</span>
            `;
          }
        }
      });
    }
  }

  onBookingDelete(data: Booking) {
    this.bookingServ.onBookingDelete(data.bookingId!).subscribe({
      next: (res) => {
        if (res.isSuccess){
          this.toastr.info('Removed booked meeting', 'Success');
        }else{
          Swal.fire({
            title: 'A problem occured, please try again later',
            icon: 'info'
          })
          console.error(res.errorMessage)
        }
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => {
        this.onLoadConference(data.conferenceId!)
        this.isAdminEventModalVisible = false;
      }
    })
  } 

}


