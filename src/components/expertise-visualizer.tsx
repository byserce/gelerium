
'use client';

import { cn } from "@/lib/utils";

// --- TİP VE MAP TANIMLARI (Aynen korundu) ---
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
    'Orijinal': 'fill-gray-100' // Orijinal rengi görseldeki gibi daha açık gri yaptım
};

// --- ANA BİLEŞEN ---
export default function ExpertiseVisualizer({ report }: ExpertiseVisualizerProps) {
    const getPartColor = (partKey: string) => {
        if (!partKey) return statusColors['Orijinal'];
        const status = report[partKey] || 'Orijinal';
        // Eğer statusColors içinde tanımlı olmayan bir durum gelirse gri döner
        return statusColors[status] || statusColors['Orijinal'];
    };

    const partKeys = Object.keys(partIdMap);

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
            {/* GÜNCELLENMİŞ DETAYLI SVG ŞEMASI 
                Referans görseldeki geometriye sadık kalındı.
                Arka kısım üstte, Ön kısım altta.
            */}
            <svg
                width="100%"
                height="auto"
                viewBox="0 0 800 1050"
                xmlns="http://www.w3.org/2000/svg"
                className="max-w-full drop-shadow-sm"
            >
                {/* Çizgiler için ortak stil */}
                <g stroke="#9ca3af" strokeWidth="3" strokeLinejoin="round">

                    {/* --- ORTA BÖLÜM (Yukarıdan Aşağıya: Arka Tampon -> Bagaj -> Tavan -> Kaput -> Ön Tampon) --- */}
                    <g id="center-column">
                        {/* Arka Tampon */}
                        <path
                            id={partIdMap['Arka Tampon']}
                            className={cn("transition-colors", getPartColor('Arka Tampon'))}
                            d="M280,40 Q400,10 520,40 L520,70 Q400,100 280,70 Z"
                        />
                        {/* Bagaj */}
                        <path
                            id={partIdMap['Bagaj']}
                            className={cn("transition-colors", getPartColor('Bagaj'))}
                            d="M285,75 L515,75 C525,150 515,230 505,260 L295,260 C285,230 275,150 285,75 Z"
                        />
                        {/* Tavan */}
                        <path
                            id={partIdMap['Tavan']}
                            className={cn("transition-colors", getPartColor('Tavan'))}
                            d="M295,265 L505,265 L500,600 L300,600 Z"
                        />
                        {/* Kaput */}
                        <path
                            id={partIdMap['Kaput']}
                            className={cn("transition-colors", getPartColor('Kaput'))}
                            d="M300,605 L500,605 C490,750 480,820 470,860 L330,860 C320,820 310,750 300,605 Z"
                        />
                        {/* Ön Tampon */}
                        <path
                            id={partIdMap['Ön Tampon']}
                            className={cn("transition-colors", getPartColor('Ön Tampon'))}
                             d="M 325 865 Q 400 880 475 865 L 485 900 Q 400 930 315 900 Z"
                        />
                    </g>


                    {/* --- SOL TARAF (Sol Çamurluklar ve Kapılar) --- */}
                    <g id="left-side" transform="translate(-10, 0)">
                         {/* Etiketler */}
                        <text x="80" y="500" className="text-xl fill-gray-500 font-semibold" transform="rotate(-90 80,500)">SOL</text>
                        <text x="220" y="800" className="text-lg fill-gray-400">ÖN</text>
                        <text x="220" y="200" className="text-lg fill-gray-400">ARKA</text>

                        {/* Sol Arka Çamurluk (Üstteki kavisli parça) */}
                        <path
                            id={partIdMap['Sol Arka Çamurluk']}
                            className={cn("transition-colors", getPartColor('Sol Arka Çamurluk'))}
                            d="M275,75 C150,75 150,200 150,260 L220,260 L275,220 Z"
                        />
                        {/* Sol Arka Kapı */}
                        <path
                            id={partIdMap['Sol Arka Kapı']}
                            className={cn("transition-colors", getPartColor('Sol Arka Kapı'))}
                            d="M150,265 L220,265 L230,450 L155,470 C150,400 150,350 150,265 Z"
                        />
                        {/* Sol Ön Kapı */}
                        <path
                            id={partIdMap['Sol Ön Kapı']}
                            className={cn("transition-colors", getPartColor('Sol Ön Kapı'))}
                            d="M155,475 L230,455 L245,650 L170,680 C165,600 160,550 155,475 Z"
                        />
                        {/* Sol Ön Çamurluk (Alttaki kavisli parça) */}
                        <path
                            id={partIdMap['Sol Ön Çamurluk']}
                            className={cn("transition-colors", getPartColor('Sol Ön Çamurluk'))}
                            d="M170,685 L245,655 L285,860 C200,860 150,800 170,685 Z"
                        />
                         {/* Sol Ayna (Görsel amaçlı, boyanmaz) */}
                        <path d="M245,620 L280,610 L285,640 L250,650 Z" fill="#e5e7eb" stroke="none"/>
                    </g>


                    {/* --- SAĞ TARAF (Sağ Çamurluklar ve Kapılar - Solun Aynası) --- */}
                    <g id="right-side" transform="scale(-1, 1) translate(-800, 0)">
                         {/* Etiketler (Aynalandığı için textleri düzeltiyoruz) */}
                        <text x="720" y="500" className="text-xl fill-gray-500 font-semibold" transform="rotate(90 720,500) scale(-1,1) translate(-1440,0)">SAĞ</text>

                        {/* Sağ Arka Çamurluk */}
                        <path
                            id={partIdMap['Sağ Arka Çamurluk']}
                            className={cn("transition-colors", getPartColor('Sağ Arka Çamurluk'))}
                            d="M275,75 C150,75 150,200 150,260 L220,260 L275,220 Z"
                        />
                        {/* Sağ Arka Kapı */}
                        <path
                            id={partIdMap['Sağ Arka Kapı']}
                            className={cn("transition-colors", getPartColor('Sağ Arka Kapı'))}
                            d="M150,265 L220,265 L230,450 L155,470 C150,400 150,350 150,265 Z"
                        />
                        {/* Sağ Ön Kapı */}
                        <path
                            id={partIdMap['Sağ Ön Kapı']}
                            className={cn("transition-colors", getPartColor('Sağ Ön Kapı'))}
                            d="M155,475 L230,455 L245,650 L170,680 C165,600 160,550 155,475 Z"
                        />
                        {/* Sağ Ön Çamurluk */}
                        <path
                            id={partIdMap['Sağ Ön Çamurluk']}
                            className={cn("transition-colors", getPartColor('Sağ Ön Çamurluk'))}
                            d="M170,685 L245,655 L285,860 C200,860 150,800 170,685 Z"
                        />
                         {/* Sağ Ayna */}
                         <path d="M245,620 L280,610 L285,640 L250,650 Z" fill="#e5e7eb" stroke="none"/>
                    </g>

                </g>
            </svg>

            {/* --- RENK LEJANTI (Mevcut koddan korundu) --- */}
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-md bg-gray-100 border-2 border-gray-300"></div>
                    <span className="text-sm font-medium text-gray-700">Orijinal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-md bg-yellow-400 border-2 border-yellow-500"></div>
                    <span className="text-sm font-medium text-gray-700">Boyalı</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-md bg-red-500 border-2 border-red-600"></div>
                    <span className="text-sm font-medium text-gray-700">Değişen</span>
                </div>
                {/* Not: Görseldeki Mor (Lokal Boya) ve diğer durumlar mevcut kod yapınızda olmadığı için eklenmedi. 
                    İstenirse statusColors objesine ve buraya eklenebilir. */}
            </div>

            {/* --- PARÇA LİSTESİ (Mevcut koddan korundu) --- */}
            <div className="mt-6 w-full max-w-md space-y-2">
                {partKeys.map(key => {
                    const status = report[key];
                    if (status && status !== 'Orijinal') {
                        return (
                            <div key={key} className="flex justify-between items-center bg-white border p-3 rounded-md text-sm shadow-sm">
                                <span className="text-gray-700 font-medium">{key}</span>
                                <span className={cn(
                                    "font-bold px-2 py-1 rounded-full text-xs uppercase tracking-wider",
                                    status === 'Boyalı' && 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                                    status === 'Değişen' && 'bg-red-100 text-red-800 border border-red-200',
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

