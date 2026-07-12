import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Card, CardApiResponse, RawCard } from '../models/card.model';

@Service()
export class CardService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

  async getCards(query?: string): Promise<Card[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('fname', query);
    }

    const response = await firstValueFrom(
      this.http.get<CardApiResponse>(this.baseUrl, { params }),
    );

    return response.data.map(this.toCard);
  }

  private toCard(raw: RawCard): Card {
    return {
      id: raw.id,
      name: raw.name,
      type: raw.type,
      imageUrl: raw.card_images[0]?.image_url ?? '',
      desc: raw.desc,
      atk: raw.atk,
      def: raw.def,
      level: raw.level,
      attribute: raw.attribute,
      prices: raw.card_prices?.[0],
    };
  }
}
