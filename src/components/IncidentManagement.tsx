import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIncidents } from '@/hooks/useIncidents';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  User, 
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Bell,
  Zap,
  Plus,
  Activity,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const IncidentManagement = () => {
  const { incidents, loading, updateIncident } = useIncidents();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<any>(null);

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (incident.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (incident.device?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesSeverity = selectedSeverity === 'all' || incident.alert_level === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || incident.status === selectedStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive border-destructive bg-destructive/10';
      case 'warning': return 'text-warning border-warning bg-warning/10';
      case 'info': return 'text-primary border-primary bg-primary/10';
      default: return 'text-muted-foreground border-muted bg-muted/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'info': return <AlertTriangle className="w-4 h-4 text-primary" />;
      default: return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Bell className="w-4 h-4 text-primary animate-pulse" />;
      case 'investigating': return <Eye className="w-4 h-4 text-warning" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-success" />;
      default: return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      new: 'bg-primary text-primary-foreground',
      investigating: 'bg-warning text-warning-foreground',
      resolved: 'bg-success text-success-foreground'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-muted text-muted-foreground'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const updateIncidentStatus = async (incidentId: string, newStatus: string) => {
    const result = await updateIncident(incidentId, { status: newStatus as any });
    if (result.error) {
      toast({
        title: "Error",
        description: "Failed to update incident status",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Incident status updated successfully"
      });
    }
  };

  const incidentCounts = {
    total: incidents.length,
    new: incidents.filter(i => i.status === 'new').length,
    investigating: incidents.filter(i => i.status === 'investigating').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    critical: incidents.filter(i => i.alert_level === 'critical').length,
    avgResolutionTime: '2.4h' // Mock data
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Incident Management</h2>
          <p className="text-muted-foreground">Comprehensive incident tracking and resolution</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Incident
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{loading ? '...' : incidentCounts.total}</p>
              </div>
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New</p>
                <p className="text-2xl font-bold text-primary">{loading ? '...' : incidentCounts.new}</p>
              </div>
              <Bell className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-warning">{loading ? '...' : incidentCounts.investigating}</p>
              </div>
              <Activity className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-destructive">{loading ? '...' : incidentCounts.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-success">{loading ? '...' : incidentCounts.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Resolution</p>
                <p className="text-2xl font-bold">{incidentCounts.avgResolutionTime}</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="active">Active Incidents</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Search and Filters */}
          <Card className="glass shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search incidents by title, device, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Incidents List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filteredIncidents.filter(i => i.status !== 'resolved').map((incident) => (
              <Card key={incident.id} className={cn(
                "glass shadow-card transition-all duration-200 hover:shadow-lg",
                incident.alert_level === 'critical' && "border-l-4 border-l-destructive"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        {getSeverityIcon(incident.alert_level)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{incident.title}</h3>
                            <Badge className={getSeverityColor(incident.alert_level)}>
                              {incident.alert_level.toUpperCase()}
                            </Badge>
                            {getStatusBadge(incident.status)}
                          </div>
                          <p className="text-muted-foreground mb-3">{incident.description || 'No description available'}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {incident.device?.name || 'Unknown Device'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(incident.created_at).toLocaleString()}
                            </div>
                            {incident.assigned_user && (
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {incident.assigned_user.full_name || incident.assigned_user.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {incident.status === 'new' && (
                        <Button 
                          size="sm" 
                          className="bg-gradient-primary"
                          onClick={() => updateIncidentStatus(incident.id, 'investigating')}
                        >
                          Investigate
                        </Button>
                      )}
                      {incident.status === 'investigating' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-success border-success"
                          onClick={() => updateIncidentStatus(incident.id, 'resolved')}
                        >
                          Mark Resolved
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setSelectedIncident(incident)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Incident Details: {selectedIncident?.title}</DialogTitle>
                            <DialogDescription>
                              Complete incident information and timeline.
                            </DialogDescription>
                          </DialogHeader>
                          {selectedIncident && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Incident ID</label>
                                  <p className="text-sm text-muted-foreground font-mono">{selectedIncident.id}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Severity</label>
                                  <div className="mt-1">
                                    <Badge className={getSeverityColor(selectedIncident.alert_level)}>
                                      {selectedIncident.alert_level.toUpperCase()}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <div className="mt-1">{getStatusBadge(selectedIncident.status)}</div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Device</label>
                                  <p className="text-sm text-muted-foreground">{selectedIncident.device?.name || 'Unknown'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Created</label>
                                  <p className="text-sm text-muted-foreground">{new Date(selectedIncident.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Assigned To</label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedIncident.assigned_user?.full_name || selectedIncident.assigned_user?.email || 'Unassigned'}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Description</label>
                                <p className="text-sm text-muted-foreground mt-1">{selectedIncident.description || 'No description available'}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-gradient-primary">
                                  Assign to Me
                                </Button>
                                <Button size="sm" variant="outline">
                                  Add Comment
                                </Button>
                                <Button size="sm" variant="outline">
                                  Escalate
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-6">
          <div className="space-y-4">
            {filteredIncidents.filter(i => i.status === 'resolved').map((incident) => (
              <Card key={incident.id} className="glass shadow-card opacity-75">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{incident.title}</h3>
                          <Badge className="bg-success text-success-foreground">RESOLVED</Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{incident.description || 'No description available'}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Resolved: {incident.resolved_at ? new Date(incident.resolved_at).toLocaleString() : 'Unknown'}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {incident.assigned_user?.full_name || incident.assigned_user?.email || 'System'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Resolution Time Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Incident Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Category breakdown coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {!loading && filteredIncidents.length === 0 && (
        <Card className="glass shadow-card">
          <CardContent className="p-12 text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No incidents found</h3>
            <p className="text-muted-foreground">
              No incidents match your current filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IncidentManagement;