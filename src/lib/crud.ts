'use client';

import { getSupabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

// Helper function to upload images and get their URLs and paths
async function uploadImages(files: File[]) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase client is not available");

    const imageUrls: string[] = [];
    const imagePaths: string[] = [];

    for (const file of Array.from(files)) {
        const fileExtension = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('vehicle-images')
            .upload(filePath, file);

        if (uploadError) {
            throw new Error(`Resim yüklenemedi: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
            .from('vehicle-images')
            .getPublicUrl(filePath);

        if (!urlData) {
            throw new Error('Resim URL\'si alınamadı.');
        }

        imageUrls.push(urlData.publicUrl);
        imagePaths.push(filePath);
    }

    return { imageUrls, imagePaths };
}


// Adds a new car to the 'listings' table
export async function addCar(carData: any, images: File[]) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase client is not available");

    const { imageUrls } = await uploadImages(images);

    const { data, error } = await supabase
        .from('listings')
        .insert([
            {
                title: carData.title,
                brand: carData.brand,
                model: carData.model,
                year: Number(carData.year),
                price: Number(carData.price),
                kilometer: Number(carData.km),
                image_urls: imageUrls,
                description: carData.description,
                expertise_report: carData.expertise_report,
            }
        ])
        .select();

    if (error) {
        console.error('Supabase insert error:', JSON.stringify(error, null, 2));
        throw new Error(`İlan kaydedilemedi: ${error.message}`);
    }
    return data;
}


// Updates an existing car in the 'listings' table
export async function updateCar(carData: any, newImages: File[], imagesToRemove: string[]) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase client is not available");
    
    let newImageUrls: string[] = [];

    // 1. Upload new images if any
    if (newImages && newImages.length > 0) {
        const { imageUrls } = await uploadImages(newImages);
        newImageUrls = imageUrls;
    }

    // 2. Remove images from storage if marked for deletion
    if (imagesToRemove.length > 0) {
        const pathsToRemove = imagesToRemove.map(url => {
            const urlParts = url.split('/');
            // Assumes the path is the last part after the 'public' segment in the bucket
            const publicIndex = urlParts.indexOf('public');
            return urlParts.slice(publicIndex + 1).join('/');
        });
        
        const { error: storageError } = await supabase.storage.from('vehicle-images').remove(pathsToRemove);
        if (storageError) {
            // Log error but don't block the update
            console.error("Error removing images from storage:", storageError);
        }
    }
    
    // Combine old and new image URLs
    const existingUrls = carData.existingImageUrls || [];
    const finalImageUrls = existingUrls.filter((url: string) => !imagesToRemove.includes(url)).concat(newImageUrls);

    const dataToUpdate = {
        title: carData.title,
        brand: carData.brand,
        model: carData.model,
        year: Number(carData.year),
        price: Number(carData.price),
        kilometer: Number(carData.km),
        image_urls: finalImageUrls,
        description: carData.description,
        expertise_report: carData.expertise_report,
    };

    const { error } = await supabase
        .from('listings')
        .update(dataToUpdate)
        .eq('id', carData.id);

    if (error) {
        console.error('Supabase update error:', JSON.stringify(error, null, 2));
        throw new Error(`İlan güncellenemedi: ${error.message}`);
    }
}


// Deletes a document from a specified table
export async function deleteDoc(table: string, id: string) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase client is not available");
    
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
        throw new Error(`Failed to delete document: ${error.message}`);
    }
}
