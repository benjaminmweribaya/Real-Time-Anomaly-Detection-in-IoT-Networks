import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Get JWT from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Set the JWT for this request
    supabase.auth.session = () => ({
      access_token: authHeader.replace('Bearer ', ''),
      token_type: 'bearer',
      user: null,
      refresh_token: '',
      expires_in: 0,
      expires_at: 0,
    })

    // Parse request body for route information
    const body = await req.json()
    const { path, method = 'GET', data } = body || {}
    
    if (!path) {
      return new Response(
        JSON.stringify({ error: 'Path is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get devices with telemetry statistics
    if (method === 'GET' && path === '/devices') {
      const { data: devices, error } = await supabase
        .from('devices')
        .select(`
          *,
          telemetry:telemetry(count),
          recent_anomalies:telemetry!inner(count)
        `)
        .eq('telemetry.is_anomaly', true)
        .gte('telemetry.created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      if (error) throw error

      // Calculate device statistics
      const devicesWithStats = await Promise.all(
        devices.map(async (device) => {
          // Get recent telemetry count
          const { count: telemetryCount } = await supabase
            .from('telemetry')
            .select('*', { count: 'exact', head: true })
            .eq('device_id', device.id)
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

          // Get anomaly count
          const { count: anomalyCount } = await supabase
            .from('telemetry')
            .select('*', { count: 'exact', head: true })
            .eq('device_id', device.id)
            .eq('is_anomaly', true)
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

          return {
            ...device,
            stats: {
              telemetry_count_24h: telemetryCount || 0,
              anomaly_count_24h: anomalyCount || 0,
              uptime: device.last_heartbeat 
                ? Math.max(0, 100 - Math.floor((Date.now() - new Date(device.last_heartbeat).getTime()) / (1000 * 60))) 
                : 0
            }
          }
        })
      )

      return new Response(
        JSON.stringify({ devices: devicesWithStats }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create new device
    if (method === 'POST' && path === '/devices') {
      const { data: device, error } = await supabase
        .from('devices')
        .insert({
          name: data.name,
          device_type: data.device_type,
          firmware_version: data.firmware_version,
          location: data.location,
          metadata: data.metadata || {}
        })
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ device }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update device
    if (method === 'PUT' && path.startsWith('/devices/')) {
      const deviceId = path.split('/')[2]
      
      const { data: device, error } = await supabase
        .from('devices')
        .update(data)
        .eq('id', deviceId)
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ device }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Delete device
    if (method === 'DELETE' && path.startsWith('/devices/')) {
      const deviceId = path.split('/')[2]
      
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', deviceId)

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in device management:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})