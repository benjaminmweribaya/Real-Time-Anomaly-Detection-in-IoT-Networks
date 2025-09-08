import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import Navigation from '@/components/Navigation';
import DeviceManagement from '@/components/DeviceManagement';
import SecurityAlerts from '@/components/SecurityAlerts';
import IncidentManagement from '@/components/IncidentManagement';
import Analytics from '@/components/Analytics';
import UserManagement from '@/components/UserManagement';
import ReportsLogs from '@/components/ReportsLogs';
import SystemSettings from '@/components/SystemSettings';
import DemoDataSetup from '@/components/DemoDataSetup';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { profile } = useAuth();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'devices':
        return <DeviceManagement />;
      case 'alerts':
        return <SecurityAlerts />;
      case 'incidents':
        return <IncidentManagement />;
      case 'analytics':
        return <Analytics />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <ReportsLogs />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <DemoDataSetup />
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
};

export default Index;
