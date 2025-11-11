import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight,
  Leaf,
  ScanLine,
  Sprout,
  Store,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function DashboardPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'dashboard-hero');

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="relative h-56 w-full md:h-72">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 via-primary/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="text-4xl font-bold text-white md:text-5xl drop-shadow-lg font-headline">
              Welcome to Bhumy
            </h1>
            <p className="mt-2 text-lg text-primary-foreground/90 drop-shadow-md">
              Your partner in building a sustainable future.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="flex flex-col md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="text-primary" />
              Weekly Eco-Report
            </CardTitle>
            <CardDescription>
              Your progress towards a zero-waste lifestyle.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex justify-between text-sm font-medium">
                  <span>Recycling</span>
                  <span>4.2 kg / 5 kg</span>
                </div>
                <Progress value={84} />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm font-medium">
                  <span>Composting</span>
                  <span>2.5 kg / 3 kg</span>
                </div>
                <Progress value={83} />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm font-medium">
                  <span>Landfill</span>
                  <span className="text-destructive">0.8 kg / 0.5 kg</span>
                </div>
                <Progress value={160} className="[&>div]:bg-destructive" />
              </div>
            </div>
          </CardContent>
          <CardContent>
             <Button asChild variant="ghost" className="w-full text-primary hover:text-primary">
              <Link href="/footprint">
                View Detailed Report <ArrowRight />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="flex flex-col text-center bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Leaf/>
                  EcoPoints Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center justify-center gap-1">
                <p className="text-6xl font-bold">1,250</p>
                <p className="text-primary-foreground/80">Points</p>
              </CardContent>
              <CardContent>
                <Button asChild className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  <Link href="/rewards">
                    Redeem Rewards <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
        </div>
      </div>
       <div className="grid gap-6 md:grid-cols-2">
           <Card className='hover:shadow-md transition-shadow'>
            <CardContent className='p-6 flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <div className='p-3 rounded-lg bg-primary/10'>
                        <ScanLine className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h3 className='font-semibold text-lg'>Scan New Item</h3>
                        <p className='text-muted-foreground text-sm'>Identify and log your waste.</p>
                    </div>
                </div>
              <Button asChild variant="outline" size="icon">
                <Link href="/scanner"><ArrowRight/></Link>
              </Button>
            </CardContent>
          </Card>
          <Card className='hover:shadow-md transition-shadow'>
            <CardContent className='p-6 flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <div className='p-3 rounded-lg bg-primary/10'>
                        <Store className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h3 className='font-semibold text-lg'>Marketplace</h3>
                        <p className='text-muted-foreground text-sm'>Trade your valuable waste.</p>
                    </div>
                </div>
               <Button asChild variant="outline" size="icon">
                <Link href="/marketplace"><ArrowRight/></Link>
              </Button>
            </CardContent>
          </Card>
       </div>
    </div>
  );
}
