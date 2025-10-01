
import Image from 'next/image';
import { ErrandRequestForm } from '@/components/errands/errand-request-form';
import { Header } from '@/components/layout/header';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Clock, ShieldCheck, Rocket } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {

  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const howItWorksImage = PlaceHolderImages.find(p => p.id === 'how-it-works-1');

  const features = [
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: 'Save Time',
      description: 'Reclaim your day. Let us handle the running around so you can focus on what truly matters.',
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: 'Trusted & Vetted Riders',
      description: 'Your errands are in safe hands. All our riders are carefully vetted for your peace of mind.',
    },
    {
      icon: <Rocket className="h-10 w-10 text-primary" />,
      title: 'Fast & Efficient',
      description: 'From pickup to drop-off, we prioritize speed and efficiency to get your tasks done quickly.',
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                 <div className="relative order-1 aspect-[16/10] w-full max-w-lg overflow-hidden rounded-xl shadow-lg lg:hidden">
                    {heroImage && <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={heroImage.imageHint}
                    />}
                </div>
                <div className="order-2 space-y-4 lg:order-1">
                    <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Tumia Kazi, <span className="text-primary">Sorted</span>.
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Pata time yako. Post any errand, from grocery shopping to
                    parcel pickups, and let our trusted riders take care of it
                    for you.
                    </p>
                </div>
                 <div className="hidden relative mt-4 aspect-[16/10] w-full max-w-lg overflow-hidden rounded-xl shadow-lg lg:order-2 lg:block">
                     {heroImage && <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={heroImage.imageHint}
                    />}
                </div>
              </div>
               <div className="flex flex-col items-start justify-center space-y-4">
                <ErrandRequestForm />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How It Works</div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Three Steps to Freedom</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Getting your errands done has never been easier.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                    {howItWorksImage && <Image
                        src={howItWorksImage.imageUrl}
                        alt={howItWorksImage.description}
                        width={600}
                        height={400}
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                        data-ai-hint={howItWorksImage.imageHint}
                    />}
                    <div className="flex flex-col justify-center space-y-4">
                        <ul className="grid gap-6">
                            <li>
                                <div className="grid gap-1">
                                    <h3 className="text-xl font-bold">1. Post Your Errand</h3>
                                    <p className="text-muted-foreground">Fill out our simple form with the details of your task. It only takes a minute.</p>
                                </div>
                            </li>
                            <li>
                                <div className="grid gap-1">
                                    <h3 className="text-xl font-bold">2. Get a Price</h3>
                                    <p className="text-muted-foreground">Our AI provides a fair price estimate instantly. Your request is then sent to nearby riders.</p>
                                </div>
                            </li>
                            <li>
                                <div className="grid gap-1">
                                    <h3 className="text-xl font-bold">3. Errand Complete!</h3>
                                    <p className="text-muted-foreground">A rider accepts, completes your task, and you get your time back. It's that simple.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Why Choose Us?</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Built for Your Convenience</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        We've designed ErrandFlow with your needs in mind.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} ErrandFlow. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
