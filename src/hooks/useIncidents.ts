import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

export interface Incident {
  id: string
  title: string
  description?: string
  device_id?: string
  status: 'new' | 'investigating' | 'resolved'
  alert_level: 'critical' | 'warning' | 'info'
  assigned_to?: string
  resolved_at?: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  device?: {
    name: string
    device_type: string
    location?: string
  }
  assigned_user?: {
    full_name?: string
    email: string
  }
}

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { session } = useAuth()

  const fetchIncidents = async () => {
    if (!session) return

    try {
      setLoading(true)
      
      const { data, error } = await supabase.functions.invoke('incident-management', {
        body: { path: '/incidents' }
      })

      if (error) {
        throw new Error(error.message)
      }

      setIncidents(data.incidents || [])
    } catch (err) {
      console.error('Error fetching incidents:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const updateIncident = async (incidentId: string, updates: Partial<Incident>) => {
    if (!session) return { error: 'No session' }

    try {
      const { data, error } = await supabase.functions.invoke('incident-management', {
        body: { path: `/incidents/${incidentId}`, method: 'PUT', data: updates }
      })

      if (error) {
        throw new Error(error.message)
      }

      await fetchIncidents()
      return { data: data.incident, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      return { data: null, error }
    }
  }

  useEffect(() => {
    fetchIncidents()
  }, [session])

  return {
    incidents,
    loading,
    error,
    fetchIncidents,
    updateIncident,
  }
}