'use client';

import { collection, doc } from 'firebase/firestore';
import { initializeFirebase, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import type { Car } from './types';

// Initialize Firebase
const { firestore } = initializeFirebase();
const carsCollection = collection(firestore, 'cars');

type CarInput = Omit<Car, 'id' | 'sahibindenId' | 'listingUrl'>;

export const addCar = (carData: CarInput) => {
  addDocumentNonBlocking(carsCollection, carData);
};

export const updateCar = (carId: string, carData: Partial<CarInput>) => {
  const carDoc = doc(firestore, 'cars', carId);
  updateDocumentNonBlocking(carDoc, carData);
};
