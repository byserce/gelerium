'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileJson } from 'lucide-react';

const schema = z.object({
  jsonInput: z.string().min(1, "JSON verisi boş olamaz.").refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    { message: "Geçersiz JSON formatı." }
  ),
});

type FormValues = z.infer<typeof schema>;

// The expected structure of each item in the JSON array
interface SahibindenListing {
  sahibindenId: string;
  title: string;
  price: string;
  model: string;
  year: string;
  km: string;
  imageUrl: string;
  link: string;
}

export default function SahibindenImport() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const processAndUpsertData = async (listings: SahibindenListing[]) => {
    if (!Array.isArray(listings)) {
      throw new Error("JSON verisi bir dizi (array) olmalıdır.");
    }
    
    const formattedData = listings.map((item) => {
      // Price cleaning
      const priceString = item.price.replace(/[\. TL]/g, '').trim();
      const price = parseInt(priceString, 10);

      if (isNaN(price)) {
        console.warn(`Could not parse price for sahibindenId ${item.sahibindenId}: ${item.price}`);
      }

      return {
        sahibinden_id: item.sahibindenId,
        title: item.title,
        price: isNaN(price) ? 0 : price,
        model: item.model,
        year: item.year,
        km: item.km,
        image_url: item.imageUrl,
        original_link: item.link,
      };
    });

    const { data, error } = await supabase
      .from('external_listings')
      .upsert(formattedData, {
        onConflict: 'sahibinden_id',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error("Supabase upsert error:", error);
      throw new Error(`Veritabanına kayıt sırasında hata: ${error.message}`);
    }

    return formattedData.length;
  };

  const onSubmit: SubmitHandler<FormValues> = async ({ jsonInput }) => {
    setIsSubmitting(true);
    try {
      const listings = JSON.parse(jsonInput) as SahibindenListing[];
      const count = await processAndUpsertData(listings);

      toast({
        title: "İçe Aktarma Başarılı!",
        description: `${count} adet ilan başarıyla işlendi ve veritabanına eklendi/güncellendi.`,
      });
      reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Hata!",
        description: error.message || "İlanlar işlenirken bir sorun oluştu.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sahibinden JSON Verisi İçe Aktar</CardTitle>
        <CardDescription>
          Sahibinden.com'dan alınan JSON formatındaki verileri buraya yapıştırarak sisteme aktarabilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <FileJson className="h-4 w-4" />
          <AlertTitle>JSON Formatı</AlertTitle>
          <AlertDescription>
            Lütfen verinin bir dizi ( `[ { ... }, { ... } ]` ) olduğundan ve her bir objenin `sahibindenId`, `title`, `price`, `imageUrl`, `link` gibi alanları içerdiğinden emin olun.
          </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jsonInput">JSON Verisi</Label>
            <Textarea
              id="jsonInput"
              {...register('jsonInput')}
              rows={15}
              placeholder="[&#10;  {&#10;    &quot;sahibindenId&quot;: &quot;123456&quot;,&#10;    &quot;title&quot;: &quot;Örnek İlan Başlığı&quot;,&#10;    &quot;price&quot;: &quot;500.000 TL&quot;,&#10;    ...&#10;  },&#10;  ...&#10;]"
              className="font-mono text-xs"
            />
            {errors.jsonInput && <p className="text-sm text-red-500">{errors.jsonInput.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'İçe Aktarılıyor...' : 'İlanları İçe Aktar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
