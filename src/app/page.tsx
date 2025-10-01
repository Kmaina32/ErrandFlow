
import { ErrandRequestForm } from '@/components/errands/errand-request-form';
import { Header } from '@/components/layout/header';

export default function Home() {

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Form Section - takes 1/2 on large screens */}
        <div className="lg:col-span-1 flex flex-col items-start p-4 md:p-6 lg:order-1 order-2">
            <ErrandRequestForm />
        </div>

        {/* Image Section - takes 1/2 on large screens, appears on top on mobile */}
        <div className="lg:col-span-1 lg:order-2 order-1 p-4 lg:p-0">
          <div className="relative min-h-[300px] lg:min-h-full h-full w-full rounded-lg lg:rounded-none overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{backgroundImage: "url('https://savvyerrands.com/wp-content/uploads/2024/07/about-1.jpg')"}}
            >
                <div className="absolute inset-0 bg-black/50 lg:backdrop-blur-sm" />
            </div>
              <div className="relative flex h-full w-full items-center justify-center">
                  <div className="text-center text-white p-8">
                      <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
                          Tumia Kazi, <span className="text-primary">Sorted</span>.
                      </h1>
                      <p className="max-w-[600px] text-md md:text-lg text-white/80 mt-4">
                          Pata time yako. Post any errand and let our trusted riders take care of it.
                      </p>
                  </div>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}
