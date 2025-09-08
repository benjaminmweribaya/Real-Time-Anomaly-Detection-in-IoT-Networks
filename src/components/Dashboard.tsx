import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Shield, AlertTriangle, Activity, Wifi, WifiOff, Zap, TrendingUp, Users, Database, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDevices } from '@/hooks/useDevices';
import { useIncidents } from '@/hooks/useIncidents';
import { useToast } from '@/hooks/use-toast';

// Simulated real-time data
const generateTelemetryData = () => {
  const now = new Date();
  return Array.from({ length: 20 }, (_, i) => ({
    time: new Date(now.getTime() - (19 - i) * 60000).toLocaleTimeString(),
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    temperature: 20 + Math.random() * 40,
    network: Math.random() * 1000,
    anomalyScore: Math.random() * 10
  }));
};

const Dashboard = () => {
  const [telemetryData, setTelemetryData] = useState(generateTelemetryData());
  const [currentTime, setCurrentTime] = useState(new Date());
  const { devices, loading: devicesLoading } = useDevices();
  const { incidents, loading: incidentsLoading } = useIncidents();
  const { toast } = useToast();

  // Calculate device status data from real devices
  const deviceStatusData = [
    { 
      name: 'Online', 
      value: devices.filter(d => d.status === 'online').length, 
      color: 'hsl(var(--device-online))' 
    },
    { 
      name: 'Offline', 
      value: devices.filter(d => d.status === 'offline').length, 
      color: 'hsl(var(--device-offline))' 
    },
    { 
      name: 'Warning', 
      value: devices.filter(d => d.status === 'maintenance').length, 
      color: 'hsl(var(--device-warning))' 
    }
  ];

  // Get recent critical incidents as alerts
  const recentAlerts = incidents
    .filter(incident => incident.alert_level === 'critical' || incident.alert_level === 'warning')
    .slice(0, 3)
    .map(incident => ({
      id: incident.id,
      device: incident.device?.name || 'Unknown Device',
      type: incident.alert_level === 'critical' ? 'Critical' : 'Warning',
      message: incident.title,
      time: new Date(incident.created_at).toLocaleString(),
      severity: incident.alert_level === 'critical' ? 'critical' : 'medium'
    }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryData(generateTelemetryData());
      setCurrentTime(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'anomaly-pulse';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-primary';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              IoT Sentinel Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time security monitoring • Last updated: {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full status-online animate-pulse-cyber"></div>
              <span className="text-sm text-muted-foreground">System Operational</span>
            </div>
            <Button variant="outline" className="glow-border">
              <Shield className="w-4 h-4 mr-2" />
              Security Status
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
            <Activity className="h-4 w-4 text-device-online" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devicesLoading ? '...' : devices.length}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +12% from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {incidentsLoading ? '...' : incidents.filter(i => i.alert_level === 'critical' && i.status === 'new').length}
            </div>
            <p className="text-xs text-muted-foreground">
              2 new in last 10 minutes
            </p>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Throughput</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2TB</div>
            <p className="text-xs text-muted-foreground">
              Processing 450MB/min
            </p>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">
              Average detection latency
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="devices">Device Status</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="alerts">Live Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Real-time Telemetry */}
            <Card className="lg:col-span-2 glass shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Real-time System Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={telemetryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="cpu" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="memory" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="temperature" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Status Distribution */}
            <Card className="glass shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-device-online" />
                  Device Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={deviceStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {deviceStatusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="glass shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Live Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidentsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : recentAlerts.length > 0 ? (
                  recentAlerts.map((alert) => (
                    <div key={alert.id} className={cn(
                      "p-4 rounded-lg border glass",
                      getSeverityColor(alert.severity)
                    )}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                              {alert.type}
                            </Badge>
                            <span className="text-sm font-medium">{alert.device}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Investigate
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent alerts
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6">
          <Card className="glass shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-warning" />
                Anomaly Detection Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={telemetryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="anomalyScore" 
                    stroke="hsl(var(--destructive))" 
                    fill="hsl(var(--destructive) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;