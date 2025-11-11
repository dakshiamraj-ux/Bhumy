
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
import { ArrowRight } from 'lucide-react';

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
        title: 'How we’re using AI to help build a circular economy',
        source: 'Google Blog',
        snippet: 'Learn how AI is helping to design out waste and pollution, keep products and materials in use, and regenerate natural systems.',
        url: 'https://blog.google/outreach-initiatives/sustainability/google-circular-economy-ai/',
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
        title: 'Our new Environmental Report is here',
        source: 'Google Sustainability',
        snippet: 'Explore Google\'s latest environmental report for a deeper look at their progress toward a carbon-free future.',
        url: 'https://sustainability.google/reports/environmental-report/',
        imageId: 'education-news-3',
    }
];


export default function EducationPage() {
  const recyclingImg = PlaceHolderImages.find(p => p.id === 'education-recycling');
  const compostingImg = PlaceHolderImages.find(p => p.id === 'education-composting');
  
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
      <div className="space-y-12">
        <section className="text-center">
          <h1 className="text-3xl font-bold font-headline">Knowledge Hub</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Learn more about waste management and sustainable living.
          </p>
        </section>

        <section>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                 {recyclingImg && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                    <Image src={recyclingImg.imageUrl} alt={recyclingImg.description} fill className="object-cover" data-ai-hint={recyclingImg.imageHint}/>
                  </div>
                 )}
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold">The World of Recycling</h3>
                <p className="mt-2 text-muted-foreground">Discover what happens to your recyclables after they leave the curb and how you can recycle more effectively.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                {compostingImg && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                    <Image src={compostingImg.imageUrl} alt={compostingImg.description} fill className="object-cover" data-ai-hint={compostingImg.imageHint}/>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold">Composting 101</h3>
                <p className="mt-2 text-muted-foreground">Turn your food scraps into "black gold" for your garden. Learn the basics of home composting.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section>
            <h2 className="text-2xl font-bold font-headline mb-4 text-center">Recent News from Google</h2>
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
