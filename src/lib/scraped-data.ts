import type { Car } from '@/lib/types';
import { placeholderImages } from './placeholder-images';

function getImageUrl(id: string): string {
    const image = placeholderImages.find(p => p.id === id);
    return image ? image.imageUrl : "https://placehold.co/400x300/e2e8f0/64748b?text=Resim+Yok";
}

// This is a simulated scraped data, with a price change for the first car.
export const scrapedCars: Omit<Car, 'id'>[] = [
  {
    title: 'Sahibinden Volkswagen Passat 1.5 TSI Business',
    brand: 'Volkswagen',
    model: 'Passat',
    year: 2022,
    price: 1640000, // Price dropped
    km: 35500,     // KM increased
    imageUrls: [getImageUrl('car1-1'), getImageUrl('car1-2'), getImageUrl('car1-3')],
  },
  {
    title: 'Düşük KM BMW 520i Luxury Line',
    brand: 'BMW',
    model: '5 Serisi',
    year: 2021,
    price: 2400000,
    km: 22000,
    imageUrls: [getImageUrl('car2-1'), getImageUrl('car2-2'), getImageUrl('car2-3')],
  },
  {
    title: 'Hatasız Boyasız Mercedes-Benz C200d AMG',
    brand: 'Mercedes-Benz',
    model: 'C Serisi',
    year: 2020,
    price: 2100000,
    km: 55000,
    imageUrls: [getImageUrl('car3-1'), getImageUrl('car3-2'), getImageUrl('car3-3')],
  },
];
