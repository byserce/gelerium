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
    'Sağ Ön Çamurluk': 'front_fender_right',
    'Sağ Ön Kapı': 'front_door_right',
    'Sağ Arka Kapı': 'rear_door_right',
    'Sağ Arka Çamurluk': 'rear_fender_right',
    'Sol Ön Çamurluk': 'front_fender_left',
    'Sol Ön Kapı': 'front_door_left',
    'Sol Arka Kapı': 'rear_door_left',
    'Sol Arka Çamurluk': 'rear_fender_left',
    'Ön Tampon': 'front_bumper',
    'Arka Tampon': 'rear_bumper'
};

const statusColors: Record<string, string> = {
    'Boyalı': 'fill-yellow-400',
    'Değişen': 'fill-red-500',
    'Orijinal': 'fill-gray-300'
};


export default function ExpertiseVisualizer({ report }: ExpertiseVisualizerProps) {
    const getPartColor = (partName: string) => {
        const partKey = Object.keys(partIdMap).find(key => partIdMap[key] === partName);
        if (!partKey) return statusColors['Orijinal'];

        const status = report[partKey] || 'Orijinal';
        return statusColors[status] || statusColors['Orijinal'];
    };

    return (
        <div className="flex flex-col items-center">
            <svg
                width="100%"
                height="auto"
                viewBox="0 0 800 400"
                xmlns="http://www.w3.org/2000/svg"
                className="max-w-md"
            >
                <g id="car-body" className="stroke-gray-600 stroke-2">
                    {/* Main Body */}
                    <path
                        id="front_fender_left"
                        d="M 150,250 L 200,250 L 200,200 L 150,200 Z"
                        className={cn("transition-colors", getPartColor('front_fender_left'))}
                    />
                    <path
                        id="hood"
                        d="M 200,250 L 350,250 L 350,180 L 200,180 Z"
                        className={cn("transition-colors", getPartColor('hood'))}
                    />
                    <path
                        id="front_fender_right"
                        d="M 350,250 L 400,250 L 400,200 L 350,200 Z"
                        className={cn("transition-colors", getPartColor('front_fender_right'))}
                    />

                    {/* Cabin */}
                    <path
                        id="roof"
                        d="M 250,180 L 300,180 L 300,130 L 250,130 Z"
                        className={cn("transition-colors", getPartColor('roof'))}
                    />
                    <rect id="windshield" x="220" y="180" width="110" height="20" className="fill-gray-400/50" />
                    
                    {/* Doors */}
                    <path
                        id="front_door_left"
                        d="M 200,250 L 250,250 L 250,200 L 200,200 Z"
                        className={cn("transition-colors", getPartColor('front_door_left'))}
                    />
                    <path
                        id="rear_door_left"
                        d="M 250,250 L 300,250 L 300,200 L 250,200 Z"
                        className={cn("transition-colors", getPartColor('rear_door_left'))}
                    />
                    <path
                        id="front_door_right"
                        d="M 300,250 L 350,250 L 350,200 L 300,200 Z"
                        className={cn("transition-colors", getPartColor('front_door_right'))}
                    />
                    <path
                        id="rear_door_right"
                        d="M 350,250 L 400,250 L 400,200 L 350,200 Z"
                        className={cn("transition-colors", getPartColor('rear_door_right'))}
                    />

                    {/* Rear */}
                     <path
                        id="rear_fender_left"
                        d="M 300,250 L 350,250 L 350,200 L 300,200 Z"
                        className={cn("transition-colors", getPartColor('rear_fender_left'))}
                    />
                    <path
                        id="trunk"
                        d="M 400,250 L 550,250 L 550,180 L 400,180 Z"
                        className={cn("transition-colors", getPartColor('trunk'))}
                    />
                    <path
                        id="rear_fender_right"
                        d="M 550,250 L 600,250 L 600,200 L 550,200 Z"
                        className={cn("transition-colors", getPartColor('rear_fender_right'))}
                    />
                    
                     {/* Bumpers */}
                    <path 
                        id="front_bumper"
                        d="M 130,255 L 420,255 L 420, 275 L 130,275 Z"
                        className={cn("transition-colors", getPartColor('front_bumper'))}
                    />
                    <path 
                        id="rear_bumper"
                        d="M 380,255 L 670,255 L 670,275 L 380,275 Z"
                        className={cn("transition-colors", getPartColor('rear_bumper'))}
                        transform="translate(150, -55) rotate(0)"
                    />
                </g>

                {/* Simplified Car Shape for context - a more complex SVG would be better */}
                 <path d="M130 250 C 120 230, 120 200, 150 200 H 200 V 180 C 200 160, 220 130, 250 130 H 300 C 330 130, 350 160, 350 180 V 200 H 400 C 430 200, 450 230, 460 250 H 650 C 670 250, 680 270, 650 280 L 630 290 H 220 L 200 280 C 170 270, 180 250, 130 250 Z" 
                 fill="none" stroke="black" strokeWidth="2"/>

                {/* Wheels */}
                <circle cx="235" cy="290" r="20" fill="black" />
                <circle cx="595" cy="290" r="20" fill="black" />
            </svg>

             <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
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
        </div>
    );
}

