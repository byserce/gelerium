import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Car } from '@/lib/types';
import { Calendar, Gauge, Tag } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

type CarCardProps = {
  car: Car;
};

export default function CarCard({ car }: CarCardProps) {
  const formattedPrice = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(car.price);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Carousel className="w-full">
          <CarouselContent>
            {car.imageUrls && car.imageUrls.length > 0 ? (
              car.imageUrls.map((url, index) => (
                <CarouselItem key={index}>
                  <Link href={`/listings/${car.id}`} className="block aspect-w-16 aspect-h-9">
                    <Image
                      src={url}
                      alt={`${car.title} - Resim ${index + 1}`}
                      width={400}
                      height={300}
                      className="object-cover w-full h-36 md:h-48"
                      data-ai-hint="car exterior"
                    />
                  </Link>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <Link href={`/listings/${car.id}`} className="block aspect-w-16 aspect-h-9">
                  <Image
                    src="https://placehold.co/400x300/e2e8f0/64748b?text=Resim Yok"
                    alt="Resim mevcut değil"
                    width={400}
                    height={300}
                    className="object-cover w-full h-36 md:h-48"
                  />
                </Link>
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
      </CardHeader>
      <Link href={`/listings/${car.id}`} className="flex flex-col flex-grow">
        <CardContent className="flex-grow p-3 space-y-2">
          <h3 className="font-headline text-base font-bold h-12 text-foreground leading-tight">{car.title}</h3>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5" title="Model Yılı">
              <Calendar className="h-4 w-4 text-accent" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Kilometre">
              <Gauge className="h-4 w-4 text-accent" />
              <span>{car.km.toLocaleString('tr-TR')} km</span>
            </div>
          </div>
          <p className="text-xl font-bold text-primary flex items-center gap-2 pt-1">
              <Tag className="h-5 w-5" />
              {formattedPrice}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
