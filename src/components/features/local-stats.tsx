'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Recycle, Gauge } from "lucide-react";

const stats = [
    {
        title: "AQI (Air Quality)",
        value: "152",
        status: "Unhealthy",
        icon: Wind,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/50"
    },
    {
        title: "Recycling Rate",
        value: "42%",
        status: "Improving",
        icon: Recycle,
        color: "text-green-600",
        bgColor: "bg-green-100 dark:bg-green-900/50"
    },
    {
        title: "Landfill Diversion",
        value: "58%",
        status: "Goal: 75%",
        icon: Gauge,
        color: "text-blue-600",
        bgColor: "bg-blue-100 dark:bg-blue-900/50"
    }
];


export function LocalStats() {
    return (
         <section className="space-y-4">
            <h2 className="text-2xl font-bold font-headline">Your Local Environment: Noida</h2>
            <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat, index) => (
                    <Card key={index} className={stat.bgColor}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                           <CardTitle className={`text-sm font-medium ${stat.color}`}>{stat.title}</CardTitle>
                           <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.status}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
         </section>
    )
}