import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Card } from '../../models/card.model';
import { CardService } from '../../services/card';
import { Tabs } from '../shared/tabs/tabs';

@Component({
  selector: 'app-card-detail',
  imports: [Tabs, RouterLink],
  templateUrl: './card-detail.html',
  styleUrl: './card-detail.css',
})
export class CardDetail implements OnInit {
  private cardService = inject(CardService);
  private route = inject(ActivatedRoute);

  private paramSignal = toSignal(this.route.paramMap);
  id = computed(() => this.paramSignal()?.get('id') ?? '');

  card = signal<Card | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  tabLabels = ['Efecto', 'Estadísticas', 'Precio'];
  activeTab = signal(0);

  ngOnInit(): void {
    this.loadCard();
  }

  private async loadCard(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const card = await this.cardService.getCard(this.id());
      this.card.set(card);
    } catch {
      this.error.set('No se pudo cargar la carta. Intentá de nuevo más tarde.');
    } finally {
      this.loading.set(false);
    }
  }
}
