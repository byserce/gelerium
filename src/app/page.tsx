'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Car } from '@/lib/types';
import CarCard from '@/components/car-card';
import FilterControls from '@/components/filter-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Building, Users } from 'lucide-react';
import DealershipMap from '@/components/map';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';


type Filters = {
  brand: string;
  model: string;
  year: string;
  minPrice: number;
  maxPrice: number;
};

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    brand: 'all',
    model: 'all',
    year: 'all',
    minPrice: 0,
    maxPrice: 10000000,
  });

  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('listings').select('*');

      if (error) {
        console.error('Error fetching cars:', error);
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
        }));
        setCars(formattedData);
      }
      setLoading(false);
    };

    fetchCars();
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const { brand, model, year, minPrice, maxPrice } = filters;
      return (
        (brand === 'all' || car.brand === brand) &&
        (model === 'all' || car.model === model) &&
        (year === 'all' || car.year.toString() === year) &&
        car.price >= (minPrice || 0) &&
        car.price <= (maxPrice || 10000000)
      );
    });
  }, [cars, filters]);

  const FilterComponent = () => (
    <FilterControls cars={cars} filters={filters} setFilters={setFilters} />
  );

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        
        {/* Listings Section */}
        <section id="listings" className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Araçlarımız</h2>
            <p className="text-muted-foreground text-center text-sm mb-8 max-w-lg mx-auto">
              Size en uygun ikinci el aracı bulmak için aşağıdaki filtreleri kullanabilirsiniz.
            </p>
            
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrele
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[75%] flex flex-col">
                    <h3 className="text-lg font-semibold p-4 border-b">Filtrele</h3>
                    <div className="overflow-y-auto p-4 flex-1">
                        <FilterComponent />
                    </div>
                </SheetContent>
              </Sheet>
            ) : (
              <FilterComponent />
            )}


            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                      <Skeleton className="h-[225px] w-full rounded-xl" />
                      <div className="space-y-2 p-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-6 w-[150px] mt-2" />
                      </div>
                    </div>
                  ))
                : filteredCars.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
             {!loading && filteredCars.length === 0 && (
                <div className="text-center col-span-full py-16">
                    <p className="text-lg text-muted-foreground">Filtrelerinize uygun araç bulunamadı.</p>
                </div>
            )}
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-12 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                 <h2 className="text-3xl font-bold text-center mb-8">Hakkımızda</h2>
                 <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                     <div className="w-full md:w-1/2">
                         <h3 className="text-2xl font-semibold text-primary mb-4">20 Yıllık Tecrübe ve Güven</h3>
                         <p className="text-muted-foreground leading-relaxed mb-4">
                            Avşarlı Otomotiv olarak, 20 yılı aşkın süredir Denizli'de ikinci el araç alım satım sektöründe hizmet vermekteyiz. Müşteri memnuniyetini her zaman ön planda tutan yaklaşımımızla, sizlere sadece bir araba değil, aynı zamanda güvenilir bir yol arkadaşı sunmayı hedefliyoruz.
                         </p>
                         <p className="text-muted-foreground leading-relaxed">
                            Her biri uzman ekibimiz tarafından detaylı ekspertizden geçirilmiş, güvenilir ve kaliteli araç portföyümüzle hayalinizdeki araca kavuşmanız için buradayız.
                         </p>
                     </div>
                     <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-card p-6 rounded-lg text-center shadow-sm">
                            <Building className="mx-auto h-10 w-10 text-accent mb-3"/>
                            <p className="text-xl font-bold">Modern Galeri</p>
                            <p className="text-sm text-muted-foreground">Ferak ve modern galerimizde araçlarımızı inceleyin.</p>
                        </div>
                         <div className="bg-card p-6 rounded-lg text-center shadow-sm">
                            <Users className="mx-auto h-10 w-10 text-accent mb-3"/>
                            <p className="text-xl font-bold">Uzman Kadro</p>
                            <p className="text-sm text-muted-foreground">Alanında uzman ve güler yüzlü ekibimizle tanışın.</p>
                        </div>
                     </div>
                 </div>
            </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2">Bize Ulaşın</h2>
            <div className="flex justify-center items-center gap-2 mb-8 text-muted-foreground">
                <MapPin className="h-5 w-5"/>
                <p>Denizli Honaz Galericiler Sitesi</p>
            </div>
            <DealershipMap />
          </div>
        </section>
      </main>
    </div>
  );
}
