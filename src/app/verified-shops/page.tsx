import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ShieldCheck } from 'lucide-react';
import { PlaceholderShops, type ShopPlaceholder } from '@/lib/placeholder-shops';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

function getShopData() {
    const shops = PlaceholderShops;
    const images = PlaceHolderImages;

    return shops.map(shop => {
        const image = images.find(img => img.id === shop.imageId);
        return {
            ...shop,
            imageUrl: image?.imageUrl,
            imageHint: image?.imageHint,
            imageDescription: image?.description,
        };
    });
}


export default function VerifiedShopsPage() {
    const shops = getShopData();

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 text-foreground">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline flex items-center gap-3">
                                <ShieldCheck className="h-10 w-10 text-primary" />
                                Verified Shops
                            </h1>
                            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Shop with confidence. We've vetted these businesses to ensure you get quality and reliability.
                            </p>
                        </div>
                    </div>

                    {shops.length === 0 ? (
                        <div className="text-center text-muted-foreground py-10">
                            <p>No verified shops available at the moment. Please check back later.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {shops.map((shop) => (
                                <Card key={shop.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                     {shop.imageUrl && (
                                        <div className="relative aspect-video w-full">
                                            <Image
                                                src={shop.imageUrl}
                                                alt={shop.imageDescription || shop.name}
                                                fill
                                                className="object-cover"
                                                data-ai-hint={shop.imageHint}
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle className="text-xl">{shop.name}</CardTitle>
                                        <Badge variant="secondary" className="w-fit">{shop.category}</Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center text-muted-foreground">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            <span>{shop.location}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
             <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
                <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} ErrandFlow. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
