import Link from 'next/link';
import { Car, Menu, LogIn } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '../ui/sheet';
import { Separator } from '../ui/separator';

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
                <a href="tel:+905542140263" className="hidden md:inline-flex">
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
                        <SheetContent side="right" className="flex flex-col">
                            <div className="p-6 border-b">
                                <Link href="/" className="flex items-center gap-3 group">
                                    <Car className="h-8 w-8 text-primary" />
                                    <span className="text-xl font-headline font-bold text-foreground">
                                        Avşarlı Otomotiv
                                    </span>
                                </Link>
                            </div>
                            <nav className="flex flex-col gap-1 p-4 text-lg font-medium flex-1">
                                <SheetClose asChild>
                                    <Link href="#listings" className="px-2 py-3 rounded-md hover:bg-muted">İlanlar</Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href="#about" className="px-2 py-3 rounded-md hover:bg-muted">Hakkımızda</Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link href="#contact" className="px-2 py-3 rounded-md hover:bg-muted">İletişim</Link>
                                </SheetClose>
                                
                                <Separator className="my-2" />

                                <SheetClose asChild>
                                    <Link href="/admin/login" className="flex items-center gap-3 px-2 py-3 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                                        <LogIn className="h-5 w-5" />
                                        <span>Giriş Yap</span>
                                    </Link>
                                </SheetClose>
                            </nav>
                            <div className="p-4 mt-auto border-t">
                                <a href="tel:+905542140263" className="w-full">
                                    <Button size="lg" className="w-full bg-primary text-primary-foreground">
                                        Hemen Ara
                                    </Button>
                                </a>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
