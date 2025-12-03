'use client';

import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Phone } from 'lucide-react';

export default function WhatsAppButton() {
    const phoneNumber = "905542140263"; // Replace with dealership's number
    const message = "Merhaba, Avşarlı Otomotiv web sitenizden bir araç hakkında bilgi almak istiyorum.";

    return (
        <TooltipProvider delayDuration={0}>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
                 {/* Telefonla Ara Butonu */}
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <a 
                            href={`tel:+${phoneNumber}`}
                            className="h-16 w-16 bg-primary hover:bg-accent rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
                            aria-label="Call us"
                        >
                            <Phone className="h-7 w-7 text-primary-foreground" />
                        </a>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>Telefonla Ara</p>
                    </TooltipContent>
                </Tooltip>

                {/* WhatsApp Butonu */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link 
                            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-16 w-16 bg-[#25D366] hover:bg-[#128C7E] rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
                            aria-label="Contact us on WhatsApp"
                        >
                            <svg
                                viewBox="0 0 32 32"
                                className="h-8 w-8 text-white fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M16 2.9A13.1 13.1 0 0 0 2.9 16a13.1 13.1 0 0 0 13.1 13.1A13.1 13.1 0 0 0 29.1 16 13.1 13.1 0 0 0 16 2.9zm6.6 18.4c-.4.8-1.1 1.3-2 1.6-1.1.4-2.2.4-3.3-.2-1.9-1-3.6-2.4-5-4.2-1.4-1.8-2.2-3.8-2.1-5.9.1-1.6.8-3 2.1-4.1 1.2-1 2.6-1.3 4-1 .3.1.7.2 1 .4l.3.2c.5.3.8.7 1 1.2.2.5.2 1.1 0 1.6l-.5 1c-1 2-2 4-3.1 6-.2.3-.2.6.1.8s.5.3.8.2c1.4-.7 2.7-1.5 3.9-2.5.3-.2.6-.2.9.1s.5.5.8.9c.2.4.3.8.2 1.3-.1.5-.3 1-.7 1.4z"/>
                            </svg>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>WhatsApp ile ulaşın</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
