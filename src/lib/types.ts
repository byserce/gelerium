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
};
