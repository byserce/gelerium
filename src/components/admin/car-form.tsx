'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Car } from '@/lib/types';
import { addCar, updateCar } from '@/lib/crud';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];

const carSchema = z.object({
  title: z.string().min(5, { message: 'Başlık en az 5 karakter olmalıdır.' }),
  brand: z.string().min(2, { message: 'Marka alanı zorunludur.' }),
  model: z.string().min(1, { message: 'Model alanı zorunludur.' }),
  year: z.coerce.number().int().min(1900, 'Geçerli bir yıl girin.'),
  price: z.coerce.number().int().min(0, 'Fiyat negatif olamaz.'),
  km: z.coerce.number().int().min(0, 'Kilometre negatif olamaz.'),
  images: z.any()
    .refine((files: FileList | null) => files !== null && files.length > 0, 'En az bir resim yüklemelisiniz.')
    .refine((files: FileList | null) => Array.from(files ?? []).every(file => file.size <= MAX_FILE_SIZE), `Dosya boyutu 50MB'ı geçemez.`)
    .refine((files: FileList | null) => Array.from(files ?? []).every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), 'Sadece .jpg, .jpeg, .png, .webp ve .avif formatları desteklenmektedir.'),
  existingImageUrls: z.array(z.string()).optional(),
});

type CarFormValues = z.infer<typeof carSchema>;

interface CarFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  car: Car | null;
}

export default function CarForm({ isOpen, setIsOpen, car }: CarFormProps) {
  const { toast } = useToast();
  
  const formSchemaForEdit = carSchema.extend({
      images: carSchema.shape.images.optional(),
  });

  const form = useForm<CarFormValues>({
    resolver: zodResolver(car ? formSchemaForEdit : carSchema), 
    defaultValues: {
      title: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      km: 0,
      images: undefined,
      existingImageUrls: [],
    },
  });

  const { watch, setValue, control } = form;
  const selectedFiles = watch('images');
  const existingImages = watch('existingImageUrls');

  React.useEffect(() => {
    if (isOpen) {
      if (car) {
        form.reset({
          title: car.title,
          brand: car.brand,
          model: car.model,
          year: car.year,
          price: car.price,
          km: car.km,
          images: undefined, // Reset file input
          existingImageUrls: car.imageUrls || [],
        });
      } else {
        form.reset({
          title: '',
          brand: '',
          model: '',
          year: new Date().getFullYear(),
          price: 0,
          km: 0,
          images: undefined,
          existingImageUrls: [],
        });
      }
    }
  }, [car, form, isOpen]);

  const onSubmit = async (data: CarFormValues) => {
    form.clearErrors(); // Clear previous errors
    
    try {
      if (car) {
        // Update existing car
        await updateCar(car.id, data, data.images);
        toast({ title: 'İlan güncellendi!', description: `${data.title} başarıyla güncellendi.` });
      } else {
        // Add new car
        if (!data.images) {
            form.setError("images", { message: "Lütfen resim ekleyin."})
            return;
        }
        await addCar(data, data.images);
        toast({ title: 'İlan eklendi!', description: `${data.title} başarıyla eklendi.` });
      }
      setIsOpen(false);
    } catch (error) {
       console.error("Failed to save car:", error);
       toast({ variant: 'destructive', title: 'Bir hata oluştu!', description: 'İlan kaydedilemedi.' });
    }
  };
  
  const removeExistingImage = (url: string) => {
    setValue('existingImageUrls', (existingImages || []).filter(i => i !== url), { shouldValidate: true });
  }

  const removeNewImage = (fileToRemove: File) => {
    const currentFiles = Array.from(watch('images') || []);
    const newFiles = currentFiles.filter(file => file !== fileToRemove);
    
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));

    setValue('images', dataTransfer.files, { shouldValidate: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px] max-h-[90dvh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{car ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}</DialogTitle>
          <DialogDescription>
            Galerinize ait bir aracı vitrine ekleyin. Bilgisayarınızdan resim seçerek yükleyebilirsiniz.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-6 -mr-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <FormField control={control} name="title" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>İlan Başlığı</FormLabel>
                  <FormControl><Input placeholder="örn: Sahibinden temiz aile arabası" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="brand" render={({ field }) => (
                <FormItem>
                  <FormLabel>Marka</FormLabel>
                  <FormControl><Input placeholder="örn: Volkswagen" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="model" render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl><Input placeholder="örn: Passat" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="year" render={({ field }) => (
                <FormItem>
                  <FormLabel>Yıl</FormLabel>
                  <FormControl><Input type="number" placeholder="2023" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Fiyat (₺)</FormLabel>
                  <FormControl><Input type="number" placeholder="1.500.000" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
               <FormField control={control} name="km" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kilometre</FormLabel>
                  <FormControl><Input type="number" placeholder="50.000" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField
                control={control}
                name="images"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Resimler</FormLabel>
                    <FormControl>
                        <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Yüklemek için tıklayın</span> veya sürükleyip bırakın</p>
                                <p className="text-xs text-gray-500">PNG, JPG, WEBP, AVIF (MAX. 50MB)</p>
                            </div>
                            <Input 
                                {...rest}
                                type="file" 
                                multiple
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                onChange={(e) => onChange(e.target.files)}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                     {car && existingImages && existingImages.length > 0 && (
                        <div className='space-y-2'>
                            <p className='text-sm font-medium text-muted-foreground'>Mevcut Resimler</p>
                             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {existingImages.map(url => (
                                    <div key={url} className="relative group aspect-square">
                                        <Image src={url} alt="Mevcut resim" fill className="object-cover rounded-md" />
                                        <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-75 group-hover:opacity-100 transition-opacity">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedFiles && selectedFiles.length > 0 && (
                        <div className='space-y-2'>
                             <p className='text-sm font-medium text-muted-foreground'>Yeni Seçilen Resimler</p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {Array.from(selectedFiles).map((file, index) => (
                                    <div key={index} className="relative group aspect-square">
                                        <Image src={URL.createObjectURL(file)} alt={`Preview ${index}`} fill className="object-cover rounded-md" />
                                         <button type="button" onClick={() => removeNewImage(file)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-75 group-hover:opacity-100 transition-opacity">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                  </FormItem>
                )}
              />

              <DialogFooter className="md:col-span-2 mt-4 pt-4 border-t sticky bottom-0 bg-card">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">İptal</Button>
                </DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
