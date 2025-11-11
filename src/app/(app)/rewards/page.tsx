'use client';

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
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';

type Reward = {
  title: string;
  partner: string;
  points: number;
  icon: 'Coffee' | 'Gift' | 'Sprout';
};

const iconMap = {
  Coffee,
  Gift,
  Sprout,
};

export default function RewardsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: userProfile } = useDoc(userProfileRef);
  const ecoPoints = userProfile?.ecoPoints ?? 0;

  const rewardsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'rewards');
  }, [firestore]);
  const { data: rewards, isLoading } = useCollection<Reward>(rewardsCollectionRef);

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
              <p className="text-6xl font-bold">{ecoPoints.toLocaleString()}</p>
              <p className="text-lg">Keep up the great work!</p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-headline mb-4">Redeem Your Points</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {isLoading && <p>Loading rewards...</p>}
            {rewards && rewards.map((reward, index) => {
              const IconComponent = iconMap[reward.icon as keyof typeof iconMap] || Gift;
              return (
              <Card key={index} className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{reward.title}</CardTitle>
                    <CardDescription>{reward.partner}</CardDescription>
                  </div>
                  <IconComponent className="h-10 w-10 text-accent" />
                </CardHeader>
                <CardContent className="flex-grow"></CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="font-bold text-lg text-primary">
                    {reward.points.toLocaleString()} pts
                  </div>
                  <Button disabled={ecoPoints < reward.points}>Redeem</Button>
                </CardFooter>
              </Card>
            )})}
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
