"use client"

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

export default function DealershipMap() {
    const position = { lat: 41.0335, lng: 28.8202 }; // Placeholder: Oto Center, Bağcılar
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
            <div className="flex items-center justify-center h-[400px] w-full bg-muted rounded-lg border">
                <div className="text-center text-muted-foreground p-4">
                    <p className="font-semibold">Harita Yüklenemedi</p>
                    <p className="text-sm">Google Maps API anahtarı bulunamadı.</p>
                    <p className="text-xs mt-2">Lütfen projenizin kök dizininde <code className="bg-background px-1 rounded">.env.local</code> dosyası oluşturup <code className="bg-background px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...</code> değişkenini ekleyin.</p>
                </div>
            </div>
        )
    }

    return (
        <APIProvider apiKey={apiKey}>
            <div className="h-[400px] w-full rounded-lg overflow-hidden border shadow-md">
                <Map
                    defaultCenter={position}
                    defaultZoom={15}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    mapId="avsarli-otomotiv-map"
                    className="w-full h-full"
                >
                    <Marker position={position} />
                </Map>
            </div>
        </APIProvider>
    )
}
