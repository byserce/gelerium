import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      <CardHeader className="p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {car.imageUrls.map((url, index) => (
              <CarouselItem key={index}>
                <div className="aspect-w-16 aspect-h-9">
                  <Image
                    src={url}
                    alt={`${car.title} - Resim ${index + 1}`}
                    width={800}
                    height={600}
                    className="object-cover w-full h-48"
                    data-ai-hint="car exterior"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2" />
          <CarouselNext className="absolute right-2" />
        </Carousel>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-3">
        <h3 className="font-headline text-lg font-bold h-12 text-foreground leading-tight">{car.title}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5" title="Model Yılı">
            <Calendar className="h-4 w-4 text-accent" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Kilometre">
            <Gauge className="h-4 w-4 text-accent" />
            <span>{car.km.toLocaleString('tr-TR')} km</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-primary flex items-center gap-2">
            <Tag className="h-6 w-6" />
            {formattedPrice}
        </p>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50">
        <Button asChild className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground">
          <Link href={car.listingUrl} target="_blank" rel="noopener noreferrer">
            Detayları İncele
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
