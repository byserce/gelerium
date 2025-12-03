import type { Car } from '@/lib/types';
import { placeholderImages } from './placeholder-images';

function getImageUrl(id: string): string {
    const image = placeholderImages.find(p => p.id === id);
    return image ? image.imageUrl : "https://placehold.co/400x300/e2e8f0/64748b?text=Resim+Yok";
}

export const cars: Car[] = [
  {
    id: '1',
    title: 'Sahibinden Volkswagen Passat 1.5 TSI Business',
    brand: 'Volkswagen',
    model: 'Passat',
    year: 2022,
    price: 1650000,
    km: 35000,
    imageUrls: [getImageUrl('car1-1'), getImageUrl('car1-2'), getImageUrl('car1-3')],
  },
  {
    id: '2',
    title: 'Düşük KM BMW 520i Luxury Line',
    brand: 'BMW',
    model: '5 Serisi',
    year: 2021,
    price: 2400000,
    km: 22000,
    imageUrls: [getImageUrl('car2-1'), getImageUrl('car2-2'), getImageUrl('car2-3')],
  },
  {
    id: '3',
    title: 'Hatasız Boyasız Mercedes-Benz C200d AMG',
    brand: 'Mercedes-Benz',
    model: 'C Serisi',
    year: 2020,
    price: 2100000,
    km: 55000,
    imageUrls: [getImageUrl('car3-1'), getImageUrl('car3-2'), getImageUrl('car3-3')],
  },
  {
    id: '4',
    title: 'Audi A4 2.0 TDI Quattro Sport',
    brand: 'Audi',
    model: 'A4',
    year: 2019,
    price: 1850000,
    km: 89000,
    imageUrls: [getImageUrl('car4-1'), getImageUrl('car4-2'), getImageUrl('car4-3')],
  },
  {
    id: '5',
    title: 'Ford Focus 1.5 TDCi Titanium - Full Paket',
    brand: 'Ford',
    model: 'Focus',
    year: 2023,
    price: 1350000,
    km: 15000,
    imageUrls: [getImageUrl('car5-1'), getImageUrl('car5-2'), getImageUrl('car5-3')],
  },
  {
    id: '6',
    title: 'Renault Clio 1.0 TCe Joy',
    brand: 'Renault',
    model: 'Clio',
    year: 2024,
    price: 980000,
    km: 5000,
    imageUrls: [getImageUrl('car6-1'), getImageUrl('car6-2'), getImageUrl('car6-3')],
  },
  {
    id: '7',
    title: 'Ekonomik Aile Aracı: Fiat Egea 1.4 Fire Easy',
    brand: 'Fiat',
    model: 'Egea',
    year: 2021,
    price: 750000,
    km: 65000,
    imageUrls: [getImageUrl('car7-1'), getImageUrl('car7-2'), getImageUrl('car7-3')],
  },
  {
    id: '8',
    title: 'Honda Civic 1.5 VTEC Turbo Executive+',
    brand: 'Honda',
    model: 'Civic',
    year: 2022,
    price: 1550000,
    km: 28000,
    imageUrls: [getImageUrl('car8-1'), getImageUrl('car8-2'), getImageUrl('car8-3')],
  },
];
