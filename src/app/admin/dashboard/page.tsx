'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, LogOut } from 'lucide-react';
import CarForm from '@/components/admin/car-form';
import type { Car } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const carsCollection = useMemoFirebase(() => collection(firestore, 'cars'), [firestore]);
  const { data: cars, isLoading } = useCollection<Omit<Car, 'id'>>(carsCollection);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [deletingCar, setDeletingCar] = useState<Car | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/admin/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/admin/login');
  };

  const handleAddNew = () => {
    setEditingCar(null);
    setIsFormOpen(true);
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingCar || !firestore) return;
    const carDocRef = doc(firestore, 'cars', deletingCar.id);
    deleteDocumentNonBlocking(carDocRef);
    toast({ title: 'İlan silindi!', description: `${deletingCar.title} başarıyla silindi.` });
    setDeletingCar(null);
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Yönetim Paneli</h1>
        <div className="flex items-center gap-4">
          <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Yeni İlan Ekle</Button>
          <Button variant="outline" onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" /> Çıkış Yap</Button>
        </div>
      </header>
      
      <CarForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        car={editingCar}
      />

      <AlertDialog open={!!deletingCar} onOpenChange={() => setDeletingCar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>İlanı Silmeyi Onaylıyor musunuz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. &quot;{deletingCar?.title}&quot; başlıklı ilanı kalıcı olarak silmek istediğinizden emin misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="overflow-x-auto bg-card rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İlan Başlığı</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marka</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center p-8">Yükleniyor...</td></tr>
            ) : (
              cars?.map((car) => (
                <tr key={car.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{car.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.price.toLocaleString('tr-TR')} ₺</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(car as Car)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeletingCar(car as Car)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
            {!isLoading && cars?.length === 0 && (
                <tr><td colSpan={5} className="text-center p-8 text-gray-500">Henüz hiç ilan eklenmemiş.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
