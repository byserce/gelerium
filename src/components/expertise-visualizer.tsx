'use client';

import { cn } from "@/lib/utils";

type ExpertiseReport = Record<string, string>;

interface ExpertiseVisualizerProps {
    report: ExpertiseReport;
}

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
    'Orijinal': 'fill-gray-300'
};


export default function ExpertiseVisualizer({ report }: ExpertiseVisualizerProps) {
    const getPartColor = (partKey: string) => {
        if (!partKey) return statusColors['Orijinal'];
        const status = report[partKey] || 'Orijinal';
        return statusColors[status] || statusColors['Orijinal'];
    };
    
    const partKeys = Object.keys(partIdMap);

    return (
        <div className="flex flex-col items-center">
            <svg
                width="100%"
                height="auto"
                viewBox="0 0 450 550"
                xmlns="http://www.w3.org/2000/svg"
                className="max-w-xs"
            >
                <g id="car-schema" stroke="#6b7280" strokeWidth="1">
                    {/* Left Side */}
                    <g id="left-panels" transform="translate(40, 50)">
                         <text x="50" y="-10" textAnchor="middle" fontSize="14" fill="#6b7280">Sol</text>
                        <path id={partIdMap['Sol Ön Çamurluk']} className={cn("transition-colors", getPartColor('Sol Ön Çamurluk'))} d="M0,50 C20,55 80,45 100,50 L100,0 L20,0 C0,15 0,35 0,50 Z" />
                        <path id={partIdMap['Sol Ön Kapı']} className={cn("transition-colors", getPartColor('Sol Ön Kapı'))} d="M0,55 L100,55 L100,155 L0,155 Z" />
                        <path id={partIdMap['Sol Arka Kapı']} className={cn("transition-colors", getPartColor('Sol Arka Kapı'))} d="M0,160 L100,160 L100,260 L0,260 Z" />
                        <path id={partIdMap['Sol Arka Çamurluk']} className={cn("transition-colors", getPartColor('Sol Arka Çamurluk'))} d="M0,265 L100,265 L100,315 C80,325 20,315 0,265 Z" />
                    </g>
                    
                    {/* Center Column */}
                    <g id="center-panels" transform="translate(160, 0)">
                        <path id={partIdMap['Ön Tampon']} className={cn("transition-colors", getPartColor('Ön Tampon'))} d="M5,25 C20,0 110,0 125,25 L130,50 L0,50 Z" />
                        <path id={partIdMap['Kaput']} className={cn("transition-colors", getPartColor('Kaput'))} d="M0,55 L130,55 L120,155 L10,155 Z" />
                        <path id={partIdMap['Tavan']} className={cn("transition-colors", getPartColor('Tavan'))} d="M10,160 L120,160 L110,310 L20,310 Z" />
                        <path id={partIdMap['Bagaj']} className={cn("transition-colors", getPartColor('Bagaj'))} d="M20,315 L110,315 L100,395 L30,395 Z" />
                        <path id={partIdMap['Arka Tampon']} className={cn("transition-colors", getPartColor('Arka Tampon'))} d="M30,400 L100,400 C115,425 15,425 0,400 Z" />
                    </g>

                    {/* Right Side */}
                    <g id="right-panels" transform="translate(290, 50)">
                         <text x="50" y="-10" textAnchor="middle" fontSize="14" fill="#6b7280">Sağ</text>
                        <path id={partIdMap['Sağ Ön Çamurluk']} className={cn("transition-colors", getPartColor('Sağ Ön Çamurluk'))} d="M0,0 L80,0 C100,15 100,35 100,50 C80,45 20,55 0,50 L0,0 Z" />
                        <path id={partIdMap['Sağ Ön Kapı']} className={cn("transition-colors", getPartColor('Sağ Ön Kapı'))} d="M0,55 L100,55 L100,155 L0,155 Z" />
                        <path id={partIdMap['Sağ Arka Kapı']} className={cn("transition-colors", getPartColor('Sağ Arka Kapı'))} d="M0,160 L100,160 L100,260 L0,260 Z" />
                        <path id={partIdMap['Sağ Arka Çamurluk']} className={cn("transition-colors", getPartColor('Sağ Arka Çamurluk'))} d="M0,265 C20,315 80,325 100,315 L100,265 L0,265 Z" />
                    </g>
                </g>
            </svg>

             <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm bg-gray-300 border border-gray-400"></div>
                    <span className="text-sm text-muted-foreground">Orijinal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm bg-yellow-400 border border-yellow-500"></div>
                    <span className="text-sm text-muted-foreground">Boyalı</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm bg-red-500 border border-red-600"></div>
                    <span className="text-sm text-muted-foreground">Değişen</span>
                </div>
            </div>

            <div className="mt-6 w-full max-w-md space-y-2">
                {partKeys.map(key => {
                    const status = report[key];
                    if(status && status !== 'Orijinal') {
                        return (
                             <div key={key} className="flex justify-between items-center bg-muted/50 p-2 rounded-md text-sm">
                                <span className="text-foreground">{key}</span>
                                <span className={cn(
                                    "font-semibold",
                                    status === 'Boyalı' && 'text-yellow-600',
                                    status === 'Değişen' && 'text-red-600',
                                )}>
                                    {status}
                                </span>
                            </div>
                        )
                    }
                    return null;
                })}
            </div>
        </div>
    );
}
