import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const marketplaceItems = [
  {
    id: 1,
    title: 'Upcycled Jute Tote Bag',
    category: 'Fashion',
    price: 'Trade / ₹1100',
    seller: 'Eco-Threads India',
    imageId: 'marketplace-item-2',
  },
  {
    id: 2,
    title: 'Rich Garden Compost (20L)',
    category: 'Gardening',
    price: '₹600',
    seller: 'Urban Roots',
    imageId: 'marketplace-item-3',
  },
  {
    id: 3,
    title: 'Recycled Plastic Filament',
    category: '3D Printing',
    price: 'Trade',
    seller: 'Re-Print Inc.',
    imageId: 'marketplace-item-1',
  },
  {
    id: 4,
    title: 'Glass Bottle Art Set',
    category: 'Art & Craft',
    price: '₹1500',
    seller: 'Glass Revival',
    imageId: 'marketplace-item-2',
  },
   {
    id: 5,
    title: 'All-Natural Citrus Cleaner',
    category: 'Home Goods',
    price: '₹900',
    seller: 'Swachh Homes',
    imageId: 'marketplace-item-4',
  },
   {
    id: 6,
    title: 'Scrap Wood Bundle',
    category: 'DIY Projects',
    price: 'Free',
    seller: 'Woodpecker',
    imageId: 'marketplace-item-1',
  },
];

export default function MarketplacePage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="space-y-8">
        <section className="text-center">
          <h1 className="text-3xl font-bold font-headline">Waste-to-Value Marketplace</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            One person's trash is another's treasure. Connect and trade valuable waste materials.
          </p>
        </section>

        <section>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {marketplaceItems.map(item => {
              const image = PlaceHolderImages.find(p => p.id === item.imageId);
              return (
                <Card key={item.id} className="flex flex-col overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative aspect-4/3 w-full">
                     {image && (
                        <Image
                            src={image.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                        />
                     )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">by {item.seller}</p>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
                    <p className="font-semibold text-primary">{item.price}</p>
                    <Button size="sm">View</Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
