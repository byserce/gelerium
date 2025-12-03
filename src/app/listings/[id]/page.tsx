'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Car } from '@/lib/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Gauge, Tag, Wrench } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PageProps = {
  params: {
    id: string;
  };
};

function getStatusColor(status: string) {
    switch(status) {
        case 'Boyalı': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Değişen': return 'bg-red-100 text-red-800 border-red-300';
        default: return 'bg-green-100 text-green-800 border-green-300';
    }
}


export default function ListingDetailPage({ params }: PageProps) {
  const { id } = params;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error fetching car:', error);
        notFound();
      } else {
        const formattedCar: Car = {
            id: data.id,
            title: data.title,
            brand: data.brand,
            model: data.model,
            year: data.year,
            price: data.price,
            km: data.kilometer,
            imageUrls: data.image_urls || [],
            description: data.description,
            expertise_report: data.expertise_report,
        };
        setCar(formattedCar);
      }
      setLoading(false);
    };

    fetchCar();
  }, [id]);

  if (loading) {
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div>
                    <Skeleton className="w-full aspect-video rounded-lg" />
                    <div className="grid grid-cols-5 gap-2 mt-2">
                        <Skeleton className="w-full aspect-square rounded-md" />
                        <Skeleton className="w-full aspect-square rounded-md" />
                        <Skeleton className="w-full aspect-square rounded-md" />
                        <Skeleton className="w-full aspect-square rounded-md" />
                        <Skeleton className="w-full aspect-square rounded-md" />
                    </div>
                </div>
                 <div>
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-12 w-1/2 mb-6" />
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                </div>
            </div>
             <div className="mt-8">
                <Skeleton className="h-8 w-1/4 mb-4" />
                <Skeleton className="h-24 w-full" />
            </div>
             <div className="mt-8">
                <Skeleton className="h-8 w-1/4 mb-4" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    );
  }

  if (!car) {
    return notFound();
  }

  const formattedPrice = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(car.price);
  
  const expertiseEntries = car.expertise_report ? Object.entries(car.expertise_report).filter(([_, status]) => status !== 'Orijinal') : [];


  return (
    <div className="container mx-auto py-8 md:py-12 px-4">
      <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="md:col-span-3">
          <Carousel className="w-full">
            <CarouselContent>
              {car.imageUrls && car.imageUrls.length > 0 ? (
                car.imageUrls.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <Image
                        src={url}
                        alt={`${car.title} - Resim ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Resim Yok</span>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
             {car.imageUrls && car.imageUrls.length > 1 && (
                <>
                    <CarouselPrevious className="absolute left-2 text-white opacity-50 hover:opacity-100" />
                    <CarouselNext className="absolute right-2 text-white opacity-50 hover:opacity-100" />
                </>
             )}
          </Carousel>
        </div>

        {/* Car Info */}
        <div className="md:col-span-2">
            <h1 className="text-2xl lg:text-3xl font-bold font-headline leading-tight mb-2">{car.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <span>{car.brand}</span>
                <span>&bull;</span>
                <span>{car.model}</span>
            </div>
            
            <p className="text-4xl font-bold text-primary mb-6">{formattedPrice}</p>

            <Card>
                <CardContent className="p-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-accent"/>
                        <div>
                            <p className="text-muted-foreground text-xs">Yıl</p>
                            <p className="font-semibold">{car.year}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <Gauge className="h-5 w-5 text-accent"/>
                        <div>
                            <p className="text-muted-foreground text-xs">Kilometre</p>
                            <p className="font-semibold">{car.km.toLocaleString('tr-TR')} km</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Description & Expertise */}
      <div className="mt-10 grid md:grid-cols-5 gap-8 lg:gap-12">
        <div className="md:col-span-3">
             {car.description && (
                <Card>
                    <CardHeader>
                        <CardTitle>Araç Açıklaması</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{car.description}</p>
                    </CardContent>
                </Card>
            )}
        </div>

        <div className="md:col-span-2">
             {expertiseEntries.length > 0 && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wrench className="h-5 w-5" />
                            Ekspertiz Raporu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {expertiseEntries.map(([part, status]) => (
                                <div key={part} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                                    <span className="font-medium">{part}</span>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(status)}`}>
                                        {status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                 </Card>
             )}
             {expertiseEntries.length === 0 && car.expertise_report && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wrench className="h-5 w-5" />
                            Ekspertiz Raporu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center text-center p-4 bg-green-50 border border-green-200 rounded-md">
                            <p className="font-semibold text-green-800">Tamamen Orijinal</p>
                            <p className="text-sm text-green-700 mt-1">Bu araçta boyalı veya değişen parça bulunmamaktadır.</p>
                        </div>
                    </CardContent>
                 </Card>
             )}
        </div>
      </div>
    </div>
  );
}
