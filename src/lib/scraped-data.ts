import type { Car } from './types';

// This file simulates the data that would be returned by a web scraper.
// In a real implementation, this data would be fetched live.

export const scrapedCars: Omit<Car, 'id'>[] = [
  {
    title: '2017 VW PASSAT 1.6 TDI COMFORTLİNE DSG CAM TAVAN',
    price: 1385000,
    year: 2017,
    km: 172000,
    brand: 'Volkswagen',
    model: 'Passat',
    imageUrls: [
      "https://images.unsplash.com/photo-1669254572206-2a44dda91757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx3aGl0ZSUyMHNlZGFufGVufDB8fHx8MTc2NDcxNzg0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1533630217389-3a5e4dff5683?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjYXIlMjBpbnRlcmlvcnxlbnwwfHx8fDE3NjQ3NTEyODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1597588561267-7a9507649ab9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNlZGFufGVufDB8fHx8MTc2NDcxNzg0Mnww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    imagePaths: []
  },
  {
    title: '2023 SKODA SUPERB 1.5 TSI PRESTIGE DSG 18 JANT',
    price: 2100000,
    year: 2023,
    km: 15000,
    brand: 'Skoda',
    model: 'Superb',
    imageUrls: [
      "https://images.unsplash.com/photo-1737051484228-939052076f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxncmV5JTIwc2VkYW58ZW58MHx8fHwxNzY0NzUxMjgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1471174617910-3e9c04f58ff5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxjYXIlMjBpbnRlcmlvcnxlbnwwfHx8fDE3NjQ3NTEyODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjYXIlMjBoZWFkbGlnaHRzfGVufDB8fHx8MTc2NDc1MTI4Mnww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    imagePaths: []
  },
  {
    title: '2022 MERCEDES C200 4 MATIC AMG',
    price: 2900000,
    year: 2022,
    km: 30000,
    brand: 'Mercedes-Benz',
    model: 'C200',
    imageUrls: [
      "https://images.unsplash.com/photo-1590874416115-6f3e22b6be2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxzaWx2ZXIlMjBzZWRhbnxlbnwwfHx8fDE3NjQ3NTEyODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1686675762642-e12ad7762971?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxsZWF0aGVyJTIwc2VhdHN8ZW58MHx8fHwxNzY0Njc2MjgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1623564493214-6137dff043ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxhbGxveSUyMHdoZWVsfGVufDB8fHx8MTc2NDc1MTI4Mnww&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    imagePaths: []
  },
  // This listing has a slightly different price to test the AI consistency check
  {
    title: '2023 PEUGEOT 3008 1.5 BLUEHDI ALLURE',
    price: 1849000, // Price changed
    km: 15500, // KM changed
    brand: 'Peugeot',
    model: '3008',
    imageUrls: [
      "https://images.unsplash.com/photo-1684849311731-eb8293657d7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHx3aGl0ZSUyMHN1dnxlbnwwfHx8fDE3NjQ2OTcyMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxmdXR1cmlzdGljJTIwZGFzaGJvYXJkfGVufDB8fHx8MTc2NDc1MTI4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1725745096249-f6e7c160c4be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYXIlMjB0YWlsbGlnaHR8ZW58MHx8fHwxNzY0NzM2NzM4fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    imagePaths: []
  },
];
