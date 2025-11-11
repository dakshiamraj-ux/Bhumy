'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Zap, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const challenges = [
    {
        title: "Zero-Waste Week",
        description: "Try to produce as little landfill waste as possible for 7 days.",
        points: 200,
        progress: 60,
        icon: Zap
    },
    {
        title: "Compost Champion",
        description: "Start a new compost pile or contribute to a community one.",
        points: 150,
        progress: 90,
        icon: Award
    }
];

const leaderboard = [
    { name: "Anika S.", points: 1250, rank: 1 },
    { name: "Rohan V.", points: 1180, rank: 2 },
    { name: "Priya K.", points: 1120, rank: 3 },
]

export function CommunityChallenges() {
    const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

    return (
        <section className="space-y-8">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2"><Users /> Community Challenges</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {challenges.map((challenge, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <challenge.icon className="text-primary" />
                                        {challenge.title}
                                    </CardTitle>
                                    <CardDescription>{challenge.description}</CardDescription>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-primary">{challenge.points} pts</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-2">
                             <div>
                                <div className="mb-1 flex justify-between text-xs font-medium">
                                    <span>Community Progress</span>
                                    <span>{challenge.progress}%</span>
                                </div>
                                <Progress value={challenge.progress} />
                            </div>
                        </CardContent>
                        <CardContent>
                            <Button className="w-full">Join Challenge</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Monthly Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {leaderboard.map((user, index) => (
                             <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-lg w-6 text-center">{user.rank}</span>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={userAvatar?.imageUrl} alt="User" data-ai-hint={userAvatar?.imageHint} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-medium">{user.name}</p>
                                </div>
                                <p className="font-bold text-primary">{user.points.toLocaleString()} pts</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
