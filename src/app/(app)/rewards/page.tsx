import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Gift, Coffee, Sprout } from 'lucide-react';

const rewards = [
  {
    title: 'Free Coffee',
    partner: 'The Daily Grind',
    points: 500,
    icon: Coffee,
  },
  {
    title: '10% Off Groceries',
    partner: 'Green Grocer',
    points: 1000,
    icon: Gift,
  },
  {
    title: 'Plant a Tree',
    partner: 'One Tree Planted',
    points: 1500,
    icon: Sprout,
  },
  {
    title: '$5 Donation',
    partner: 'Local Charity',
    points: 2000,
    icon: Gift,
  },
];

export default function RewardsPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
      <div className="space-y-8">
        <section>
          <Card className="bg-gradient-to-r from-primary to-green-600 text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy />
                Your EcoPoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-6xl font-bold">1,250</p>
              <p className="text-lg">Keep up the great work!</p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline mb-4">Redeem Your Points</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {rewards.map((reward, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{reward.title}</CardTitle>
                    <CardDescription>{reward.partner}</CardDescription>
                  </div>
                  <reward.icon className="h-10 w-10 text-accent" />
                </CardHeader>
                <CardContent className="flex-grow"></CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="font-bold text-lg text-primary">
                    {reward.points.toLocaleString()} pts
                  </div>
                  <Button disabled={1250 < reward.points}>Redeem</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>How to Earn Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <Trophy size={20}/>
                </div>
                <p><strong>Log your recycling/composting:</strong> +10 points per entry</p>
              </div>
               <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <Trophy size={20}/>
                </div>
                <p><strong>Complete a weekly challenge:</strong> +50 points</p>
              </div>
               <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <Trophy size={20}/>
                </div>
                <p><strong>Refer a friend:</strong> +100 points</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
