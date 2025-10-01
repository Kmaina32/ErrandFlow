
import { ErrandRequestForm } from '@/components/errands/errand-request-form';
import { Header } from '@/components/layout/header';
import { Badge } from '@/components/ui/badge';
import { Bot, PencilLine, Send } from 'lucide-react';

export default function Home() {

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Form Section */}
        <div className="lg:col-span-1 flex flex-col items-start p-4 md:p-6 lg:order-1 order-2">
            <ErrandRequestForm />
        </div>

        {/* Info/Image Section */}
        <div className="lg:col-span-1 lg:order-2 order-1 p-4 lg:p-0">
          <div className="relative min-h-[300px] lg:min-h-full h-full w-full rounded-lg lg:rounded-none overflow-hidden">
            
            {/* Mobile Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center lg:hidden"
              style={{backgroundImage: "url('https://savvyerrands.com/wp-content/uploads/2024/07/about-1.jpg')"}}
            >
                <div className="absolute inset-0 bg-black/50" />
            </div>
            
            {/* Content for both mobile and desktop */}
            <div className="relative flex h-full w-full items-center justify-center lg:bg-muted/40">
                  <div className="text-center lg:text-left text-white lg:text-foreground p-8 max-w-2xl w-full">
                      <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
                          Tumia Kazi, <span className="text-primary">Sorted</span>.
                      </h1>
                      <p className="max-w-[600px] text-md md:text-lg text-white/80 lg:text-muted-foreground mt-4 mx-auto lg:mx-0">
                          Pata time yako. Post any errand and let our trusted riders take care of it.
                      </p>

                    {/* "How it works" section - Hidden on Mobile */}
                    <div className="hidden lg:block mt-12 space-y-8">
                        <div className="flex items-start gap-4">
                            <Badge variant="outline" className="p-3 bg-primary/10 border-primary/20">
                                <PencilLine className="h-6 w-6 text-primary" />
                            </Badge>
                            <div>
                                <h3 className="font-semibold text-lg">1. Post Your Errand</h3>
                                <p className="text-muted-foreground">Fill out the form with your details, what you need done, and where it needs to go.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Badge variant="outline" className="p-3 bg-primary/10 border-primary/20">
                                <Bot className="h-6 w-6 text-primary" />
                            </Badge>
                            <div>
                                <h3 className="font-semibold text-lg">2. Get AI Price</h3>
                                <p className="text-muted-foreground">Our AI analyzes the task and gives you a fair, real-time price recommendation.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Badge variant="outline" className="p-3 bg-primary/10 border-primary/20">
                                <Send className="h-6 w-6 text-primary" />
                            </Badge>
                            <div>
                                <h3 className="font-semibold text-lg">3. Rider on the Way</h3>
                                <p className="text-muted-foreground">Once submitted, your request is sent out and a nearby rider will pick it up.</p>
                            </div>
                        </div>
                    </div>

                  </div>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}
