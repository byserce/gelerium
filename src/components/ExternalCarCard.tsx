import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { ExternalCar } from '@/lib/types';
import { Calendar, Gauge, Tag, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

type ExternalCarCardProps = {
  car: ExternalCar;
};

export default function ExternalCarCard({ car }: ExternalCarCardProps) {
  const formattedPrice = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(car.price);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link href={car.original_link} target="_blank" rel="noopener noreferrer" className="flex flex-col flex-grow">
        <div className="relative aspect-w-16 aspect-h-9">
            <Image
                src={car.image_url}
                alt={car.title}
                width={400}
                height={300}
                className="object-cover w-full h-36 md:h-48"
                data-ai-hint="car exterior"
                unoptimized // External images might not be optimized
            />
        </div>
        <CardContent className="flex-grow p-3 space-y-2 flex flex-col">
            <h3 className="font-headline text-sm font-bold h-10 text-foreground leading-tight">{car.title}</h3>
            <p className="text-xs text-muted-foreground">{car.brand} / {car.model}</p>

            <div className="flex flex-col gap-1 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5" title="Model Yılı">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span>{car.year}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Kilometre">
                    <Gauge className="h-4 w-4 text-accent" />
                    <span>{car.km} km</span>
                </div>
            </div>
            <p className="text-xl font-bold text-primary flex items-center gap-2 pt-1">
                <Tag className="h-5 w-5" />
                {formattedPrice}
            </p>
             <Button 
                variant="outline"
                className="mt-auto w-full bg-yellow-400 text-black border-yellow-500 hover:bg-yellow-500 px-2"
                asChild
            >
                <div className="flex items-center justify-center flex-wrap gap-1">
                    <span className="text-xs sm:text-sm">Sahibinden'de İncele</span>
                    <ExternalLink className="h-4 w-4" />
                </div>
            </Button>
        </CardContent>
      </Link>
    </Card>
  );
}
