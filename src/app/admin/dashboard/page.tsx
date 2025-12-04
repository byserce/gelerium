'use client';

import React, { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import type { Car } from '@/lib/types';
import CarForm from '@/components/admin/car-form';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { deleteDoc } from '@/lib/crud';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SahibindenImport from '@/components/admin/SahibindenImport';

export default function AdminDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const supabase = getSupabase();

  const fetchCars = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cars:', error);
      toast({
        variant: 'destructive',
        title: 'Hata!',
        description: 'Araçlar yüklenirken bir sorun oluştu.'
      });
      setCars([]);
    } else if (data) {
       const formattedData: Car[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          brand: item.brand,
          model: item.model,
          year: item.year,
          price: item.price,
          km: item.kilometer,
          imageUrls: item.image_urls || [],
          description: item.description,
          expertise_report: item.expertise_report,
          source: 'internal'
        }));
      setCars(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, [supabase]);

  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCar(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (car: Car) => {
    if (!car.id || !supabase) return;
    try {
      // Delete associated images from storage first
      if (car.imageUrls && car.imageUrls.length > 0) {
         const pathsToRemove = car.imageUrls.map(url => {
            const urlParts = url.split('/');
            // Assumes the path is the last part after the 'public' segment in the bucket
            const publicIndex = urlParts.indexOf('public');
            if (publicIndex === -1 || publicIndex + 1 >= urlParts.length) return '';
            return urlParts.slice(publicIndex + 1).join('/');
        }).filter(Boolean); // Filter out any empty strings from failed parsing

        if (pathsToRemove.length > 0) {
            const { error: storageError } = await supabase.storage.from('vehicle-images').remove(pathsToRemove);
            if (storageError) {
              // Log the error but proceed to delete the DB record
              console.error('Error deleting images from storage:', storageError);
               toast({
                variant: 'destructive',
                title: 'Depolama Hatası',
                description: `İlan resimleri silinemedi, ancak ilan veritabanından silinecektir: ${storageError.message}`,
              });
            }
        }
      }

      // Then delete the document from the database
      await deleteDoc('listings', car.id);

      toast({
        title: 'Başarılı!',
        description: `"${car.title}" başlıklı ilan silindi.`,
      });
      fetchCars(); // Refresh the list
    } catch (error: any) {
      console.error('Failed to delete car', error);
      toast({
        variant: 'destructive',
        title: 'Silme Başarısız!',
        description: error.message || 'İlan silinirken bir hata oluştu.',
      });
    }
  };

  const onFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedCar(null);
    fetchCars();
  };
  
  const onFormCancel = () => {
    setIsFormOpen(false);
    setSelectedCar(null);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Yönetim Paneli</h1>
      </div>

      <Tabs defaultValue="my-listings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-listings">İlanlarım</TabsTrigger>
          <TabsTrigger value="import">Sahibinden İçe Aktar</TabsTrigger>
        </TabsList>
        <TabsContent value="my-listings">
            <div className="flex justify-end items-center my-4">
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Yeni İlan Ekle
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                    <DialogTitle>{selectedCar ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}</DialogTitle>
                    </DialogHeader>
                    <CarForm
                    car={selectedCar}
                    onSuccess={onFormSuccess}
                    onCancel={onFormCancel}
                    />
                </DialogContent>
                </Dialog>
            </div>
            <div className="bg-card p-4 rounded-lg border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[80px]">Resim</TableHead>
                    <TableHead>Başlık</TableHead>
                    <TableHead>Marka</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Yıl</TableHead>
                    <TableHead>Fiyat</TableHead>
                    <TableHead className="text-right w-[120px]">İşlemler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                        <TableCell><Skeleton className="h-12 w-16 rounded-md" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
                        </TableRow>
                    ))
                    ) : cars.length > 0 ? (
                    cars.map((car) => (
                        <TableRow key={car.id}>
                        <TableCell>
                            {car.imageUrls && car.imageUrls.length > 0 ? (
                            <img src={car.imageUrls[0]} alt={car.title} className="h-12 w-16 object-cover rounded-md" />
                            ) : (
                            <div className="h-12 w-16 rounded-md bg-muted flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            )}
                        </TableCell>
                        <TableCell className="font-medium">{car.title}</TableCell>
                        <TableCell>{car.brand}</TableCell>
                        <TableCell>{car.model}</TableCell>
                        <TableCell>{car.year}</TableCell>
                        <TableCell>{formatPrice(car.price)}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(car)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                </DialogTrigger>
                                <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Silme Onayı</DialogTitle>
                                    <DialogDescription>
                                    "{car.title}" ilanını kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                    <Button variant="outline">İptal</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                    <Button variant="destructive" onClick={() => handleDelete(car)}>Evet, Sil</Button>
                                    </DialogClose>
                                </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            </div>
                        </TableCell>
                        </TableRow>
                    ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                Henüz hiç ilan eklenmemiş.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </TabsContent>
        <TabsContent value="import">
            <div className="pt-6">
                <SahibindenImport />
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
