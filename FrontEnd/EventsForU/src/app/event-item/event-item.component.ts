import { CommonModule } from '@angular/common';
import { Event } from '../data';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./event-item.component.css']
})
export class EventItemComponent {
  @Input() event: any;

  redirectToCart(link: string): void {
    window.open(link, '_blank');
  }

  shareOnWhatsApp(link: string): void {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(link)}`;
    window.open(whatsappUrl, '_blank');
  }

  shareOnTelegram(link: string): void {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}`;
    window.open(telegramUrl, '_blank');
  }

}
