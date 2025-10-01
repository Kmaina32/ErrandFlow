
import { ErrandRequestForm } from '@/components/errands/errand-request-form';
import { Header } from '@/components/layout/header';

export default function Home() {

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Form Section - takes 1/2 on large screens */}
        <div className="lg:col-span-1 flex flex-col items-start p-4 md:p-6">
            <ErrandRequestForm />
        </div>

        {/* Map Section - takes 1/2 on large screens and is fixed */}
        <div className="hidden lg:block lg:col-span-1 relative">
           <div 
             className="absolute inset-0 bg-cover bg-center"
             style={{backgroundImage: "url('https://savvyerrands.com/wp-content/uploads/2024/07/about-1.jpg')"}}
           >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
           </div>
            <div className="relative flex h-full w-full items-center justify-center">
                <div className="text-center text-white p-8">
                    <h1 className="font-headline text-5xl font-bold tracking-tighter">
                        Tumia Kazi, <span className="text-primary">Sorted</span>.
                    </h1>
                    <p className="max-w-[600px] text-lg text-white/80 mt-4">
                        Pata time yako. Post any errand, from grocery shopping to
                        parcel pickups, and let our trusted riders take care of it
                        for you.
                    </p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
