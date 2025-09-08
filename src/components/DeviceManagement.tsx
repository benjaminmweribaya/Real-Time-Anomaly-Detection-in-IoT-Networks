import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDevices } from '@/hooks/useDevices';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Activity,
  MapPin,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DeviceManagement = () => {
  const { devices, loading, createDevice, updateDevice, deleteDevice } = useDevices();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.device_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.location?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4 text-device-online" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-device-offline" />;
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4 text-device-warning" />;
      default:
        return <WifiOff className="w-4 h-4 text-device-offline" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      online: 'bg-device-online text-device-online',
      offline: 'bg-device-offline text-device-offline',
      maintenance: 'bg-device-warning text-device-warning'
    };

    const displayStatus = status === 'maintenance' ? 'warning' : status;
    
    return (
      <Badge className={cn('status-' + status, variants[status as keyof typeof variants])}>
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
      </Badge>
    );
  };

  const statusCounts = {
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    warning: devices.filter(d => d.status === 'maintenance').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Device Management</h2>
          <p className="text-muted-foreground">Monitor and manage all IoT devices</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Device
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Devices</p>
                <p className="text-2xl font-bold">{devices.length}</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Online</p>
                <p className="text-2xl font-bold text-device-online">{statusCounts.online}</p>
              </div>
              <Wifi className="w-8 h-8 text-device-online" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-device-warning">{statusCounts.warning}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-device-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-device-offline">{statusCounts.offline}</p>
              </div>
              <WifiOff className="w-8 h-8 text-device-offline" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="glass shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search devices by name, type, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Device Table */}
      <Card className="glass shadow-card">
        <CardHeader>
          <CardTitle>Device Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(device.status)}
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-sm text-muted-foreground">{device.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{device.device_type}</TableCell>
                  <TableCell>{getStatusBadge(device.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      {device.location || 'No location'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {device.last_heartbeat ? new Date(device.last_heartbeat).toLocaleString() : 'Never'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedDevice(device)}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass">
                        <DialogHeader>
                          <DialogTitle>Device Details: {selectedDevice?.name}</DialogTitle>
                          <DialogDescription>
                            Detailed information and controls for this device.
                          </DialogDescription>
                        </DialogHeader>
                        {selectedDevice && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Device ID</label>
                                <p className="text-sm text-muted-foreground">{selectedDevice.id}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Status</label>
                                <div className="mt-1">{getStatusBadge(selectedDevice.status)}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">API Key</label>
                                <p className="text-sm text-muted-foreground font-mono">{selectedDevice.api_key?.substring(0, 16)}...</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Firmware</label>
                                <p className="text-sm text-muted-foreground">{selectedDevice.firmware_version || 'Unknown'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Created</label>
                                <p className="text-sm text-muted-foreground">{new Date(selectedDevice.created_at).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Location</label>
                                <p className="text-sm text-muted-foreground">{selectedDevice.location}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-4">
                              <Button size="sm" className="bg-gradient-primary">
                                Configure
                              </Button>
                              <Button size="sm" variant="outline">
                                View Logs
                              </Button>
                              <Button size="sm" variant="outline">
                                Restart
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceManagement;