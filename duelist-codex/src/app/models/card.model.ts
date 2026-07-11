export interface Card {
  id: number;
  name: string;
  type: string;
  imageUrl: string;
}

export interface RawCardImage {
  image_url: string;
}

export interface RawCard {
  id: number;
  name: string;
  type: string;
  card_images: RawCardImage[];
}

export interface CardApiResponse {
  data: RawCard[];
}
