'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function SahibindenImport() {
    const [jsonInput, setJsonInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleImport = async () => {
        setLoading(true);
        setMessage(null);

        try {
            // 0. Önceki tüm dış ilanları sil
            const { error: deleteError } = await supabase
                .from('external_listings')
                .delete()
                .neq('id', -1); // Bu koşul tüm satırları hedefler

            if (deleteError) {
                throw new Error(`Eski ilanlar silinirken hata oluştu: ${deleteError.message}`);
            }
            
            // 1. JSON verisini parse et
            let parsedData;
            try {
                parsedData = JSON.parse(jsonInput);
            } catch (e) {
                throw new Error('Girdiğiniz metin geçerli bir JSON formatında değil.');
            }

            if (!Array.isArray(parsedData)) {
                parsedData = [parsedData];
            }

            const formattedData = parsedData.map((item: any) => {
                let numericPrice = 0;
                if (item.price) {
                    const cleanPrice = String(item.price).replace(/[^0-9]/g, '');
                    numericPrice = parseInt(cleanPrice, 10) || 0;
                }

                return {
                    sahibinden_id: item.sahibindenId,
                    title: item.title,
                    price: numericPrice,
                    model: item.model, // Artık doğrudan JSON'dan alınıyor
                    year: item.year,   // Artık doğrudan JSON'dan alınıyor
                    km: item.km,       // Artık doğrudan JSON'dan alınıyor
                    image_url: item.imageUrl,
                    original_link: item.link
                };
            });

            // 2. Veritabanına yeni verileri kaydet
            const { error } = await supabase
                .from('external_listings')
                .insert(formattedData);

            if (error) throw error;

            setMessage({ type: 'success', text: `${formattedData.length} ilan başarıyla içe aktarıldı! (Önceki ilanlar silindi)` });
            setJsonInput(''); 

        } catch (error: any) {
            console.error('İçe aktarma hatası:', error);
            setMessage({ type: 'error', text: error.message || 'Bir hata oluştu.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sahibinden JSON İçe Aktar</CardTitle>
                <CardDescription>
                    Sahibinden.com verilerini JSON formatında buraya yapıştırın. Her içe aktarma işleminde önceki tüm dış kaynaklı ilanlar silinir ve yenileri eklenir.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="json-data">JSON Verisi</Label>
                    <Textarea
                        id="json-data"
                        placeholder='[ { "sahibindenId": "...", "title": "...", "model": "Passat", "year": "2022", "km": "50.000" } ]'
                        className="min-h-[200px] font-mono text-xs"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                    />
                </div>

                {message && (
                    <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <Button onClick={handleImport} disabled={loading || !jsonInput} className="w-full">
                    {loading ? 'İçe Aktarılıyor...' : 'İlanları Sil ve İçe Aktar'}
                </Button>
            </CardContent>
        </Card>
    );
}
