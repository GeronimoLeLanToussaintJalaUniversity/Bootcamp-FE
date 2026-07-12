export interface Card {
  id: number;
  name: string;
  type: string;
  imageUrl: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  attribute?: string;
  prices?: CardPrices;
}

export interface RawCardImage {
  image_url: string;
}

export interface CardPrices {
  cardmarket_price: string;
  tcgplayer_price: string;
  ebay_price: string;
  amazon_price: string;
  coolstuffinc_price: string;
}

export interface RawCard {
  id: number;
  name: string;
  type: string;
  desc: string;
  card_images: RawCardImage[];
  atk?: number;
  def?: number;
  level?: number;
  attribute?: string;
  card_prices?: CardPrices[];
}

export interface CardApiResponse {
  data: RawCard[];
}
