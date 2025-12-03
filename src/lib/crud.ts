'use client';

import { collection, doc, addDoc, updateDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import type { Car } from './types';

// Initialize Firebase
const { firestore } = initializeFirebase();
const carsCollection = collection(firestore, 'cars');

type CarInput = Omit<Car, 'id'>;

export const addCar = async (carData: CarInput) => {
  addDocumentNonBlocking(carsCollection, carData);
};

export const updateCar = async (carId: string, carData: Partial<CarInput>) => {
  const carDoc = doc(firestore, 'cars', carId);
  updateDocumentNonBlocking(carDoc, carData);
};
