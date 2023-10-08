import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'calendar';

  viewDate: Date = new Date();

  data = [
    {
      id: 1,
      companyName: 'It Step Academy',
      groupName: 'JP-WS-19',
      grade: 'Middle',
      status: 0,
      startDate: '2023-10-07T10:04:33.799',
      endDate: '2024-04-07T10:04:33.799',
      currentSession: 0,
      sessionsAmount: 52,
      currentSyllabusTopicId: null,
      sessions: [
        {
          id: 1,
          day: 2,
          time: '16:00-18:00',
          auditorium: '32',
          isOnline: false,
          isAlternate: false,
        },
        {
          id: 2,
          day: 4,
          time: '16:00-18:00',
          auditorium: '32',
          isOnline: false,
          isAlternate: false,
        },
      ],
    },
    {
      id: 2,
      companyName: 'Tlancer',
      groupName: 'WS-3116',
      grade: 'Junior',
      status: 0,
      startDate: '2023-10-08T17:59:21.548',
      endDate: '2024-04-08T17:59:21.548',
      currentSession: 0,
      sessionsAmount: 52,
      currentSyllabusTopicId: null,
      sessions: [
        {
          id: 53,
          day: 1,
          time: '20:00-22:00',
          auditorium: '51',
          isOnline: true,
          isAlternate: true,
        },
        {
          id: 54,
          day: 3,
          time: '20:00-22:00',
          auditorium: '51',
          isOnline: true,
          isAlternate: true,
        },
      ],
    },
  ];
  events: CalendarEvent[] = [];
  private lastDayProcessed: number | null = null;
  hoveredEvent: CalendarEvent | null = null;
  modalRef: any = null; // keep a reference to the modal
  daySchedulingCount: { [key: number]: number } = {}; // New mapping to keep track

  constructor(private _modalService: NzModalService) {}
  @ViewChild('nzTemplate', { static: false }) nzTemplate!: TemplateRef<any>;
  ngOnInit() {
    this.generateEvents();
  }
  showTooltip(event: any) {
    this.hoveredEvent = event.event;
    this.modalRef = this._modalService.create({
      nzTitle: 'Event Details',
      nzContent: this.nzTemplate,
      nzFooter: null,
      nzClosable: false,
      nzMask: false,
      nzMaskClosable: false,
    });
  }

  hideTooltip() {
    this.hoveredEvent = null;
  }

  generateEvents() {
    this.data.forEach((group) => {
      group.sessions
        .sort((a, b) => a.day - b.day)
        .forEach((session) => {
          const startHour = session.time.split('-')[0];
          const endHour = session.time.split('-')[1];

          // If the day hasn't been scheduled yet, initialize it
          if (!this.daySchedulingCount[session.day]) {
            this.daySchedulingCount[session.day] = 0;
          }

          const dateForSession = this.getUpcomingDateForDay(
            session.day,
            this.daySchedulingCount[session.day]
          );

          // Increase the scheduling count for that day
          this.daySchedulingCount[session.day]++;

          const start = new Date(`${dateForSession}T${startHour}:00`);
          const end = new Date(`${dateForSession}T${endHour}:00`);

          this.events.push({
            start,
            end,
            title: `${group.groupName} | ${session.auditorium} | ${startHour}-${endHour}`,
            meta: {
              detail: `${group.companyName} | ${group.groupName} (${group.grade}) | Auditorium: ${session.auditorium} | Time: ${startHour} to ${endHour}`,
            },
          });
        });
    });
  }

  private getUpcomingDateForDay(day: number, weeksToSkip: number = 0): string {
    const now = new Date();
    let daysToAdd = ((day - now.getDay() + 7) % 7) + 7 * weeksToSkip; // Using weeksToSkip to skip the necessary weeks

    now.setDate(now.getDate() + daysToAdd);
    return now.toISOString().split('T')[0];
  }

  prevWeek(): void {
    const date = new Date(this.viewDate);
    date.setDate(date.getDate() - 7);
    this.viewDate = date;
  }

  nextWeek(): void {
    const date = new Date(this.viewDate);
    date.setDate(date.getDate() + 7);
    this.viewDate = date;
  }
}
