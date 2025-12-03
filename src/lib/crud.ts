'use client';

import { collection, doc, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { initializeFirebase } from '@/firebase';
import type { Car } from './types';
import { v4 as uuidv4 } from 'uuid';

const { firestore, storage } = initializeFirebase();
const carsCollection = collection(firestore, 'cars');

type CarFormData = Omit<Car, 'id' | 'imageUrls' | 'imagePaths'>;

const uploadImages = async (files: FileList): Promise<{ urls: string[]; paths: string[] }> => {
  const uploadPromises = Array.from(files).map(async file => {
    const imagePath = `cars/${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, imagePath);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, path: imagePath };
  });

  const results = await Promise.all(uploadPromises);
  const urls = results.map(r => r.url);
  const paths = results.map(r => r.path);
  return { urls, paths };
};

export const addCar = async (carData: CarFormData, files: FileList) => {
  const { urls: imageUrls, paths: imagePaths } = await uploadImages(files);
  const newCarData = {
    ...carData,
    imageUrls,
    imagePaths,
  };
  // Use addDoc for auto-generated ID
  return addDoc(carsCollection, newCarData);
};

export const updateCar = async (carId: string, carData: CarFormData & { existingImageUrls?: string[] }, newFiles?: FileList) => {
  const carDocRef = doc(firestore, 'cars', carId);
  const carDoc = await getDoc(carDocRef);
  const existingCarData = carDoc.data() as Car | undefined;

  let newImageUrls: string[] = [];
  let newImagePaths: string[] = [];

  // Upload new images if any
  if (newFiles && newFiles.length > 0) {
    const { urls, paths } = await uploadImages(newFiles);
    newImageUrls = urls;
    newImagePaths = paths;
  }
  
  // Handle deletions: Compare existing paths with the ones sent from the form
  const existingPaths = existingCarData?.imagePaths || [];
  const keptUrls = carData.existingImageUrls || [];
  
  const urlsToDelete = (existingCarData?.imageUrls || []).filter(url => !keptUrls.includes(url));
  const pathsToDelete = existingPaths.filter((path, index) => urlsToDelete.includes(existingCarData?.imageUrls[index] || ''));

  // Delete images from Storage
  if (pathsToDelete.length > 0) {
      await Promise.all(pathsToDelete.map(path => {
          const imageRef = ref(storage, path);
          return deleteObject(imageRef).catch(err => console.error(`Failed to delete ${path}`, err)); // Log error but don't block
      }));
  }

  const updatedCarData = {
    ...carData,
    imageUrls: [...keptUrls, ...newImageUrls],
    imagePaths: [...(existingCarData?.imagePaths.filter(p => !pathsToDelete.includes(p)) || []), ...newImagePaths],
  };
  
  // Remove the temporary fields before updating the document
  delete (updatedCarData as any).existingImageUrls;
  delete (updatedCarData as any).images;

  return updateDoc(carDocRef, updatedCarData);
};
