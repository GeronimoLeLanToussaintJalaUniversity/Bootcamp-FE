import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Card, CardApiResponse, RawCard } from '../models/card.model';

const NO_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="140">' +
      '<rect width="100%" height="100%" fill="#374151"/>' +
      '<text x="50%" y="50%" text-anchor="middle" fill="#9ca3af" font-size="10" font-family="sans-serif">Sin imagen</text>' +
      '</svg>',
  );

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

  async getCard(id: string): Promise<Card | null> {
    const params = new HttpParams().set('id', id);

    const response = await firstValueFrom(
      this.http.get<CardApiResponse>(this.baseUrl, { params }),
    );

    const raw = response.data[0];
    return raw ? this.toCard(raw) : null;
  }

  private toCard(raw: RawCard): Card {
    return {
      id: raw.id,
      name: raw.name,
      type: raw.type,
      imageUrl: raw.card_images[0]?.image_url ?? NO_IMAGE,
      desc: raw.desc,
      atk: raw.atk,
      def: raw.def,
      level: raw.level,
      attribute: raw.attribute,
      prices: raw.card_prices?.[0],
    };
  }
}
