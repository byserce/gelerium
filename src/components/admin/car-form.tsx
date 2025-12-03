'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, X, Trash2 } from 'lucide-react';
import NextImage from 'next/image';
import type { Car } from '@/lib/types';
import { addCar, updateCar } from '@/lib/crud';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];

const baseSchema = z.object({
  title: z.string().min(10, 'Başlık en az 10 karakter olmalıdır.'),
  brand: z.string().min(2, 'Marka alanı zorunludur.'),
  model: z.string().min(1, 'Model alanı zorunludur.'),
  year: z.coerce.number().int().min(1900, 'Geçerli bir yıl girin.').max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0, 'Fiyat 0\'dan büyük olmalıdır.'),
  km: z.coerce.number().int().min(0, 'Kilometre negatif olamaz.'),
  existingImageUrls: z.array(z.string()).optional(),
});

const imageSchema = z.any()
  .refine((files: FileList | null | undefined) => files === undefined || files === null || files.length > 0, {
    message: 'En az bir resim yüklemelisiniz.',
  })
  .refine((files: FileList | null) => Array.from(files ?? []).every(file => file.size <= MAX_FILE_SIZE), `Dosya boyutu 50MB'ı geçemez.`)
  .refine((files: FileList | null) => Array.from(files ?? []).every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), 'Sadece .jpg, .jpeg, .png, .webp ve .avif formatları desteklenmektedir.');

const createCarSchema = baseSchema.extend({
  images: imageSchema.refine((files: FileList | null) => files && files.length > 0, {
    message: "Yeni ilanlar için en az bir resim gereklidir."
  })
});

const updateCarSchema = baseSchema.extend({
  images: imageSchema.optional(),
});

type CarFormValues = z.infer<typeof baseSchema & { images?: FileList | null, id?: string }>;

interface CarFormProps {
  car?: Car | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CarForm({ car, onSuccess, onCancel }: CarFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>(car?.imageUrls || []);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const isEditMode = !!car;

  const { register, handleSubmit, formState: { errors }, watch, setValue, control, reset } = useForm<CarFormValues>({
    resolver: zodResolver(isEditMode ? updateCarSchema : createCarSchema),
    defaultValues: {
      ...car,
      existingImageUrls: car?.imageUrls || [],
    } || {},
  });
  
  const newImageFiles = watch('images');

  React.useEffect(() => {
    if (newImageFiles && newImageFiles.length > 0) {
        const urls = Array.from(newImageFiles).map(file => URL.createObjectURL(file));
        setNewImagePreviews(urls);
        return () => {
            urls.forEach(url => URL.revokeObjectURL(url));
        };
    } else {
        setNewImagePreviews([]);
    }
  }, [newImageFiles]);


  const onSubmit: SubmitHandler<CarFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const finalData = { ...data, id: car?.id };
      
      if (isEditMode) {
        await updateCar(finalData, imagesToRemove);
      } else {
        await addCar(finalData);
      }

      toast({
        title: 'Başarılı!',
        description: `İlan başarıyla ${isEditMode ? 'güncellendi' : 'eklendi'}.`,
      });
      reset();
      onSuccess();

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

  const removeExistingImage = (imageUrl: string, index: number) => {
    setImagesToRemove(prev => [...prev, imageUrl]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    const currentExisting = watch('existingImageUrls') || [];
    setValue('existingImageUrls', currentExisting.filter(url => url !== imageUrl), { shouldValidate: true });
  };
  
  const removeNewImage = (indexToRemove: number) => {
    const currentFiles = Array.from(watch('images') || []);
    const newFiles = currentFiles.filter((_, index) => index !== indexToRemove);
    
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));

    setValue('images', dataTransfer.files, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto p-1 pr-4">
      <div className="space-y-2">
        <Label htmlFor="title">İlan Başlığı</Label>
        <Input id="title" {...register('title')} placeholder="Örn: 2022 Model, Düşük KM, Hatasız" />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          {errors.km && <p className="text-sm text-red-500">{errors.km.message}</p>}
        </div>
      </div>
      
      {isEditMode && imagePreviews.length > 0 && (
         <div className="space-y-2">
           <Label>Mevcut Resimler</Label>
           <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
             {imagePreviews.map((url, index) => (
               <div key={url} className="relative group aspect-square">
                 <NextImage src={url} alt={`Mevcut resim ${index}`} fill className="object-cover rounded-md" />
                 <button type="button" onClick={() => removeExistingImage(url, index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-75 group-hover:opacity-100 transition-opacity">
                   <X className="h-4 w-4" />
                 </button>
               </div>
             ))}
           </div>
         </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="images">Yeni Resimler Yükle</Label>
        <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Yüklemek için tıklayın</span> veya sürükleyip bırakın</p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP, AVIF (MAX. 50MB)</p>
          </div>
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <Input
                id="images"
                type="file"
                multiple
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => field.onChange(e.target.files)}
              />
            )}
          />
        </div>
        {errors.images && <p className="text-sm text-red-500">{errors.images.message as string}</p>}
      </div>

       {newImagePreviews.length > 0 && (
          <div className='space-y-2'>
              <p className='text-sm font-medium text-muted-foreground'>Yeni Seçilen Resimler ({newImagePreviews.length} adet)</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {newImagePreviews.map((src, index) => (
                      <div key={src} className="relative group aspect-square">
                          <NextImage src={src} alt={`Önizleme ${index}`} fill className="object-cover rounded-md" />
                           <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-75 group-hover:opacity-100 transition-opacity">
                              <X className="h-4 w-4" />
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (isEditMode ? 'Güncelleniyor...' : 'Kaydediliyor...') : (isEditMode ? 'Değişiklikleri Kaydet' : 'İlanı Ekle')}
        </Button>
      </div>
    </form>
  );
}
