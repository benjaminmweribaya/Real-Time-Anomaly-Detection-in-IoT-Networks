import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

export interface Device {
  id: string
  name: string
  device_type: string
  firmware_version?: string
  location?: string
  api_key: string
  status: 'online' | 'offline' | 'maintenance'
  owner_id: string
  last_heartbeat?: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  stats?: {
    telemetry_count_24h: number
    anomaly_count_24h: number
    uptime: number
  }
}

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { session } = useAuth()

  const fetchDevices = async () => {
    if (!session) return

    try {
      setLoading(true)
      
      const { data, error } = await supabase.functions.invoke('device-management', {
        body: { path: '/devices' }
      })

      if (error) {
        throw new Error(error.message)
      }

      setDevices(data.devices || [])
    } catch (err) {
      console.error('Error fetching devices:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createDevice = async (deviceData: {
    name: string
    device_type: string
    firmware_version?: string
    location?: string
    metadata?: Record<string, any>
  }) => {
    if (!session) return { error: 'No session' }

    try {
      const { data, error } = await supabase.functions.invoke('device-management', {
        body: { path: '/devices', method: 'POST', data: deviceData }
      })

      if (error) {
        throw new Error(error.message)
      }

      await fetchDevices()
      return { data: data.device, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      return { data: null, error }
    }
  }

  const updateDevice = async (deviceId: string, updates: Partial<Device>) => {
    if (!session) return { error: 'No session' }

    try {
      const { data, error } = await supabase.functions.invoke('device-management', {
        body: { path: `/devices/${deviceId}`, method: 'PUT', data: updates }
      })

      if (error) {
        throw new Error(error.message)
      }

      await fetchDevices()
      return { data: data.device, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      return { data: null, error }
    }
  }

  const deleteDevice = async (deviceId: string) => {
    if (!session) return { error: 'No session' }

    try {
      const { error } = await supabase.functions.invoke('device-management', {
        body: { path: `/devices/${deviceId}`, method: 'DELETE' }
      })

      if (error) {
        throw new Error(error.message)
      }

      await fetchDevices()
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      return { error }
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [session])

  return {
    devices,
    loading,
    error,
    fetchDevices,
    createDevice,
    updateDevice,
    deleteDevice,
  }
}