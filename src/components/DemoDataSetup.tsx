import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

const DemoDataSetup = () => {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const [hasData, setHasData] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkExistingData()
  }, [user])

  const checkExistingData = async () => {
    if (!user) return
    
    const { data: devices } = await supabase
      .from('devices')
      .select('id')
      .limit(1)
    
    setHasData((devices?.length || 0) > 0)
  }

  const createDemoData = async () => {
    if (!user || !profile) return

    setLoading(true)
    try {
      // Create demo devices
      const { data: devices, error: deviceError } = await supabase
        .from('devices')
        .insert([
          {
            name: 'Temperature Sensor 001',
            device_type: 'sensor',
            firmware_version: '1.2.3',
            location: 'Server Room A',
            status: 'online',
            owner_id: user.id,
            last_heartbeat: new Date().toISOString(),
            metadata: { temperature: 23.5, humidity: 45 }
          },
          {
            name: 'Security Camera 002',
            device_type: 'camera',
            firmware_version: '2.1.0',
            location: 'Main Entrance',
            status: 'online',
            owner_id: user.id,
            last_heartbeat: new Date().toISOString(),
            metadata: { resolution: '1080p', night_vision: true }
          },
          {
            name: 'Network Switch 003',
            device_type: 'network',
            firmware_version: '3.4.1',
            location: 'Network Closet',
            status: 'offline',
            owner_id: user.id,
            metadata: { ports: 24, poe_enabled: true }
          }
        ])
        .select()

      if (deviceError) throw deviceError

      // Create demo incidents
      const { error: incidentError } = await supabase
        .from('incidents')
        .insert([
          {
            title: 'High CPU Usage Detected',
            description: 'Temperature sensor showing elevated CPU usage above normal thresholds',
            device_id: devices?.[0]?.id,
            status: 'new',
            alert_level: 'warning',
            metadata: { cpu_usage: 85, threshold: 70 }
          },
          {
            title: 'Unauthorized Access Attempt',
            description: 'Multiple failed login attempts detected from suspicious IP address',
            device_id: devices?.[1]?.id,
            status: 'investigating',
            alert_level: 'critical',
            assigned_to: user.id,
            metadata: { ip_address: '192.168.1.100', attempts: 5 }
          },
          {
            title: 'Network Device Offline',
            description: 'Network switch has been offline for more than 30 minutes',
            device_id: devices?.[2]?.id,
            status: 'resolved',
            alert_level: 'critical',
            resolved_at: new Date().toISOString(),
            metadata: { offline_duration: 35 }
          }
        ])

      if (incidentError) throw incidentError

      // Create demo telemetry data
      const telemetryData = []
      const now = new Date()
      
      for (let i = 0; i < 48; i++) {
        const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000) // 30 min intervals
        
        devices?.forEach(device => {
          const sensorData = device.device_type === 'sensor' ? {
            temperature: 20 + Math.random() * 10,
            humidity: 40 + Math.random() * 20,
            cpu_usage: 20 + Math.random() * 60
          } : device.device_type === 'camera' ? {
            motion_detected: Math.random() > 0.8,
            recording_status: 'active',
            storage_usage: 60 + Math.random() * 30
          } : {
            port_status: 'active',
            throughput: Math.random() * 1000,
            error_rate: Math.random() * 5
          }

          const anomalyScore = Math.random()
          
          telemetryData.push({
            device_id: device.id,
            timestamp: timestamp.toISOString(),
            sensor_data: sensorData,
            anomaly_score: anomalyScore,
            is_anomaly: anomalyScore > 0.8
          })
        })
      }

      const { error: telemetryError } = await supabase
        .from('telemetry')
        .insert(telemetryData)

      if (telemetryError) throw telemetryError

      toast({
        title: "Demo Data Created",
        description: "Sample devices, incidents, and telemetry data have been created successfully!"
      })

      setHasData(true)
    } catch (error) {
      console.error('Error creating demo data:', error)
      toast({
        title: "Error",
        description: "Failed to create demo data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user || hasData) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Welcome to IoT Sentinel Platform</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          It looks like you don't have any data yet. Would you like to create some demo data to explore the platform?
        </p>
        <Button 
          onClick={createDemoData} 
          disabled={loading}
          className="bg-gradient-primary"
        >
          {loading ? "Creating Demo Data..." : "Create Demo Data"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default DemoDataSetup