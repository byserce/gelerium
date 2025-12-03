'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Car } from '@/lib/types';
import { addCar, updateCar } from '@/lib/crud';

const carSchema = z.object({
  title: z.string().min(5, { message: 'Başlık en az 5 karakter olmalıdır.' }),
  brand: z.string().min(2, { message: 'Marka alanı zorunludur.' }),
  model: z.string().min(1, { message: 'Model alanı zorunludur.' }),
  year: z.coerce.number().int().min(1900, 'Geçerli bir yıl girin.'),
  price: z.coerce.number().int().min(0, 'Fiyat negatif olamaz.'),
  km: z.coerce.number().int().min(0, 'Kilometre negatif olamaz.'),
  imageUrls: z.string().min(1, {message: "En az 1 resim URL'si ekleyin."}),
  listingUrl: z.string().url({ message: 'Geçerli bir URL girin.' }).optional().or(z.literal('')),
  sahibindenId: z.string().optional(),
});

type CarFormValues = z.infer<typeof carSchema>;

interface CarFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  car: Car | null;
}

export default function CarForm({ isOpen, setIsOpen, car }: CarFormProps) {
  const { toast } = useToast();
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      title: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      km: 0,
      imageUrls: '',
      listingUrl: '',
      sahibindenId: '',
    },
  });

  useEffect(() => {
    if (car) {
      form.reset({
        ...car,
        imageUrls: car.imageUrls.join(', '),
      });
    } else {
      form.reset({
        title: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        km: 0,
        imageUrls: '',
        listingUrl: '',
        sahibindenId: '',
      });
    }
  }, [car, form, isOpen]);

  const onSubmit = (data: CarFormValues) => {
    const carData = {
        ...data,
        imageUrls: data.imageUrls.split(',').map(url => url.trim()).filter(url => url),
    };

    try {
      if (car) {
        // Update existing car
        updateCar(car.id, carData);
        toast({ title: 'İlan güncellendi!', description: `${data.title} başarıyla güncellendi.` });
      } else {
        // Add new car
        addCar(carData);
        toast({ title: 'İlan eklendi!', description: `${data.title} başarıyla eklendi.` });
      }
      setIsOpen(false);
    } catch (error) {
       console.error("Failed to save car:", error);
       toast({ variant: 'destructive', title: 'Bir hata oluştu!', description: 'İlan kaydedilemedi.' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{car ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Başlık</FormLabel>
                <FormControl><Input placeholder="örn: Sahibinden temiz aile arabası" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="brand" render={({ field }) => (
              <FormItem>
                <FormLabel>Marka</FormLabel>
                <FormControl><Input placeholder="örn: Volkswagen" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="model" render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl><Input placeholder="örn: Passat" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="year" render={({ field }) => (
              <FormItem>
                <FormLabel>Yıl</FormLabel>
                <FormControl><Input type="number" placeholder="2023" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="price" render={({ field }) => (
              <FormItem>
                <FormLabel>Fiyat (₺)</FormLabel>
                <FormControl><Input type="number" placeholder="1.500.000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="km" render={({ field }) => (
              <FormItem>
                <FormLabel>Kilometre</FormLabel>
                <FormControl><Input type="number" placeholder="50.000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="sahibindenId" render={({ field }) => (
                <FormItem>
                    <FormLabel>Sahibinden ID (Opsiyonel)</FormLabel>
                    <FormControl><Input placeholder="123456789" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="imageUrls" render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Resim URL'leri (Virgülle ayırın)</FormLabel>
                <FormControl><Textarea placeholder="https://site.com/resim1.jpg, https://site.com/resim2.jpg" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="listingUrl" render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>İlan Linki (Opsiyonel)</FormLabel>
                <FormControl><Input placeholder="https://www.sahibinden.com/ilan/..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter className="md:col-span-2 mt-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary">İptal</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
