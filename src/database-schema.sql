-- IoT Sentinel Platform Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('admin', 'device_owner', 'security_analyst')) DEFAULT 'device_owner',
    api_key UUID DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Devices table
CREATE TABLE devices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    device_type TEXT NOT NULL,
    firmware_version TEXT,
    location TEXT,
    api_key UUID DEFAULT uuid_generate_v4(),
    status TEXT CHECK (status IN ('online', 'offline', 'maintenance')) DEFAULT 'offline',
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    last_heartbeat TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Telemetry data table
CREATE TABLE telemetry (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sensor_data JSONB NOT NULL,
    anomaly_score FLOAT DEFAULT 0.0,
    is_anomaly BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents table
CREATE TABLE incidents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    status TEXT CHECK (status IN ('new', 'investigating', 'resolved')) DEFAULT 'new',
    alert_level TEXT CHECK (alert_level IN ('critical', 'warning', 'info')) DEFAULT 'info',
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_devices_owner_id ON devices(owner_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_telemetry_device_id ON telemetry(device_id);
CREATE INDEX idx_telemetry_timestamp ON telemetry(timestamp DESC);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile automatically
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable insert for authenticated users" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Devices policies  
CREATE POLICY "Users can view own devices" ON devices FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Users can insert own devices" ON devices FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Users can update own devices" ON devices FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Users can delete own devices" ON devices FOR DELETE USING (owner_id = auth.uid());

-- Telemetry policies
CREATE POLICY "Users can view telemetry for own devices" ON telemetry FOR SELECT USING (
    EXISTS (SELECT 1 FROM devices WHERE devices.id = telemetry.device_id AND devices.owner_id = auth.uid())
);
CREATE POLICY "Device API can insert telemetry" ON telemetry FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM devices WHERE devices.id = telemetry.device_id)
);

-- Incidents policies
CREATE POLICY "Users can view incidents for own devices" ON incidents FOR SELECT USING (
    device_id IS NULL OR 
    EXISTS (SELECT 1 FROM devices WHERE devices.id = incidents.device_id AND devices.owner_id = auth.uid())
);
CREATE POLICY "Enable insert for authenticated users" ON incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update incidents" ON incidents FOR UPDATE USING (true);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Enable insert for authenticated users" ON notifications FOR INSERT WITH CHECK (true);