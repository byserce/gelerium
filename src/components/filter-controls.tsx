'use client';

import React from 'react';
import type { Car } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from './ui/button';
import { RotateCcw } from 'lucide-react';

type Filters = {
  brand: string;
  model: string;
  year: string;
  minPrice: number;
  maxPrice: number;
};

type FilterControlsProps = {
  cars: Car[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

export default function FilterControls({ cars, filters, setFilters }: FilterControlsProps) {
  const brands = ['all', ...Array.from(new Set(cars.map((car) => car.brand)))];
  const models = [
    'all',
    ...Array.from(new Set(cars.filter(car => filters.brand === 'all' || car.brand === filters.brand).map((car) => car.model))),
  ];
  const years = ['all', ...Array.from(new Set(cars.map((car) => car.year.toString()))).sort((a,b) => Number(b) - Number(a))];

  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (key === 'brand') {
        newFilters.model = 'all'; // Reset model if brand changes
      }
      return newFilters;
    });
  };
  
  const resetFilters = () => {
    setFilters({
      brand: 'all',
      model: 'all',
      year: 'all',
      minPrice: 0,
      maxPrice: 10000000,
    });
  };

  return (
    <div className="p-6 bg-card rounded-lg shadow-md border mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
        <div>
          <Label htmlFor="brand">Marka</Label>
          <Select
            value={filters.brand}
            onValueChange={(value) => handleFilterChange('brand', value)}
          >
            <SelectTrigger id="brand">
              <SelectValue placeholder="Marka Seçin" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand === 'all' ? 'Tüm Markalar' : brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="model">Model</Label>
          <Select
            value={filters.model}
            onValueChange={(value) => handleFilterChange('model', value)}
            disabled={filters.brand === 'all'}
          >
            <SelectTrigger id="model">
              <SelectValue placeholder="Model Seçin" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model === 'all' ? 'Tüm Modeller' : model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="year">Yıl</Label>
          <Select
            value={filters.year}
            onValueChange={(value) => handleFilterChange('year', value)}
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="Yıl Seçin" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year === 'all' ? 'Tüm Yıllar' : year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <div>
                <Label htmlFor="minPrice">Min Fiyat (₺)</Label>
                <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                />
            </div>
            <div>
                <Label htmlFor="maxPrice">Max Fiyat (₺)</Label>
                <Input
                    id="maxPrice"
                    type="number"
                    placeholder="10.000.000"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                />
            </div>
        </div>
        
        <div className="flex items-end h-full">
            <Button onClick={resetFilters} variant="outline" className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" /> Sıfırla
            </Button>
        </div>
      </div>
    </div>
  );
}
