import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Settings, 
  Shield, 
  Bell, 
  Database,
  Zap,
  Mail,
  Globe,
  Key,
  AlertTriangle,
  Clock,
  Activity,
  Save,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // General Settings
    systemName: 'IoT Sentinel Security Platform',
    description: 'Advanced IoT security monitoring and anomaly detection system',
    timezone: 'UTC',
    language: 'en',
    
    // Security Settings
    sessionTimeout: '30',
    passwordPolicy: 'strict',
    twoFactorAuth: true,
    sslEnforced: true,
    auditLogging: true,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    webhookNotifications: true,
    alertThreshold: 'medium',
    
    // Monitoring Settings
    dataRetention: '90',
    anomalyThreshold: '7.5',
    autoIncidentCreation: true,
    deviceHeartbeat: '60',
    
    // Integration Settings
    apiRateLimit: '1000',
    webhookUrl: 'https://api.company.com/webhooks/iot-sentinel',
    smtpServer: 'smtp.company.com',
    smtpPort: '587'
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "System configuration has been updated successfully."
    });
  };

  const handleResetSettings = () => {
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
      variant: "destructive"
    });
  };

  const handleExportConfig = () => {
    toast({
      title: "Configuration Exported",
      description: "System configuration has been exported to file."
    });
  };

  const systemStats = {
    uptime: '15d 8h 32m',
    cpu: '23%',
    memory: '68%',
    storage: '42%',
    activeConnections: 1247,
    lastBackup: '2024-03-01T02:00:00Z'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">System Settings</h2>
          <p className="text-muted-foreground">Configure platform settings and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportConfig}>
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Config
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-lg font-bold text-success">{systemStats.uptime}</p>
              </div>
              <Clock className="w-6 h-6 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CPU Usage</p>
                <p className="text-lg font-bold">{systemStats.cpu}</p>
              </div>
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Memory</p>
                <p className="text-lg font-bold text-warning">{systemStats.memory}</p>
              </div>
              <Database className="w-6 h-6 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage</p>
                <p className="text-lg font-bold">{systemStats.storage}</p>
              </div>
              <Database className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connections</p>
                <p className="text-lg font-bold">{systemStats.activeConnections}</p>
              </div>
              <Globe className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Backup</p>
                <p className="text-xs font-medium text-success">
                  {new Date(systemStats.lastBackup).toLocaleDateString()}
                </p>
              </div>
              <Shield className="w-6 h-6 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="glass shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => setSettings({...settings, systemName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="CET">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">System Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings({...settings, description: e.target.value})}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="glass shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordPolicy">Password Policy</Label>
                  <Select value={settings.passwordPolicy} onValueChange={(value) => setSettings({...settings, passwordPolicy: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="strict">Strict</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all user accounts</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SSL/TLS Enforcement</Label>
                    <p className="text-sm text-muted-foreground">Force HTTPS for all connections</p>
                  </div>
                  <Switch
                    checked={settings.sslEnforced}
                    onCheckedChange={(checked) => setSettings({...settings, sslEnforced: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all user actions and system events</p>
                  </div>
                  <Switch
                    checked={settings.auditLogging}
                    onCheckedChange={(checked) => setSettings({...settings, auditLogging: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send alerts via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send critical alerts via SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Webhook Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send alerts to external systems</p>
                  </div>
                  <Switch
                    checked={settings.webhookNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, webhookNotifications: checked})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alertThreshold">Alert Threshold</Label>
                <Select value={settings.alertThreshold} onValueChange={(value) => setSettings({...settings, alertThreshold: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - All alerts</SelectItem>
                    <SelectItem value="medium">Medium - Important alerts</SelectItem>
                    <SelectItem value="high">High - Critical alerts only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card className="glass shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Monitoring Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention (days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => setSettings({...settings, dataRetention: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anomalyThreshold">Anomaly Threshold</Label>
                  <Input
                    id="anomalyThreshold"
                    type="number"
                    step="0.1"
                    value={settings.anomalyThreshold}
                    onChange={(e) => setSettings({...settings, anomalyThreshold: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceHeartbeat">Device Heartbeat (seconds)</Label>
                  <Input
                    id="deviceHeartbeat"
                    type="number"
                    value={settings.deviceHeartbeat}
                    onChange={(e) => setSettings({...settings, deviceHeartbeat: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Incident Creation</Label>
                  <p className="text-sm text-muted-foreground">Automatically create incidents for anomalies</p>
                </div>
                <Switch
                  checked={settings.autoIncidentCreation}
                  onCheckedChange={(checked) => setSettings({...settings, autoIncidentCreation: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="glass shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                External Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    value={settings.apiRateLimit}
                    onChange={(e) => setSettings({...settings, apiRateLimit: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({...settings, smtpPort: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  type="url"
                  value={settings.webhookUrl}
                  onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtpServer">SMTP Server</Label>
                <Input
                  id="smtpServer"
                  value={settings.smtpServer}
                  onChange={(e) => setSettings({...settings, smtpServer: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleResetSettings}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            Test Configuration
          </Button>
          <Button onClick={handleSaveSettings} className="bg-gradient-primary">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;