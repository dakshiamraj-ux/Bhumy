'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { identifyWasteMaterial, IdentifyWasteMaterialOutput } from '@/ai/flows/smart-waste-scanner-identifies-material';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Loader2, CheckCircle, Recycle, AlertTriangle, Camera, Image as ImageIcon, CircleDotDashed } from 'lucide-react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function WasteScanner() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<IdentifyWasteMaterialOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();

  const cleanupCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    // Cleanup camera when the component is unmounted
    return () => {
      cleanupCamera();
    };
  }, [cleanupCamera]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTabChange = (value: string) => {
    setResult(null);
    setImagePreview(null);
    if(value === 'upload') {
        cleanupCamera();
    } else {
        requestCameraPermission();
    }
  };

  const requestCameraPermission = async () => {
    if (stream) return; // Already have a stream

    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(cameraStream);
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
    }
  };
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if(context) {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/png');
            setImagePreview(dataUrl);
            cleanupCamera();
        }
    }
  };

  const handleScan = async () => {
    if (!imagePreview) {
      toast({
        variant: 'destructive',
        title: 'No Image Provided',
        description: 'Please upload or capture an image to scan.',
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
      <Tabs defaultValue="upload" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload Image
          </TabsTrigger>
          <TabsTrigger value="camera">
            <Camera className="mr-2 h-4 w-4" />
            Use Camera
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
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
                      <ImageIcon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">Click or drag to upload an image</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG, or WEBP.</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="camera">
            <Card className="border-muted-foreground/50">
                <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 min-h-[200px]">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border shadow-md bg-muted">
                           {imagePreview ? (
                                <Image src={imagePreview} alt="Captured waste item" fill className="object-cover" />
                           ) : (
                                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                           )}
                           <canvas ref={canvasRef} className="hidden" />
                        </div>
                        {hasCameraPermission === false && (
                           <Alert variant="destructive">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access in your browser to use this feature.
                            </AlertDescription>
                           </Alert>
                        )}
                        {!imagePreview && stream && (
                            <Button onClick={handleCapture} size="lg">
                                <CircleDotDashed className="mr-2 h-5 w-5" />
                                Capture Photo
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

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
          <CardContent className="p-6 space-y-4">
             <div>
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><CheckCircle className="text-primary"/> Identified Material</h3>
                <p className="text-2xl font-bold text-primary pl-8">{result.material}</p>
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
