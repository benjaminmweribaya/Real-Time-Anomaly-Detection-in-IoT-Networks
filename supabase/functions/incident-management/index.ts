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

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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

    // Get incidents with device information
    if (method === 'GET' && path === '/incidents') {
      const { data: incidents, error } = await supabase
        .from('incidents')
        .select(`
          *,
          device:devices(name, device_type, location),
          assigned_user:profiles!incidents_assigned_to_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify({ incidents }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update incident status
    if (method === 'PUT' && path.startsWith('/incidents/')) {
      const incidentId = path.split('/')[2]
      
      // If resolving incident, set resolved_at timestamp
      if (data.status === 'resolved' && !data.resolved_at) {
        data.resolved_at = new Date().toISOString()
      }

      const { data: incident, error } = await supabase
        .from('incidents')
        .update(data)
        .eq('id', incidentId)
        .select(`
          *,
          device:devices(name, device_type, location),
          assigned_user:profiles!incidents_assigned_to_fkey(full_name, email)
        `)
        .single()

      if (error) throw error

      // Create notification for assigned user if status changed
      if (data.assigned_to && data.assigned_to !== incident.assigned_to) {
        await supabase
          .from('notifications')
          .insert({
            user_id: data.assigned_to,
            incident_id: incident.id,
            notification_type: 'incident_assigned',
            title: 'New Incident Assigned',
            message: `You have been assigned to incident: ${incident.title}`,
            metadata: {
              incident_id: incident.id,
              alert_level: incident.alert_level
            }
          })
      }

      return new Response(
        JSON.stringify({ incident }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get incident statistics
    if (method === 'GET' && path === '/incidents/stats') {
      const { data: stats, error } = await supabase.rpc('get_incident_stats')

      if (error) {
        // Fallback to manual calculation if RPC doesn't exist
        const [
          { count: totalIncidents },
          { count: newIncidents },
          { count: investigatingIncidents },
          { count: resolvedIncidents },
          { count: criticalIncidents }
        ] = await Promise.all([
          supabase.from('incidents').select('*', { count: 'exact', head: true }),
          supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('status', 'investigating'),
          supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
          supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('alert_level', 'critical')
        ])

        return new Response(
          JSON.stringify({
            stats: {
              total: totalIncidents || 0,
              new: newIncidents || 0,
              investigating: investigatingIncidents || 0,
              resolved: resolvedIncidents || 0,
              critical: criticalIncidents || 0
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ stats }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in incident management:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})