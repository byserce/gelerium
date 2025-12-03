'use client';

import { cn } from "@/lib/utils";

type ExpertiseReport = Record<string, string>;

interface ExpertiseVisualizerProps {
    report: ExpertiseReport;
}

// Türkçe veritabanı keyleri ile kod içindeki ID eşleşmesi
const partIdMap: Record<string, string> = {
    'Kaput': 'hood',
    'Tavan': 'roof',
    'Bagaj': 'trunk',
    'Sağ Ön Çamurluk': 'front-fender-right',
    'Sağ Ön Kapı': 'front-door-right',
    'Sağ Arka Kapı': 'rear-door-right',
    'Sağ Arka Çamurluk': 'rear-fender-right',
    'Sol Ön Çamurluk': 'front-fender-left',
    'Sol Ön Kapı': 'front-door-left',
    'Sol Arka Kapı': 'rear-door-left',
    'Sol Arka Çamurluk': 'rear-fender-left',
    'Ön Tampon': 'front-bumper',
    'Arka Tampon': 'rear-bumper'
};

const statusColors: Record<string, string> = {
    'Boyalı': 'fill-yellow-400',
    'Değişen': 'fill-red-500',
    'Lokal Boyalı': 'fill-yellow-200',
    'Orijinal': 'fill-gray-100'
};

