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
}

export interface RawCardImage {
  image_url: string;
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
}

export interface CardApiResponse {
  data: RawCard[];
}
