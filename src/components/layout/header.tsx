import Link from 'next/link';
import { Car } from 'lucide-react';
import { Button } from '../ui/button';

export default function Header() {
    return (
        <header className="bg-card shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <Car className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
                    <span className="text-xl md:text-2xl font-headline font-bold text-foreground whitespace-nowrap">
                        Avşarlı Otomotiv
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-2 lg:gap-4 text-base font-medium">
                    <Button variant="ghost" asChild>
                        <Link href="#listings">İlanlar</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="#about">Hakkımızda</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="#contact">İletişim</Link>
                    </Button>
                </nav>
                <Button className="hidden md:inline-flex bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground">
                    <a href="tel:+905000000000">Hemen Ara</a>
                </Button>
                <Button size="icon" variant="ghost" className="md:hidden">
                    {/* Placeholder for mobile menu trigger */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </Button>
            </div>
        </header>
    );
}
