export type Car = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number;
  imageUrls: string[];
  description?: string;
  expertise_report?: Record<string, string>;
  source: 'internal'; // Kendi veritabanı ilanı
};

export type ExternalCar = {
    id: number;
    sahibinden_id: string;
    title: string;
    price: number;
    model: string;
    year: string;
    km: string;
    image_url: string;
    original_link: string;
    source: 'external'; // Dış kaynak ilanı
}