export default function ExpertiseVisualizer({ report }: ExpertiseVisualizerProps) {
    
    const getPartColor = (partKey: string) => {
        if (!partKey) return statusColors['Orijinal'];
        const status = report[partKey] || 'Orijinal';
        return statusColors[status] || statusColors['Orijinal'];
    };

    const partKeys = Object.keys(partIdMap);

    return (
        <div className="flex flex-col items-center w-full">
            {/* SVG Container */}
            <div className="relative w-full max-w-[400px] aspect-[3/4]">
                <svg
                    viewBox="0 0 300 420"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-md"
                    stroke="#374151" // Koyu gri çizgiler
                    strokeWidth="1.5"
                >
                    {/* --- ORTA BLOK (Gövde) --- */}
                    
                    {/* Ön Tampon (Kavisli) */}
                    <path
                        d="M 85 20 Q 150 5 215 20 L 215 40 Q 150 30 85 40 Z"
                        className={cn("transition-colors duration-300", getPartColor('Ön Tampon'))}
                    />

                    {/* Kaput (Aerodinamik çizgili) */}
                    <path
                        d="M 85 45 Q 150 35 215 45 L 210 120 Q 150 115 90 120 Z"
                        className={cn("transition-colors duration-300", getPartColor('Kaput'))}
                    />

                    {/* Ön Cam (Cam olduğu için boyanmaz, sadece görsel - Açık mavi/gri) */}
                    <path
                        d="M 90 125 Q 150 120 210 125 L 205 150 Q 150 145 95 150 Z"
                        className="fill-blue-50/50 stroke-gray-300"
                    />

                    {/* Tavan (Dikdörtgenimsi) */}
                    <path
                        d="M 95 155 Q 150 150 205 155 L 205 240 Q 150 245 95 240 Z"
                        className={cn("transition-colors duration-300", getPartColor('Tavan'))}
                    />

                    {/* Arka Cam (Görsel) */}
                    <path
                        d="M 95 245 Q 150 250 205 245 L 210 270 Q 150 275 90 270 Z"
                        className="fill-blue-50/50 stroke-gray-300"
                    />

                    {/* Bagaj */}
                    <path
                        d="M 90 275 Q 150 280 210 275 L 210 330 Q 150 340 90 330 Z"
                        className={cn("transition-colors duration-300", getPartColor('Bagaj'))}
                    />

                    {/* Arka Tampon */}
                    <path
                        d="M 85 335 Q 150 345 215 335 L 215 360 Q 150 375 85 360 Z"
                        className={cn("transition-colors duration-300", getPartColor('Arka Tampon'))}
                    />


                    {/* --- SOL KANAT (Sol Parçalar) --- */}

                    {/* Sol Ön Çamurluk (Tekerlek oyuğu ile) */}
                    <path
                        d="M 80 45 L 40 45 L 40 90 A 25 25 0 0 1 65 115 L 85 115 Z"
                        className={cn("transition-colors duration-300", getPartColor('Sol Ön Çamurluk'))}
                    />

                    {/* Sol Ön Kapı (Cam çerçevesi ile bütünleşik panel) */}
                    <path
                        d="M 85 120 L 35 120 L 35 200 L 90 200 Z"
                        className={cn("transition-colors duration-300", getPartColor('Sol Ön Kapı'))}
                    />

                    {/* Sol Arka Kapı */}
                    <path
                        d="M 90 205 L 35 205 L 35 275 L 85 275 Z"
                        className={cn("transition-colors duration-300", getPartColor('Sol Arka Kapı'))}
                    />

                    {/* Sol Arka Çamurluk (Tekerlek oyuğu arkada) */}
                    <path
                        d="M 85 280 L 65 280 A 25 25 0 0 1 40 305 L 40 335 L 85 330 Z"
                        className={cn("transition-colors duration-300", getPartColor('Sol Arka Çamurluk'))}
                    />


                    {/* --- SAĞ KANAT (Sağ Parçalar) --- */}

                    {/* Sağ Ön Çamurluk */}
                    <path
                        d="M 220 45 L 260 45 L 260 90 A 25 25 0 0 0 235 115 L 215 115 Z"
                        className={cn("transition-colors duration-300", getPartColor('Sağ Ön Çamurluk'))}
                    />

                    {/* Sağ Ön Kapı */}
                    <path
                        d="M 215 120 L 265 120 L 265 200 L 210 200 Z"
                        className={cn("transition-colors duration-300", getPartColor('Sağ Ön Kapı'))}
                    />

                    {/* Sağ Arka Kapı */}
                    <path
                        d="M 210 205 L 265 205 L 265 275 L 215 275 Z"
                        className={cn("transition-colors duration-300", getPartColor('Sağ Arka Kapı'))}
                    />

                    {/* Sağ Arka Çamurluk */}
                    <path
                        d="M 215 280 L 235 280 A 25 25 0 0 0 260 305 L 260 335 L 215 330 Z"
                        className={cn("transition-colors duration-300", getPartColor('Sağ Arka Çamurluk'))}
                    />

                    {/* Yönlendirme Yazıları */}
                    <text x="20" y="200" className="text-[10px] fill-gray-400 -rotate-90">SOL TARAF</text>
                    <text x="280" y="200" className="text-[10px] fill-gray-400 rotate-90">SAĞ TARAF</text>
                    <text x="150" y="15" className="text-[10px] fill-gray-400 text-center" textAnchor="middle">ÖN</text>
                    <text x="150" y="380" className="text-[10px] fill-gray-400 text-center" textAnchor="middle">ARKA</text>

                </svg>
            </div>

            {/* Renk Açıklamaları (Legend) */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 border-t pt-4 w-full">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-400 shadow-sm"></div>
                    <span className="text-xs font-medium text-gray-600">Orijinal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-500 shadow-sm"></div>
                    <span className="text-xs font-medium text-gray-600">Boyalı</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-200 border border-yellow-400 shadow-sm"></div>
                    <span className="text-xs font-medium text-gray-600">Lokal Boyalı</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 border border-red-600 shadow-sm"></div>
                    <span className="text-xs font-medium text-gray-600">Değişen</span>
                </div>
            </div>

            {/* Liste Görünümü (Mobilde okumayı kolaylaştırmak için) */}
            <div className="mt-6 w-full grid grid-cols-2 gap-2 sm:grid-cols-3">
                {partKeys.map(key => {
                    const status = report[key];
                    if (status && status !== 'Orijinal') {
                        return (
                            <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded border text-xs">
                                <span className="text-gray-700 truncate mr-2">{key}</span>
                                <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    status === 'Boyalı' && 'bg-yellow-400',
                                    status === 'Lokal Boyalı' && 'bg-yellow-200',
                                    status === 'Değişen' && 'bg-red-500'
                                )} />
                            </div>
                        )
                    }
                    return null;
                })}
            </div>
        </div>
    );
}
