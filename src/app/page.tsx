"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { cars as allCars } from '@/lib/data';
import type { Car } from '@/lib/types';
import CarCard from '@/components/car-card';
import FilterControls from '@/components/filter-controls';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DealershipMap from '@/components/map';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { Car as CarIcon, MapPin, Phone, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type Filters = {
  brand: string;
  model: string;
  year: string;
  minPrice: number;
  maxPrice: number;
};

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    brand: 'all',
    model: 'all',
    year: 'all',
    minPrice: 0,
    maxPrice: 10000000,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredCars = useMemo(() => {
    return allCars.filter((car: Car) => {
      const { brand, model, year, minPrice, maxPrice } = filters;
      return (
        (brand === 'all' || car.brand === brand) &&
        (model === 'all' || car.model === model) &&
        (year === 'all' || car.year.toString() === year) &&
        car.price >= minPrice &&
        car.price <= maxPrice
      );
    });
  }, [filters]);

  return (
    <>
      <section id="listings" className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Vitrin İlanları</h2>
            <p className="mt-2 text-lg text-muted-foreground">Size özel seçtiğimiz araçları inceleyin.</p>
          </div>
          
          <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="mb-8">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full md:hidden mb-4">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtrele
              </Button>
            </CollapsibleTrigger>
             <div className="hidden md:block">
              <FilterControls cars={allCars} filters={filters} setFilters={setFilters} />
             </div>
            <CollapsibleContent>
               <div className="md:hidden">
                 <FilterControls cars={allCars} filters={filters} setFilters={setFilters} />
               </div>
            </CollapsibleContent>
          </Collapsible>


          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center mt-16 py-16 bg-muted rounded-lg">
              <p className="text-xl text-muted-foreground">Aradığınız kriterlere uygun araç bulunamadı.</p>
            </div>
          )}
        </div>
      </section>

      <section id="about" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Hakkımızda</h2>
            <p className="mt-2 text-lg text-muted-foreground">Yılların tecrübesi, sarsılmaz güven.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-foreground/80">
                Avşarlı Otomotiv olarak, sektördeki uzun yıllara dayanan tecrübemizle müşterilerimize en kaliteli hizmeti sunmayı hedefliyoruz. Geniş araç portföyümüz, uzman ekibimiz ve şeffaf satış politikamızla, araç alım satım sürecinizi kolay ve güvenli bir deneyime dönüştürüyoruz.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full p-3">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Güvenilirlik</h4>
                    <p className="text-muted-foreground">Tüm araçlarımız detaylı ekspertizden geçer ve şeffaf bir şekilde raporlanır.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full p-3">
                    <CarIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Geniş Seçenek</h4>
                    <p className="text-muted-foreground">Her marka ve modelde, farklı bütçelere uygun zengin araç yelpazesi sunuyoruz.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Image 
                src="https://picsum.photos/seed/showroom/800/600"
                alt="Avşarlı Otomotiv Showroom"
                width={800}
                height={600}
                className="rounded-lg shadow-xl"
                data-ai-hint="car showroom"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Bize Ulaşın</h2>
            <p className="mt-2 text-lg text-muted-foreground">Sizi galerimize bir kahve içmeye bekleriz.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">İletişim Bilgileri</h3>
               <div className="space-y-4 text-lg">
                <p className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-accent" />
                  <span>Oto Center Galericiler Sitesi, No:123, Bağcılar/İstanbul</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="h-6 w-6 text-accent" />
                  <a href="tel:+905000000000" className="hover:underline">+90 500 000 00 00</a>
                </p>
              </div>
              <p className="text-muted-foreground">Harita üzerinden konumumuzu görüntüleyebilir ve kolayca yol tarifi alabilirsiniz.</p>
            </div>
            <DealershipMap />
          </div>
        </div>
      </section>
    </>
  );
}

    