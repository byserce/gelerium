export interface Car {
  id: string;
  title: string;
  price: number;
  year: number;
  km: number;
  imageUrls: string[];
  imagePaths: string[];
  brand: string;
  model: string;
  listingUrl?: string;
}
