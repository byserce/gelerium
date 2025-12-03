import type { Car } from './types';

// This file now represents the 'database' of cars.
// The car-data-updater-flow will compare against this data.

export const cars: Car[] = [
  {
    id: '1',
    sahibindenId: '1283399946',
    title: 'SAFKAN BENZİNLİ KAPUT BOYASIZ',
    price: 319900,
    year: 2018,
    km: 110000,
    brand: 'Opel',
    model: 'Astra',
    imageUrls: [
      "https://i0.shbdn.com/photos/39/99/46/lthmb_1283399946rdh.avif"
    ],
    listingUrl: 'https://www.sahibinden.com/ilan/vasita-otomobil-opel-safkan-benzinli-kaput-boyasiz-1283399946/detay',
  },
  {
    id: '2',
    sahibindenId: '1286367961',
    title: 'EMSALSİZ AUDİ OTOMOTİK',
    price: 575000,
    year: 2015,
    km: 150000,
    brand: 'Audi',
    model: 'A3',
    imageUrls: [
      "https://i0.shbdn.com/photos/36/79/61/lthmb_1286367961r59.avif"
    ],
    listingUrl: 'https://www.sahibinden.com/ilan/vasita-otomobil-audi-emsalsiz-audi-otomotik-1286367961/detay',
  },
  {
    id: '3',
    sahibindenId: '1286336583',
    title: 'LANSMAN RENK REFLEX GRİ DÜŞÜK KMLİ',
    price: 1099000,
    year: 2021,
    km: 45000,
    brand: 'Honda',
    model: 'Civic',
    imageUrls: [
      "https://i0.shbdn.com/photos/33/65/83/lthmb_128633658302g.avif"
    ],
    listingUrl: 'https://www.sahibinden.com/ilan/vasita-otomobil-honda-lansman-renk-reflex-gri-dusuk-kmli-1286336583/detay',
  },
  {
    id: '4',
    sahibindenId: '1284402663',
    title: 'AĞIR BAKIMLARI YAPILMIŞ OTOMOTİK',
    price: 625000,
    year: 2017,
    km: 95000,
    brand: 'Honda',
    model: 'Jazz',
    imageUrls: [
      "https://i0.shbdn.com/photos/40/26/63/lthmb_1284402663iai.avif"
    ],
    listingUrl: 'https://www.sahibinden.com/ilan/vasita-otomobil-honda-agir-bakimlari-yapilmis-otomotik-1284402663/detay',
  },
];