// A more detailed SVG for future use
const detailedSVG = `
  <g id="car-body" stroke="#333" stroke-width="2" fill-rule="evenodd">
    <path id="front_bumper" class="${getPartColor('Ön Tampon')}" d="M102,236 L102,260 L38,260 L38,236 L102,236 Z" />
    <path id="hood" class="${getPartColor('Kaput')}" d="M102,184 L102,236 L38,236 L38,184 L102,184 Z" transform="skewX(-20) translate(60, 0)" />
    <path id="front_fender_left" class="${getPartColor('Sol Ön Çamurluk')}" d="M188,184 L188,260 L124,260 L124,184 L188,184 Z" transform="skewX(-20) translate(40,0)" />
    <path id="front_door_left" class="${getPartColor('Sol Ön Kapı')}" d="M266,184 L266,260 L202,260 L202,184 L266,184 Z" />
    <path id="rear_door_left" class="${getPartColor('Sol Arka Kapı')}" d="M344,184 L344,260 L280,260 L280,184 L344,184 Z" />
    <path id="rear_fender_left" class="${getPartColor('Sol Arka Çamurluk')}" d="M422,184 L422,260 L358,260 L358,184 L422,184 Z" transform="skewX(20) translate(-40,0)" />
    <path id="trunk" class="${getPartColor('Bagaj')}" d="M490,184 L490,236 L436,236 L436,184 L490,184 Z" transform="skewX(20) translate(-60, 0)" />
    <path id="rear_bumper" class="${getPartColor('Arka Tampon')}" d="M518,236 L518,260 L454,260 L454,236 L518,236 Z" />
    <path id="roof" class="${getPartColor('Tavan')}" d="M202,124 L358,124 L328,184 L232,184Z" />
    
    <g transform="translate(560, 0) scale(-1, 1) translate(-560, 0)">
        <path id="front_fender_right" class="${getPartColor('Sağ Ön Çamurluk')}" d="M188,184 L188,260 L124,260 L124,184 L188,184 Z" transform="skewX(-20) translate(40,0)" />
        <path id="front_door_right" class="${getPartColor('Sağ Ön Kapı')}" d="M266,184 L266,260 L202,260 L202,184 L266,184 Z" />
        <path id="rear_door_right" class="${getPartColor('Sağ Arka Kapı')}" d="M344,184 L344,260 L280,260 L280,184 L344,184 Z" />
        <path id="rear_fender_right" class="${getPartColor('Sağ Arka Çamurluk')}" d="M422,184 L422,260 L358,260 L358,184 L422,184 Z" transform="skewX(20) translate(-40,0)" />
    </g>
  </g>
`;

