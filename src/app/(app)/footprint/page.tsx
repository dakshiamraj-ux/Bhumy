'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, PieChart, Pie, Cell } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

const weeklyChartData = [
  { day: 'Mon', landfill: 0.2, recycling: 1.5, compost: 0.8 },
  { day: 'Tue', landfill: 0.3, recycling: 1.2, compost: 0.6 },
  { day: 'Wed', landfill: 0.1, recycling: 2.0, compost: 1.0 },
  { day: 'Thu', landfill: 0.5, recycling: 0.8, compost: 0.4 },
  { day: 'Fri', landfill: 0.2, recycling: 1.8, compost: 0.9 },
  { day: 'Sat', landfill: 0.6, recycling: 2.5, compost: 1.2 },
  { day: 'Sun', landfill: 0.4, recycling: 2.2, compost: 1.1 },
];

const weeklyChartConfig = {
  landfill: {
    label: 'Landfill',
    color: 'hsl(var(--destructive))',
  },
  recycling: {
    label: 'Recycling',
    color: 'hsl(var(--chart-1))',
  },
  compost: {
    label: 'Compost',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const totalWasteData = [
  { type: 'Recycling', value: 11, fill: 'hsl(var(--chart-1))' },
  { type: 'Compost', value: 6, fill: 'hsl(var(--chart-2))' },
  { type: 'Landfill', value: 2.3, fill: 'hsl(var(--destructive))' },
];

const totalWasteConfig = {
  recycling: { label: 'Recycling' },
  compost: { label: 'Compost' },
  landfill: { label: 'Landfill' },
} satisfies ChartConfig;

export default function FootprintPage() {
  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
      <div className="space-y-8">
        <section className="text-center">
          <h1 className="text-3xl font-bold font-headline">
            Your Waste Footprint
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Track your progress and discover insights into your waste habits.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Recycling</CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">45.8 kg</p>
              <p className="text-sm text-green-600">+15% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Diversion Rate</CardTitle>
              <CardDescription>Waste diverted from landfill</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">88%</p>
              <p className="text-sm text-green-600">Goal: 90%</p>
            </CardContent>
          </Card>
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>Landfill Waste</CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-destructive">6.2 kg</p>
              <p className="text-sm text-red-600">-5% from last month</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Waste Breakdown</CardTitle>
              <CardDescription>Amount of waste by type (in kg)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={weeklyChartConfig} className="h-64 w-full">
                <BarChart data={weeklyChartData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                   <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    unit="kg"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="landfill"
                    stackId="a"
                    fill="var(--color-landfill)"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="compost"
                    stackId="a"
                    fill="var(--color-compost)"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="recycling"
                    stackId="a"
                    fill="var(--color-recycling)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This Week's Total Composition</CardTitle>
              <CardDescription>Total waste generated this week: 19.3 kg</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ChartContainer config={totalWasteConfig} className="h-64 w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie data={totalWasteData} dataKey="value" nameKey="type" innerRadius={60} outerRadius={90}>
                    {totalWasteData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
                <CardTitle>Micro-Habit Suggestions</CardTitle>
                <CardDescription>Small changes, big impact.</CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4 md:grid-cols-2'>
                <div className='flex items-start gap-4 rounded-lg border p-4'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary'>🌱</div>
                    <div>
                        <h4 className='font-semibold'>Carry a Reusable Water Bottle</h4>
                        <p className='text-sm text-muted-foreground'>Reduce single-use plastic waste and save money.</p>
                    </div>
                </div>
                 <div className='flex items-start gap-4 rounded-lg border p-4'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary'>🥕</div>
                    <div>
                        <h4 className='font-semibold'>Plan Your Meals</h4>
                        <p className='text-sm text-muted-foreground'>Buy only what you need to reduce food waste.</p>
                    </div>
                </div>
                 <div className='flex items-start gap-4 rounded-lg border p-4'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary'>🛍️</div>
                    <div>
                        <h4 className='font-semibold'>Use Reusable Shopping Bags</h4>
                        <p className='text-sm text-muted-foreground'>Avoid plastic bags that pollute our oceans.</p>
                    </div>
                </div>
                <div className='flex items-start gap-4 rounded-lg border p-4'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary'>☕</div>
                    <div>
                        <h4 className='font-semibold'>Bring Your Own Coffee Cup</h4>
                        <p className='text-sm text-muted-foreground'>Disposable coffee cups are often not recyclable.</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
