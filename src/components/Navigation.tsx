import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Activity, 
  Settings, 
  Users, 
  AlertTriangle, 
  Database, 
  FileText, 
  Menu,
  X,
  Wifi,
  BarChart3,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { signOut, profile } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: null },
    { id: 'devices', label: 'Device Management', icon: Wifi, badge: '245' },
    { id: 'alerts', label: 'Security Alerts', icon: AlertTriangle, badge: '3' },
    { id: 'incidents', label: 'Incident Management', icon: Shield, badge: '12' },
    { id: 'analytics', label: 'Analytics', icon: Activity, badge: null },
    { id: 'users', label: 'User Management', icon: Users, badge: null },
    { id: 'reports', label: 'Reports & Logs', icon: FileText, badge: null },
    { id: 'settings', label: 'System Settings', icon: Settings, badge: null },
  ];

  return (
    <div className={cn(
      "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 glass",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-lg font-bold bg-gradient-cyber bg-clip-text text-transparent">
                  IoT Sentinel
                </h2>
                <p className="text-xs text-muted-foreground">Security Platform</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isCollapsed && "px-2",
                  isActive && "glow-border bg-primary/10"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.id === 'alerts' ? 'destructive' : 'secondary'}
                        className="ml-auto"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* User Profile Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}

      {/* Status Footer */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full status-online animate-pulse-cyber"></div>
              <span className="text-xs text-muted-foreground">All Systems Operational</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>CPU:</span>
              <span>23%</span>
            </div>
            <div className="flex justify-between">
              <span>Memory:</span>
              <span>68%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;