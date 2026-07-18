import { Component, input, output, signal } from '@angular/core';
import { Card } from '../../models/card.model';
import { Tabs } from '../../shared/tabs/tabs';

@Component({
  selector: 'app-card-detail',
  imports: [Tabs],
  templateUrl: './card-detail.html',
  styleUrl: './card-detail.css',
})
export class CardDetail {
  card = input.required<Card>();
  close = output<void>();

  tabLabels = ['Efecto', 'Estadísticas', 'Precio'];
  activeTab = signal(0);
}
