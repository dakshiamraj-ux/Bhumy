import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

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

export default function EducationPage() {
  const recyclingImg = PlaceHolderImages.find(p => p.id === 'education-recycling');
  const compostingImg = PlaceHolderImages.find(p => p.id === 'education-composting');
  
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
      <div className="space-y-8">
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
