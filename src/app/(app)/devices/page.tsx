
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
  HardDrive,
  Trash2,
  PlusCircle,
  Bell,
  User,
  Building,
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

const devices = [
  {
    id: 'BIN-001',
    name: 'Community Smart Bin',
    location: 'Sector 17, Chandigarh',
    status: 'online',
    fillLevel: 85,
    notificationTarget: 'nagarpalika',
  },
  {
    id: 'BIN-002',
    name: 'Home Compost Bin',
    location: 'My Apartment',
    status: 'online',
    fillLevel: 45,
    notificationTarget: 'user',
  },
  {
    id: 'BIN-003',
    name: 'Office Recycling Station',
    location: 'Phase 8, Mohali',
    status: 'offline',
    fillLevel: 0,
    notificationTarget: 'user',
  },
];

export default function DeviceHubPage() {
  const getFillColor = (level: number) => {
    if (level > 80) return '[&>div]:bg-destructive';
    if (level > 60) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-primary';
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="space-y-8">
        <section className="text-center">
          <h1 className="text-3xl font-bold font-headline">Device Hub</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Connect and manage your smart waste devices.
          </p>
        </section>

        <div className="flex justify-end">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Device
          </Button>
        </div>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {devices.map(device => (
            <Card key={device.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trash2 className="text-primary" />
                    {device.name}
                  </CardTitle>
                  <Badge
                    variant={
                      device.status === 'online' ? 'default' : 'destructive'
                    }
                    className="capitalize"
                  >
                    {device.status}
                  </Badge>
                </div>
                <CardDescription>{device.location}</CardDescription>
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
              <CardFooter>
                <Button
                  variant="secondary"
                  className="w-full"
                  disabled={device.status === 'offline'}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Send Test Notification
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}
