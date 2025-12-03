import { Car, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <Car className="h-8 w-8 text-accent" />
                            <span className="text-2xl font-headline font-bold text-primary-foreground">Avşarlı Otomotiv</span>
                        </Link>
                        <p className="text-sm text-primary-foreground/80 max-w-xs">Güvenilir ve kaliteli ikinci el araç alım satımının doğru adresi.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-headline font-semibold text-primary-foreground mb-4">Hızlı Erişim</h3>
                        <ul className="space-y-2 text-primary-foreground/80">
                            <li><Link href="#listings" className="hover:text-accent transition-colors">İlanlar</Link></li>
                            <li><Link href="#about" className="hover:text-accent transition-colors">Hakkımızda</Link></li>
                            <li><Link href="#contact" className="hover:text-accent transition-colors">İletişim</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-headline font-semibold text-primary-foreground mb-4">İletişim</h3>
                        <ul className="space-y-3 text-primary-foreground/80">
                            <li className="flex items-center gap-3 justify-center md:justify-start">
                                <MapPin className="h-5 w-5 text-accent"/>
                                <span>Oto Center, Bağcılar/İstanbul</span>
                            </li>
                            <li className="flex items-center gap-3 justify-center md:justify-start">
                                <Phone className="h-5 w-5 text-accent"/>
                                <a href="tel:+905000000000" className="hover:text-accent transition-colors">+90 500 000 00 00</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/70">
                    <p>&copy; {new Date().getFullYear()} Avşarlı Otomotiv. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    );
}
