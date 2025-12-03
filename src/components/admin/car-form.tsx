'use client';

import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, X } from 'lucide-react';
import NextImage from 'next/image';
import type { Car } from '@/lib/types';
import { addCar, updateCar } from '@/lib/crud';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];

const expertisePartSchema = z.object({
  part: z.string(),
  status: z.string(),
});

const baseSchema = z.object({
  title: z.string().min(10, 'Başlık en az 10 karakter olmalıdır.'),
  brand: z.string().min(2, 'Marka alanı zorunludur.'),
  model: z.string().min(1, 'Model alanı zorunludur.'),
  year: z.coerce.number().int().min(1900, 'Geçerli bir yıl girin.').max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0, 'Fiyat 0\'dan büyük olmalıdır.'),
  km: z.coerce.number().int().min(0, 'Kilometre negatif olamaz.'),
  description: z.string().optional(),
  expertise_report: z.array(expertisePartSchema).optional(),
  existingImageUrls: z.array(z.string()).optional(),
  existingImagePaths: z.array(z.string()).optional(),
});

const imageSchema = z.any()
    .refine((files): files is FileList => files instanceof FileList, 'Dosya listesi bekleniyor.')
    .refine((files) => files.length > 0, 'En az bir resim yüklemelisiniz.')
    .refine((files) => Array.from(files).every(file => file.size <= MAX_FILE_SIZE), `Dosya boyutu 50MB'ı geçemez.`)
    .refine((files) => Array.from(files).every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), 'Sadece .jpg, .jpeg, .png, .webp ve .avif formatları desteklenmektedir.');

const createCarSchema = baseSchema.extend({
  images: imageSchema,
});

const updateCarSchema = baseSchema.extend({
  images: imageSchema.optional(),
}).superRefine((data, ctx) => {
    if ((!data.images || data.images.length === 0) && (!data.existingImageUrls || data.existingImageUrls.length === 0)) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['images'],
            message: 'En az bir resim gereklidir.',
        });
    }
});


type CarFormValues = z.infer<typeof baseSchema & { images?: FileList | null, id?: string }>;

interface CarFormProps {
  car?: Car | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const carParts = [
    'Kaput', 'Tavan', 'Bagaj', 
    'Sağ Ön Çamurluk', 'Sağ Ön Kapı', 'Sağ Arka Kapı', 'Sağ Arka Çamurluk',
    'Sol Ön Çamurluk', 'Sol Ön Kapı', 'Sol Arka Kapı', 'Sol Arka Çamurluk',
    'Ön Tampon', 'Arka Tampon'
];

export default function CarForm({ car, onSuccess, onCancel }: CarFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<{ url: string, path: string }[]>(
    car?.imageUrls?.map((url, i) => ({ url, path: car.imagePaths[i] || '' })) || []
  );
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const isEditMode = !!car;

  const defaultExpertise = carParts.map(part => ({
      part,
      status: car?.expertise_report?.[part] || 'Orijinal'
  }));

  const { register, handleSubmit, formState: { errors }, watch, setValue, control, reset } = useForm<CarFormValues>({
    resolver: zodResolver(isEditMode ? updateCarSchema : createCarSchema),
    defaultValues: car ? {
      ...car,
      km: car.km || 0,
      price: car.price || 0,
      year: car.year || new Date().getFullYear(),
      description: car.description || '',
      expertise_report: defaultExpertise,
      existingImageUrls: car.imageUrls || [],
      existingImagePaths: car.imagePaths || [],
    } : {
      title: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      km: 0,
      description: '',
      expertise_report: carParts.map(part => ({ part, status: 'Orijinal' })),
      existingImageUrls: [],
      existingImagePaths: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "expertise_report"
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
        const expertiseObject = data.expertise_report?.reduce((acc, item) => {
            acc[item.part] = item.status;
            return acc;
        }, {} as Record<string, string>);

      const finalData = { ...data, id: car?.id, expertise_report: expertiseObject };
      
      if (isEditMode) {
        await updateCar(finalData, data.images ? Array.from(data.images) : [], imagesToRemove);
      } else {
        if (!finalData.images || finalData.images.length === 0) {
           throw new Error("Yeni ilanlar için en az bir resim gereklidir.");
        }
        await addCar(finalData, Array.from(finalData.images));
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

  const removeExistingImage = (urlToRemove: string) => {
    const imagePathToRemove = existingImages.find(img => img.url === urlToRemove)?.path;
    if(imagePathToRemove) {
      setImagesToRemove(prev => [...prev, imagePathToRemove]);
    }
    setExistingImages(prev => prev.filter(({url}) => url !== urlToRemove));
    const currentExistingUrls = watch('existingImageUrls') || [];
    setValue('existingImageUrls', currentExistingUrls.filter(url => url !== urlToRemove), { shouldValidate: true });
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
          <Input id="kilometer" type="number" {...register('km')} placeholder="50.000" />
          {errors.km && <p className="text-sm text-red-500">{errors.km.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea id="description" {...register('description')} placeholder="Aracın durumu, özellikleri, ek bilgiler..." rows={4} />
      </div>

      <div className="space-y-2">
        <Label>Ekspertiz Raporu</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 rounded-md border p-4">
            {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-2 items-center gap-2">
                     <Label htmlFor={`expertise_report.${index}.status`} className="text-sm text-muted-foreground">{field.part}</Label>
                     <Controller
                        control={control}
                        name={`expertise_report.${index}.status`}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id={`expertise_report.${index}.status`}>
                                    <SelectValue placeholder="Durum" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Orijinal">Orijinal</SelectItem>
                                    <SelectItem value="Boyalı">Boyalı</SelectItem>
                                    <SelectItem value="Değişen">Değişen</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            ))}
        </div>
      </div>
      
      {isEditMode && existingImages.length > 0 && (
         <div className="space-y-2">
           <Label>Mevcut Resimler</Label>
           <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
             {existingImages.map(({url}) => (
               <div key={url} className="relative group aspect-square">
                 <NextImage src={url} alt={`Mevcut resim`} fill className="object-cover rounded-md" />
                 <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-75 group-hover:opacity-100 transition-opacity">
                   <X className="h-4 w-4" />
                 </button>
               </div>
             ))}
           </div>
         </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="images">{isEditMode ? 'Yeni Resimler Ekle' : 'Resimler'}</Label>
        <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Yüklemek için tıklayın</span> veya sürükleyip bırakın</p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP, AVIF (MAX. 50MB)</p>
          </div>
          <Controller
            name="images"
            control={control}
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <Input
                id="images"
                type="file"
                multiple
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => onChange(e.target.files)}
                onBlur={onBlur}
                name={name}
                ref={ref}
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
