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
  BarChart3,
  ScanLine,
  Trophy,
  ArrowRight,
  Store,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function DashboardPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'dashboard-hero');

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      <Card className="overflow-hidden">
        <div className="relative h-48 w-full md:h-64">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-white md:text-4xl font-headline">
              Welcome to Gaia Loop
            </h1>
            <p className="mt-2 text-lg text-primary-foreground/90">
              Your partner in building a sustainable future.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-primary" />
              Your Waste Footprint
            </CardTitle>
            <CardDescription>
              This week's progress towards a zero-waste lifestyle.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Recycled</span>
                  <span>4.2 kg / 5 kg</span>
                </div>
                <Progress value={84} />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Composted</span>
                  <span>2.5 kg / 3 kg</span>
                </div>
                <Progress value={83} />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Landfill</span>
                  <span className="text-destructive">0.8 kg / 0.5 kg limit</span>
                </div>
                <Progress value={160} className="[&>div]:bg-destructive" />
              </div>
            </div>
          </CardContent>
          <CardContent>
             <Button asChild variant="outline" className="w-full">
              <Link href="/footprint">
                View Detailed Report <ArrowRight />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              EcoPoints Balance
            </CardTitle>
            <CardDescription>
              Earn points for your green habits.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center gap-2">
            <p className="text-6xl font-bold text-primary">1,250</p>
            <p className="text-muted-foreground">EcoPoints</p>
          </CardContent>
          <CardContent>
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/rewards">
                Redeem Rewards <ArrowRight />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-2 lg:col-span-1">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScanLine />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/scanner">Scan New Waste Item</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store />
                Marketplace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/marketplace">Browse Listings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
