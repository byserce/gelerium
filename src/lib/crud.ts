import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

// Helper function to upload images and get their URLs and paths
async function uploadImages(files: FileList) {
    const imageUrls: string[] = [];
    const imagePaths: string[] = [];

    for (const file of Array.from(files)) {
        const fileExtension = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `public/${fileName}`; // Changed to public to match new setup if needed

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
export async function addCar(data: any) {
    let newImageUrls: string[] = [];
    let newImagePaths: string[] = [];

    // Upload new images if they exist
    if (data.images && data.images.length > 0) {
        const { imageUrls, imagePaths } = await uploadImages(data.images);
        newImageUrls = imageUrls;
        newImagePaths = imagePaths;
    }

    // Prepare data for insertion
    const carData = {
        title: data.title,
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        kilometer: data.km,
        image_urls: newImageUrls,
        image_paths: newImagePaths,
    };

    const { error } = await supabase.from('listings').insert([carData]);

    if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(`İlan kaydedilemedi: ${error.message}`);
    }
}


// Updates an existing car in the 'listings' table
export async function updateCar(data: any, imagesToRemove: string[], existingPaths: string[]) {
    let newImageUrls: string[] = [];
    let newImagePaths: string[] = [];

    // 1. Upload new images if any
    if (data.images && data.images.length > 0) {
        const { imageUrls, imagePaths } = await uploadImages(data.images);
        newImageUrls = imageUrls;
        newImagePaths = imagePaths;
    }

    // 2. Remove images from storage if marked for deletion
    if (imagesToRemove.length > 0) {
        // We need to get the full path from the URL
         const pathsToRemove = existingPaths.filter(path => {
            const publicURL = supabase.storage.from('vehicle-images').getPublicUrl(path).data.publicUrl;
            return imagesToRemove.includes(publicURL);
        });

        if (pathsToRemove.length > 0) {
            const { error: storageError } = await supabase.storage.from('vehicle-images').remove(pathsToRemove);
            if (storageError) {
                console.error("Error removing images from storage:", storageError);
                // Decide if you want to throw an error or just log it
                // For now, we'll log and continue
            }
        }
    }

    // 3. Prepare the final data for the database update
    const finalImageUrls = [...(data.existingImageUrls || []), ...newImageUrls];
    const remainingPaths = existingPaths.filter(path => {
        const publicURL = supabase.storage.from('vehicle-images').getPublicUrl(path).data.publicUrl;
        return data.existingImageUrls.includes(publicURL);
    });
    const finalImagePaths = [...remainingPaths, ...newImagePaths];

    const carData = {
        title: data.title,
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        kilometer: data.km,
        image_urls: finalImageUrls,
        image_paths: finalImagePaths,
    };

    const { error } = await supabase
        .from('listings')
        .update(carData)
        .eq('id', data.id);

    if (error) {
        console.error('Supabase update error:', error);
        throw new Error(`İlan güncellenemedi: ${error.message}`);
    }
}

// Deletes a document from a specified table
export async function deleteDoc(table: string, id: string) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
        throw new Error(`Failed to delete document: ${error.message}`);
    }
}