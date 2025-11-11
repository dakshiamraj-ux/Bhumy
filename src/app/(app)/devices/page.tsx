
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
import {
  Trash2,
  PlusCircle,
  Bell,
  User,
  Building,
  Loader2,
  Signal,
  SignalLow,
  SignalMedium,
  Bot,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  useCollection,
  useFirestore,
  useUser,
  useMemoFirebase,
} from '@/firebase';
import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { AddDeviceDialog } from '@/components/features/add-device-dialog';
import { useToast } from '@/hooks/use-toast';
import { type WithId } from '@/firebase/firestore/use-collection';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

// This corresponds to the 'Device' entity in backend.json
type Device = {
  id: string;
  userId: string;
  name: string;
  location: string;
  fillLevel: number;
  status: 'online' | 'offline';
  notificationTarget: 'user' | 'nagarpalika';
  lastUpdated: any; // Firestore Timestamp
};

export default function DeviceHubPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const devicesCollection = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'devices');
  }, [firestore, user]);

  const {
    data: devices,
    isLoading,
    error,
  } = useCollection<Device>(devicesCollection);

  const getFillColor = (level: number) => {
    if (level > 90) return '[&>div]:bg-destructive';
    if (level > 60) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-primary';
  };

  const handleSimulateFill = (deviceId: string) => {
    if (!firestore || !user) return;
    const newFillLevel = Math.min(
      Math.floor(Math.random() * 30 + 70),
      100
    );
    const deviceRef = doc(firestore, 'users', user.uid, 'devices', deviceId);

    updateDocumentNonBlocking(deviceRef, {
      fillLevel: newFillLevel,
      status: 'online',
      lastUpdated: serverTimestamp(),
    });

    if (newFillLevel > 90) {
      toast({
        title: 'Bin Almost Full!',
        description: `Device ${deviceId} has reached ${newFillLevel}% capacity. Sending notification.`,
      });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <p>Loading your devices...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-destructive bg-destructive/10 text-destructive-foreground">
          <p>Error loading devices: {error.message}</p>
        </div>
      );
    }

    if (!devices || devices.length === 0) {
      return (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed">
          <p className="mb-2 text-lg font-medium text-muted-foreground">
            No devices found.
          </p>
          <AddDeviceDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Device
            </Button>
          </AddDeviceDialog>
        </div>
      );
    }

    return (
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {devices.map(device => (
          <DeviceCard key={device.id} device={device} onSimulate={handleSimulateFill} />
        ))}
      </section>
    );
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="space-y-8">
        <section className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-3xl font-bold font-headline">Device Hub</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Connect and manage your smart waste devices.
            </p>
          </div>
          {devices && devices.length > 0 && (
            <AddDeviceDialog>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Device
              </Button>
            </AddDeviceDialog>
          )}
        </section>

        {renderContent()}
      </div>
    </div>
  );
}


function DeviceCard({ device, onSimulate }: { device: WithId<Device>, onSimulate: (id: string) => void }) {
  const getFillColor = (level: number) => {
    if (level > 90) return '[&>div]:bg-destructive';
    if (level > 60) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-primary';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      online: <Signal className="text-green-500" />,
      offline: <SignalLow className="text-gray-400" />,
    }
    return icons[status as keyof typeof icons] || <SignalMedium className="text-yellow-500" />;
  }

  return (
    <Card key={device.id} className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="text-primary" />
            {device.name}
          </CardTitle>
          <Badge
            variant={
              device.status === 'online' ? 'default' : 'secondary'
            }
            className="capitalize"
          >
            {getStatusIcon(device.status)}
            <span className='ml-1.5'>{device.status}</span>
          </Badge>
        </div>
        <CardDescription>{device.location}</CardDescription>
        <CardDescription className='text-xs'>ID: {device.id}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <Label
            htmlFor={`fill-level-${device.id}`}
            className="text-sm font-medium"
          >
            Fill Level ({device.fillLevel}%)
          </Label>
          <Progress
            id={`fill-level-${device.id}`}
            value={device.fillLevel}
            className={getFillColor(device.fillLevel)}
          />
        </div>
        <div>
          <Label
            htmlFor={`notify-${device.id}`}
            className="text-sm font-medium"
          >
            Notification Target
          </Label>
          <Select
            defaultValue={device.notificationTarget}
            disabled={device.status === 'offline'}
          >
            <SelectTrigger id={`notify-${device.id}`} className="w-full">
              <SelectValue placeholder="Select target" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Notify Me</span>
                </div>
              </SelectItem>
              <SelectItem value="nagarpalika">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Alert Nagarpalika</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className='flex-col items-stretch gap-2'>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => onSimulate(device.id)}
        >
          <Bot className="mr-2 h-4 w-4" />
          Simulate Fill
        </Button>
        <Button
          variant="outline"
          className="w-full"
          disabled={device.status === 'offline'}
        >
          <Bell className="mr-2 h-4 w-4" />
          Send Test Notification
        </Button>
      </CardFooter>
    </Card>
  )
}

    