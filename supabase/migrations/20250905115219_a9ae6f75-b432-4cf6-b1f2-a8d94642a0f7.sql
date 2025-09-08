-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'device_owner' CHECK (role IN ('admin', 'device_owner', 'security_analyst')),
  api_key TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(email),
  UNIQUE(api_key)
);

-- Create devices table
CREATE TABLE public.devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  device_type TEXT NOT NULL,
  firmware_version TEXT,
  location TEXT,
  api_key TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'maintenance')),
  owner_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  last_heartbeat TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(api_key)
);

-- Create telemetry table
CREATE TABLE public.telemetry (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sensor_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  anomaly_score DECIMAL(3,2) DEFAULT 0.00 CHECK (anomaly_score >= 0.00 AND anomaly_score <= 1.00),
  is_anomaly BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create incidents table
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'resolved')),
  alert_level TEXT NOT NULL DEFAULT 'info' CHECK (alert_level IN ('critical', 'warning', 'info')),
  assigned_to UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_devices_owner_id ON public.devices(owner_id);
CREATE INDEX idx_devices_status ON public.devices(status);
CREATE INDEX idx_devices_api_key ON public.devices(api_key);
CREATE INDEX idx_telemetry_device_id ON public.telemetry(device_id);
CREATE INDEX idx_telemetry_timestamp ON public.telemetry(timestamp);
CREATE INDEX idx_telemetry_is_anomaly ON public.telemetry(is_anomaly);
CREATE INDEX idx_incidents_device_id ON public.incidents(device_id);
CREATE INDEX idx_incidents_status ON public.incidents(status);
CREATE INDEX idx_incidents_assigned_to ON public.incidents(assigned_to);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_devices_updated_at
    BEFORE UPDATE ON public.devices
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at
    BEFORE UPDATE ON public.incidents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for devices
CREATE POLICY "Users can view own devices" ON public.devices
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own devices" ON public.devices
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own devices" ON public.devices
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own devices" ON public.devices
  FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for telemetry (users can view telemetry for their devices)
CREATE POLICY "Users can view telemetry for own devices" ON public.telemetry
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.devices 
      WHERE devices.id = telemetry.device_id 
      AND devices.owner_id = auth.uid()
    )
  );

-- Allow telemetry insertion via device API key (will be handled in edge function)
CREATE POLICY "Allow telemetry insertion via API" ON public.telemetry
  FOR INSERT WITH CHECK (true);

-- RLS Policies for incidents
CREATE POLICY "Users can view incidents for own devices" ON public.incidents
  FOR SELECT USING (
    device_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.devices 
      WHERE devices.id = incidents.device_id 
      AND devices.owner_id = auth.uid()
    ) OR
    assigned_to = auth.uid()
  );

CREATE POLICY "Users can insert incidents" ON public.incidents
  FOR INSERT WITH CHECK (
    device_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.devices 
      WHERE devices.id = incidents.device_id 
      AND devices.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update incidents they own or are assigned to" ON public.incidents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.devices 
      WHERE devices.id = incidents.device_id 
      AND devices.owner_id = auth.uid()
    ) OR
    assigned_to = auth.uid()
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow notification insertion" ON public.notifications
  FOR INSERT WITH CHECK (true);