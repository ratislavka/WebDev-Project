import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart.service';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnChanges {

  @Input() eventsToShow: Event[] = [];

  sortedEvents: Event[] = [];

  currentSortKey: keyof Event | null = 'date';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.applySort();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventsToShow']) {
      this.applySort();
    }
  }

  sortEvents(key: keyof Event): void {
    if (this.currentSortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortKey = key;
      this.sortDirection = 'asc';
    }
    this.applySort();
  }

  private applySort(): void {
    let sorted = [...this.eventsToShow];

    if (this.currentSortKey) {
      if (sorted.length > 0 && !(this.currentSortKey in sorted[0])) {
        console.warn(`Cannot sort by key "${this.currentSortKey}" as it doesn't exist on the Event model.`);
        this.currentSortKey = null; // Reset sort key
      } else {
        sorted.sort((a, b) => {
          const valA = a[this.currentSortKey!];
          const valB = b[this.currentSortKey!];

          let comparison = 0;
          const valAExists = valA !== null && typeof valA !== 'undefined';
          const valBExists = valB !== null && typeof valB !== 'undefined';

          if (valAExists && valBExists) {
            if (valA > valB) comparison = 1;
            else if (valA < valB) comparison = -1;
          } else if (valAExists) {
            comparison = 1;
          } else if (valBExists) {
            comparison = -1;
          }
          return this.sortDirection === 'asc' ? comparison : comparison * -1;
        });
      }
    }
    this.sortedEvents = sorted;
  }


  addToCart(event: Event): void {
    this.cartService.addToCart(event);

    alert(`${event.name} has been added to your cart request sent.`); // Clarify alert
  }
}
