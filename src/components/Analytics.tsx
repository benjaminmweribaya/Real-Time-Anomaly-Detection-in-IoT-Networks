import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Shield, 
  AlertTriangle,
  Database,
  Zap,
  Users,
  Calendar
} from 'lucide-react';

// Mock data for charts
const weeklyData = [
  { name: 'Mon', incidents: 12, devices: 245, anomalies: 8 },
  { name: 'Tue', incidents: 19, devices: 247, anomalies: 15 },
  { name: 'Wed', incidents: 8, devices: 248, anomalies: 6 },
  { name: 'Thu', incidents: 24, devices: 246, anomalies: 18 },
  { name: 'Fri', incidents: 15, devices: 249, anomalies: 12 },
  { name: 'Sat', incidents: 6, devices: 245, anomalies: 4 },
  { name: 'Sun', incidents: 9, devices: 244, anomalies: 7 }
];

const monthlyTrends = [
  { month: 'Jan', incidents: 124, resolved: 118, devices: 230 },
  { month: 'Feb', incidents: 156, resolved: 142, devices: 235 },
  { month: 'Mar', incidents: 134, resolved: 128, devices: 240 },
  { month: 'Apr', incidents: 189, resolved: 175, devices: 245 },
  { month: 'May', incidents: 145, resolved: 138, devices: 248 },
  { month: 'Jun', incidents: 167, resolved: 162, devices: 250 }
];

const deviceTypeData = [
  { name: 'Sensors', value: 145, color: 'hsl(var(--primary))' },
  { name: 'Cameras', value: 68, color: 'hsl(var(--success))' },
  { name: 'Gateways', value: 23, color: 'hsl(var(--warning))' },
  { name: 'Controllers', value: 14, color: 'hsl(var(--destructive))' }
];

const threatData = [
  { type: 'Malware', count: 45, severity: 'high' },
  { type: 'Unauthorized Access', count: 32, severity: 'critical' },
  { type: 'Data Breach', count: 18, severity: 'critical' },
  { type: 'DDoS Attack', count: 12, severity: 'medium' },
  { type: 'Anomaly Detection', count: 87, severity: 'low' }
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const metrics = {
    totalIncidents: 342,
    avgResolutionTime: '2.4h',
    threatLevel: 'Medium',
    uptime: '99.7%',
    devicesMonitored: 250,
    dataProcessed: '1.2TB'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive security metrics and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Incidents</p>
                <p className="text-2xl font-bold">{metrics.totalIncidents}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-success" />
                  <span className="text-xs text-success">-12%</span>
                </div>
              </div>
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Resolution</p>
                <p className="text-2xl font-bold">{metrics.avgResolutionTime}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-destructive" />
                  <span className="text-xs text-destructive">+5%</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Threat Level</p>
                <p className="text-2xl font-bold text-warning">{metrics.threatLevel}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-success" />
                  <span className="text-xs text-success">Stable</span>
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold text-success">{metrics.uptime}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-xs text-success">Excellent</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Devices</p>
                <p className="text-2xl font-bold">{metrics.devicesMonitored}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-primary" />
                  <span className="text-xs text-primary">+8</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data Processed</p>
                <p className="text-2xl font-bold">{metrics.dataProcessed}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-primary" />
                  <span className="text-xs text-primary">+15%</span>
                </div>
              </div>
              <Database className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="incidents">Incident Analysis</TabsTrigger>
          <TabsTrigger value="devices">Device Analytics</TabsTrigger>
          <TabsTrigger value="threats">Threat Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Trends */}
            <Card className="glass shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Weekly Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="incidents" stroke="hsl(var(--destructive))" strokeWidth={2} />
                    <Line type="monotone" dataKey="devices" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="anomalies" stroke="hsl(var(--warning))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Distribution */}
            <Card className="glass shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Device Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={deviceTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {deviceTypeData.map((item, index) => (
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

          {/* Monthly Trends */}
          <Card className="glass shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Monthly Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
                    dataKey="incidents" 
                    stackId="1"
                    stroke="hsl(var(--destructive))" 
                    fill="hsl(var(--destructive) / 0.3)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolved" 
                    stackId="2"
                    stroke="hsl(var(--success))" 
                    fill="hsl(var(--success) / 0.3)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <Card className="glass shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Incident Resolution Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="incidents" fill="hsl(var(--destructive))" />
                  <Bar dataKey="resolved" fill="hsl(var(--success))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Device Health Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <span>Online Devices</span>
                    </div>
                    <span className="font-semibold">234</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning"></div>
                      <span>Warning Status</span>
                    </div>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span>Offline Devices</span>
                    </div>
                    <span className="font-semibold">4</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Data Processing Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Messages/Hour</span>
                    <span className="font-semibold">1.2M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Storage Used</span>
                    <span className="font-semibold">847GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Processing Latency</span>
                    <span className="font-semibold text-success">23ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <span className="font-semibold text-success">0.02%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <Card className="glass shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-destructive" />
                Threat Intelligence Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatData.map((threat, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        threat.severity === 'critical' ? 'bg-destructive' :
                        threat.severity === 'high' ? 'bg-warning' :
                        threat.severity === 'medium' ? 'bg-primary' : 'bg-success'
                      }`}></div>
                      <div>
                        <p className="font-medium">{threat.type}</p>
                        <p className="text-sm text-muted-foreground capitalize">{threat.severity} severity</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{threat.count}</p>
                      <p className="text-sm text-muted-foreground">incidents</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;