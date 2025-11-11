'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { identifyWasteMaterial, IdentifyWasteMaterialOutput } from '@/ai/flows/smart-waste-scanner-identifies-material';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Image as ImageIcon, Loader2, CheckCircle, Recycle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export function WasteScanner() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [result, setResult] = useState<IdentifyWasteMaterialOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResult(null);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!imageFile || !imagePreview) {
      toast({
        variant: 'destructive',
        title: 'No Image Selected',
        description: 'Please select an image file to scan.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await identifyWasteMaterial({ photoDataUri: imagePreview });
      setResult(response);
    } catch (error) {
      console.error('Error identifying waste material:', error);
      toast({
        variant: 'destructive',
        title: 'Scan Failed',
        description: 'The AI model could not identify the item. Please try another image.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="space-y-8">
      <Card
        className="border-2 border-dashed border-muted-foreground/50 hover:border-primary transition-colors duration-300"
        onClick={triggerFileSelect}
      >
        <CardContent className="p-6 text-center cursor-pointer">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
          <div className="flex flex-col items-center justify-center space-y-4 min-h-[200px]">
            {imagePreview ? (
              <div className="relative w-48 h-48 rounded-lg overflow-hidden border shadow-md">
                <Image src={imagePreview} alt="Selected waste item" fill className="object-cover" />
              </div>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <UploadCloud className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Click or drag to upload an image</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG, or WEBP. Max 5MB.</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={handleScan} disabled={!imagePreview || isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Scanning...
            </>
          ) : (
            'Scan Item'
          )}
        </Button>
      </div>
      
      {result && (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <CheckCircle className="text-primary"/>
                Scan Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Identified Material</h3>
                <p className="text-2xl font-bold text-primary">{result.material}</p>
             </div>
             <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Disposal & Reuse Suggestions</h3>
                <ul className="mt-2 space-y-2">
                    {result.disposalMethods.map((method, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 rounded-md bg-background border">
                            <Recycle className="h-5 w-5 text-green-600 mt-0.5 shrink-0"/>
                            <span>{method}</span>
                        </li>
                    ))}
                </ul>
             </div>
             <div className="flex items-start gap-3 p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
                <p className="text-sm">Please always check your local recycling and waste management guidelines, as regulations can vary by location.</p>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
