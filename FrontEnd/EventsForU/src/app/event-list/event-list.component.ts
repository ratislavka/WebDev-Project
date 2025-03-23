import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import { EventItemComponent } from '../event-item/event-item.component';
import { Event } from '../data';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    EventItemComponent
  ],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {
  @Input() events: Event[] = [];

}
