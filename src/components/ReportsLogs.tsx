import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  Calendar,
  Activity,
  AlertTriangle,
  Database,
  Clock,
  User,
  Shield,
  Zap,
  Eye,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock log data
const mockLogs = [
  {
    id: '1',
    timestamp: '2024-03-01T10:15:23Z',
    level: 'INFO',
    source: 'Device Manager',
    message: 'Device sensor-001 came online',
    user: 'system',
    category: 'device'
  },
  {
    id: '2',
    timestamp: '2024-03-01T10:14:45Z',
    level: 'WARNING',
    source: 'Anomaly Detector',
    message: 'Temperature anomaly detected on sensor-003: 65°C',
    user: 'ai-system',
    category: 'anomaly'
  },
  {
    id: '3',
    timestamp: '2024-03-01T10:12:31Z',
    level: 'ERROR',
    source: 'Authentication',
    message: 'Failed login attempt for user admin@company.com',
    user: 'admin@company.com',
    category: 'security'
  },
  {
    id: '4',
    timestamp: '2024-03-01T10:11:15Z',
    level: 'INFO',
    source: 'Incident Manager',
    message: 'Incident INC-001 resolved by Sarah Security',
    user: 'security@company.com',
    category: 'incident'
  },
  {
    id: '5',
    timestamp: '2024-03-01T10:09:22Z',
    level: 'CRITICAL',
    source: 'Security Monitor',
    message: 'Potential data breach detected on gateway-005',
    user: 'ai-system',
    category: 'security'
  }
];

// Mock report data
const mockReports = [
  {
    id: '1',
    name: 'Monthly Security Summary',
    description: 'Comprehensive monthly security incidents and resolution report',
    generated: '2024-03-01T09:00:00Z',
    type: 'security',
    size: '2.3 MB',
    format: 'PDF'
  },
  {
    id: '2',
    name: 'Device Performance Analysis',
    description: 'Weekly device uptime and performance metrics',
    generated: '2024-02-28T18:00:00Z',
    type: 'performance',
    size: '1.8 MB',
    format: 'Excel'
  },
  {
    id: '3',
    name: 'Anomaly Detection Report',
    description: 'Machine learning anomaly detection results and trends',
    generated: '2024-02-27T12:00:00Z',
    type: 'anomaly',
    size: '4.1 MB',
    format: 'PDF'
  },
  {
    id: '4',
    name: 'Compliance Audit Log',
    description: 'Full audit trail for compliance requirements',
    generated: '2024-02-26T15:30:00Z',
    type: 'compliance',
    size: '856 KB',
    format: 'CSV'
  }
];

const ReportsLogs = () => {
  const [logs] = useState(mockLogs);
  const [reports] = useState(mockReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = selectedLevel === 'all' || log.level.toLowerCase() === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;

    return matchesSearch && matchesLevel && matchesCategory;
  });

  const getLevelBadge = (level: string) => {
    const variants = {
      CRITICAL: 'bg-destructive text-destructive-foreground animate-pulse',
      ERROR: 'bg-destructive text-destructive-foreground',
      WARNING: 'bg-warning text-warning-foreground',
      INFO: 'bg-primary text-primary-foreground',
      DEBUG: 'bg-muted text-muted-foreground'
    };

    return (
      <Badge className={variants[level as keyof typeof variants] || 'bg-muted text-muted-foreground'}>
        {level}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="w-4 h-4 text-destructive" />;
      case 'device': return <Activity className="w-4 h-4 text-primary" />;
      case 'anomaly': return <Zap className="w-4 h-4 text-warning" />;
      case 'incident': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default: return <Database className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="w-4 h-4 text-destructive" />;
      case 'performance': return <Activity className="w-4 h-4 text-primary" />;
      case 'anomaly': return <Zap className="w-4 h-4 text-warning" />;
      case 'compliance': return <FileText className="w-4 h-4 text-success" />;
      default: return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const logCounts = {
    total: logs.length,
    critical: logs.filter(l => l.level === 'CRITICAL').length,
    error: logs.filter(l => l.level === 'ERROR').length,
    warning: logs.filter(l => l.level === 'WARNING').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Reports & Logs</h2>
          <p className="text-muted-foreground">System logs, audit trails, and generated reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button className="bg-gradient-primary">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="logs" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="logs">System Logs</TabsTrigger>
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="analytics">Log Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          {/* Log Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                    <p className="text-2xl font-bold">{logCounts.total}</p>
                  </div>
                  <Database className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Critical</p>
                    <p className="text-2xl font-bold text-destructive">{logCounts.critical}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-destructive animate-pulse" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Errors</p>
                    <p className="text-2xl font-bold text-destructive">{logCounts.error}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                    <p className="text-2xl font-bold text-warning">{logCounts.warning}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-warning" />
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
                    placeholder="Search logs by message, source, or user..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="device">Device</SelectItem>
                    <SelectItem value="anomaly">Anomaly</SelectItem>
                    <SelectItem value="incident">Incident</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card className="glass shadow-card">
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className={cn(
                      log.level === 'CRITICAL' && "border-l-4 border-l-destructive bg-destructive/5"
                    )}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>{getLevelBadge(log.level)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(log.category)}
                          <span className="capitalize">{log.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{log.source}</span>
                      </TableCell>
                      <TableCell>
                        <span className="max-w-md truncate block">{log.message}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-muted-foreground" />
                          {log.user}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="glass shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getReportTypeIcon(report.type)}
                    {report.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Generated:</span>
                      <span>{new Date(report.generated).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span>{report.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="bg-gradient-primary">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card className="glass shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="w-5 h-5" />
                Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Archive className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Audit Trail Coming Soon</h3>
                <p className="text-muted-foreground">
                  Comprehensive audit logging and compliance tracking will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="glass shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Log Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced log analytics, trends, and insights will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsLogs;