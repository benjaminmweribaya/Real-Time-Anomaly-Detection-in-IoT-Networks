import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailNotification {
  to: string;
  subject: string;
  message: string;
  incident_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const method = req.method

    // Send email notification
    if (method === 'POST' && url.pathname.endsWith('/send-email')) {
      const { to, subject, message, incident_id }: EmailNotification = await req.json()

      // In a real implementation, you would integrate with an email service like:
      // - SendGrid
      // - Amazon SES
      // - Mailgun
      // - Resend
      
      // For demo purposes, we'll just log and create a notification record
      console.log('Email notification:', { to, subject, message, incident_id })

      // Get user ID from email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', to)
        .single()

      if (profileError || !profile) {
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create notification record
      const { data: notification, error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: profile.id,
          incident_id: incident_id,
          notification_type: 'email',
          title: subject,
          message: message,
          sent_at: new Date().toISOString(),
          metadata: { email_to: to }
        })
        .select()
        .single()

      if (notificationError) {
        throw notificationError
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          notification_id: notification.id,
          message: 'Notification sent successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send webhook notification
    if (method === 'POST' && url.pathname.endsWith('/send-webhook')) {
      const { webhook_url, payload } = await req.json()

      try {
        const response = await fetch(webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'IoT-Sentinel-Platform/1.0'
          },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          throw new Error(`Webhook failed with status: ${response.status}`)
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            webhook_status: response.status,
            message: 'Webhook sent successfully' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      } catch (error) {
        console.error('Webhook error:', error)
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Failed to send webhook',
            details: error.message 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Get user notifications
    if (method === 'GET' && url.pathname.endsWith('/notifications')) {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Authorization header required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get user from JWT (simplified - in production, decode JWT properly)
      const { data: { user }, error: userError } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      )

      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: notifications, error } = await supabase
        .from('notifications')
        .select(`
          *,
          incident:incidents(title, alert_level)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      return new Response(
        JSON.stringify({ notifications }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mark notification as read
    if (method === 'PUT' && url.pathname.includes('/notifications/')) {
      const notificationId = url.pathname.split('/').pop()
      
      const { data: notification, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ notification }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in notifications:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})