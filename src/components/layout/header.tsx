import Link from 'next/link';
import { Car, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '../ui/sheet';

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
                <a href="tel:+905000000000" className="hidden md:inline-flex">
                    <Button className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground">
                        Hemen Ara
                    </Button>
                </a>
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Menüyü aç</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col h-full">
                                <div className="p-6">
                                    <Link href="/" className="flex items-center gap-3 group">
                                        <Car className="h-8 w-8 text-primary" />
                                        <span className="text-xl font-headline font-bold text-foreground">
                                            Avşarlı Otomotiv
                                        </span>
                                    </Link>
                                </div>
                                <nav className="flex flex-col gap-4 p-6 text-lg font-medium flex-1">
                                    <SheetClose asChild>
                                        <Link href="#listings" className="py-2">İlanlar</Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href="#about" className="py-2">Hakkımızda</Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href="#contact" className="py-2">İletişim</Link>
                                    </SheetClose>
                                </nav>
                                <div className="p-6 mt-auto">
                                    <a href="tel:+905000000000" className="w-full">
                                        <Button size="lg" className="w-full bg-primary text-primary-foreground">
                                            Hemen Ara
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

    