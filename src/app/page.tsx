
import Image from 'next/image';
import { ErrandRequestForm } from '@/components/errands/errand-request-form';
import { Header } from '@/components/layout/header';

export default function Home() {

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col items-start justify-center space-y-4 lg:order-2 lg:items-center">
                <ErrandRequestForm />
              </div>
              <div className="flex flex-col justify-center space-y-4 lg:order-1">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Tumia Kazi, <span className="text-primary">Sorted</span>.
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Pata time yako. Post any errand, from grocery shopping to
                  parcel pickups, and let our trusted riders take care of it
                  for you.
                </p>
                  <div className="relative mt-4 aspect-[16/10] w-full max-w-lg overflow-hidden rounded-xl shadow-lg">
                    <Image
                      src="/placeholder.jpg"
                      alt="A person happily receiving a delivery package at their door."
                      fill
                      className="object-cover"
                      data-ai-hint="delivery person"
                    />
                  </div>
              </div>
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
