import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FullCalendarModule, FormsModule, DialogModule, ButtonModule, InputTextModule,  KeyFilterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  visible: boolean = false;
  currentTime: Date = new Date();
  private timer: any;

  ngOnInit(): void {
    this.startClock();
  }

  startClock() {
    // Update the time every second
    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  showDialog() {
    this.visible = true;
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: '2023-04-01' },
      { title: 'event 2', date: '2023-04-02' }
    ],
    aspectRatio: 1.35, // Lower value to make the calendar taller and fill more screen space
    dayCellDidMount: (info) => {
      if (info.date.getDay() === 0) {
        
        info.el.style.pointerEvents = 'none';
        info.el.style.backgroundColor = 'rgb(169, 169, 169)';
        info.el.style.color = 'rgb(255, 255, 255)';
      }
    },
  };

  handleDateClick(arg: any) {
    // Allow clicking on other days but not Sundays
    if (arg.date.getDay() !== 0) {
      this.visible = true;
      // alert('date click! ' + arg.dateStr);
    }
  }

}
