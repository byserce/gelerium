export interface Car {
  id: string;
  title: string;
  price: number;
  year: number;
  km: number;
  imageUrls: string[];
  brand: string;
  model: string;
  // The following are optional as they only apply to listings from an external source
  sahibindenId?: string;
  listingUrl?: string;
}
