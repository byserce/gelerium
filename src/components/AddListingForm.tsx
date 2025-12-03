'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import NextImage from 'next/image';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const listingSchema = z.object({
  title: z.string().min(10, 'Başlık en az 10 karakter olmalıdır.'),
  brand: z.string().min(2, 'Marka alanı zorunludur.'),
  model: z.string().min(1, 'Model alanı zorunludur.'),
  year: z.coerce.number().int().min(1900, 'Geçerli bir yıl girin.').max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0, 'Fiyat 0\'dan büyük olmalıdır.'),
  kilometer: z.coerce.number().int().min(0, 'Kilometre negatif olamaz.'),
  images: z.custom<FileList>()
    .refine((files) => files && files.length > 0, 'En az bir resim yüklemelisiniz.')
    .refine((files) => Array.from(files).every(file => file.size <= MAX_FILE_SIZE), `Her dosya en fazla 10MB olabilir.`)
    .refine((files) => Array.from(files).every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), 'Sadece .jpg, .jpeg, .png, ve .webp formatları desteklenmektedir.'),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export default function AddListingForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
  });

  const imageFiles = watch('images');

  React.useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      const newPreviews = Array.from(imageFiles).map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);

      return () => {
        newPreviews.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
      setImagePreviews([]);
    }
  }, [imageFiles]);


  const onSubmit: SubmitHandler<ListingFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const imageUrls: string[] = [];
      
      // 1. Upload images to Supabase Storage
      for (const file of Array.from(data.images)) {
        const fileExtension = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `vehicle-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('vehicle-images')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Resim yüklenemedi: ${uploadError.message}`);
        }

        // 2. Get public URLs of uploaded images
        const { data: urlData } = supabase.storage
          .from('vehicle-images')
          .getPublicUrl(filePath);

        if (!urlData) {
            throw new Error('Resim URL\'si alınamadı.');
        }
        
        imageUrls.push(urlData.publicUrl);
      }

      // 3. Insert data into 'listings' table
      const { error: insertError } = await supabase.from('listings').insert([
        {
          title: data.title,
          brand: data.brand,
          model: data.model,
          year: data.year,
          price: data.price,
          kilometer: data.kilometer,
          image_urls: imageUrls,
        },
      ]);

      if (insertError) {
        throw new Error(`İlan kaydedilemedi: ${insertError.message}`);
      }

      toast({
        title: 'Başarılı!',
        description: 'Yeni ilanınız başarıyla eklendi.',
      });
      reset();
      setImagePreviews([]);

    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Hata!',
        description: error.message || 'Bir sorun oluştu. Lütfen tekrar deneyin.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
    const removeNewImage = (indexToRemove: number) => {
    const currentFiles = Array.from(watch('images') || []);
    const newFiles = currentFiles.filter((_, index) => index !== indexToRemove);
    
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));

    setValue('images', dataTransfer.files, { shouldValidate: true });
  };


  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Yeni Araç İlanı Ekle</CardTitle>
        <CardDescription>Araç bilgilerinizi girerek yeni bir ilan oluşturun.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="title">İlan Başlığı</Label>
            <Input id="title" {...register('title')} placeholder="Örn: 2022 Model, Düşük KM, Hatasız" />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="brand">Marka</Label>
              <Input id="brand" {...register('brand')} placeholder="Örn: Volkswagen" />
              {errors.brand && <p className="text-sm text-red-500">{errors.brand.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" {...register('model')} placeholder="Örn: Passat" />
              {errors.model && <p className="text-sm text-red-500">{errors.model.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="year">Yıl</Label>
              <Input id="year" type="number" {...register('year')} placeholder="2024" />
              {errors.year && <p className="text-sm text-red-500">{errors.year.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Fiyat (₺)</Label>
              <Input id="price" type="number" {...register('price')} placeholder="1.500.000" />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="kilometer">Kilometre</Label>
              <Input id="kilometer" type="number" {...register('kilometer')} placeholder="50.000" />
              {errors.kilometer && <p className="text-sm text-red-500">{errors.kilometer.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Resimler</Label>
             <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Yüklemek için tıklayın</span> veya sürükleyip bırakın</p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 10MB)</p>
                </div>
                <Input 
                    {...register('images')}
                    id="images"
                    type="file" 
                    multiple
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                />
            </div>
            {errors.images && <p className="text-sm text-red-500">{errors.images.message as string}</p>}
          </div>

            {imagePreviews.length > 0 && (
                <div className='space-y-2'>
                     <p className='text-sm font-medium text-muted-foreground'>Seçilen Resimler ({imagePreviews.length} adet)</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {imagePreviews.map((src, index) => (
                            <div key={index} className="relative group aspect-square">
                                <NextImage src={src} alt={`Önizleme ${index}`} fill className="object-cover rounded-md" />
                                 <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-75 group-hover:opacity-100 transition-opacity">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}


          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'İlan Ekleniyor...' : 'İlanı Ekle'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
