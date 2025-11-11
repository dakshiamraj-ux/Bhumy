
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Newspaper, Bot, Users } from 'lucide-react';
import { BhumyChat } from '@/components/features/bhumy-chat';
import { CommunityChallenges } from '@/components/features/community-challenges';
import { LocalStats } from '@/components/features/local-stats';

const faqItems = [
  {
    question: 'What is the difference between recycling and upcycling?',
    answer:
      'Recycling involves breaking down waste materials to create new products, often of lower quality (downcycling). Upcycling, on the other hand, is the process of transforming waste materials or unwanted products into new materials or products of better quality or for better environmental value.',
  },
  {
    question: 'How do I start composting at home?',
    answer:
      'Starting a compost bin is easy! You need a good mix of "greens" (like fruit/vegetable scraps, coffee grounds) and "browns" (like dry leaves, cardboard, newspaper). Layer them in a bin, keep it moist, and turn it occasionally to aerate. In a few months, you\'ll have nutrient-rich compost for your garden.',
  },
  {
    question: 'What are biogas plants and how do they work?',
    answer:
      'Biogas plants use a process called anaerobic digestion to break down organic matter like food waste, manure, and sewage. This process produces biogas (a renewable energy source) and a nutrient-rich digestate that can be used as fertilizer. It\'s a great way to manage waste and generate clean energy.',
  },
  {
    question: 'Why can\'t I recycle all types of plastic?',
    answer:
      'Plastics are categorized into seven types. While some (like PET #1 and HDPE #2) are widely recycled, others are more difficult and costly to process due to their chemical composition, color, or the presence of additives. Always check your local recycling guidelines to see what\'s accepted.',
  },
];

const newsItems = [
    {
        title: 'How AI is helping to build a more sustainable future',
        source: 'Google Blog',
        snippet: 'Learn how AI is helping to design out waste and pollution, keep products and materials in use, and regenerate natural systems.',
        url: 'https://blog.google/outreach-initiatives/sustainability/how-ai-is-helping-to-build-a-more-sustainable-future/',
        imageId: 'education-news-1',
    },
    {
        title: 'New ways we’re helping you live more sustainably',
        source: 'The Keyword',
        snippet: 'Discover new features in Google products that make it easier to find sustainable options, from travel to shopping.',
        url: 'https://blog.google/products/search/new-ways-were-helping-you-live-more-sustainably-2022/',
        imageId: 'education-news-2',
    },
    {
        title: 'Our third-party verified environmental report',
        source: 'Google Sustainability',
        snippet: 'Explore Google\'s latest environmental report for a deeper look at their progress toward a carbon-free future.',
        url: 'https://sustainability.google/reports/environmental-report-2023/',
        imageId: 'education-news-3',
    }
];


export default function EducationPage() {
  const recyclingImg = PlaceHolderImages.find(p => p.id === 'education-recycling');
  const compostingImg = PlaceHolderImages.find(p => p.id === 'education-composting');
  
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="space-y-12">
        <section className="text-center">
          <h1 className="text-4xl font-bold font-headline">Education Hub</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your gateway to sustainable knowledge and community action.
          </p>
        </section>

        <LocalStats />

        <section>
          <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2"><BookOpen/> Learn</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="p-0">
                 {recyclingImg && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                    <Image src={recyclingImg.imageUrl} alt={recyclingImg.description} fill className="object-cover" data-ai-hint={recyclingImg.imageHint}/>
                  </div>
                 )}
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold">The World of Recycling</h3>
                <p className="mt-2 text-muted-foreground">Discover what happens to your recyclables and how to recycle effectively.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="p-0">
                {compostingImg && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                    <Image src={compostingImg.imageUrl} alt={compostingImg.description} fill className="object-cover" data-ai-hint={compostingImg.imageHint}/>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold">Composting 101</h3>
                <p className="mt-2 text-muted-foreground">Turn your food scraps into "black gold" for your garden.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section>
            <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2"><Newspaper/> Recent News</h2>
            <div className="grid gap-6 md:grid-cols-1">
                {newsItems.map((item, index) => {
                    const image = PlaceHolderImages.find(p => p.id === item.imageId);
                    return (
                        <Link href={item.url} target="_blank" rel="noopener noreferrer" key={index} className="block group">
                            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                                <div className="md:flex">
                                    {image && (
                                        <div className="md:w-1/3 relative aspect-video md:aspect-auto">
                                            <Image src={image.imageUrl} alt={item.title} fill className="object-cover" data-ai-hint={image.imageHint}/>
                                        </div>
                                    )}
                                    <div className="md:w-2/3 flex flex-col">
                                        <CardHeader>
                                            <CardTitle className="text-lg group-hover:text-primary transition-colors">{item.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-sm text-muted-foreground">{item.snippet}</p>
                                        </CardContent>
                                        <CardContent className="flex justify-end items-center gap-2 text-sm font-semibold text-primary">
                                            Read More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </CardContent>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </section>

        <section>
             <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2"><Bot/> AI Research Assistant</h2>
             <div className="h-[400px] md:h-[500px] p-0 md:p-0 lg:p-0">
                <BhumyChat />
            </div>
        </section>

        <CommunityChallenges />

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
