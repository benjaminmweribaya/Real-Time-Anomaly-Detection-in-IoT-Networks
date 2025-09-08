import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-device-api-key',
}

interface TelemetryData {
  deviceId: string;
  timestamp?: string;
  sensorData: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get device API key from header
    const deviceApiKey = req.headers.get('x-device-api-key')
    if (!deviceApiKey) {
      return new Response(
        JSON.stringify({ error: 'Device API key required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify device API key
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('id, name, status')
      .eq('api_key', deviceApiKey)
      .single()

    if (deviceError || !device) {
      return new Response(
        JSON.stringify({ error: 'Invalid device API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse telemetry data
    const telemetryData: TelemetryData = await req.json()

    // Basic anomaly detection (simple threshold-based)
    const anomalyScore = calculateAnomalyScore(telemetryData.sensorData)
    const isAnomaly = anomalyScore > 0.7

    // Insert telemetry data
    const { data: telemetry, error: telemetryError } = await supabase
      .from('telemetry')
      .insert({
        device_id: device.id,
        timestamp: telemetryData.timestamp || new Date().toISOString(),
        sensor_data: telemetryData.sensorData,
        anomaly_score: anomalyScore,
        is_anomaly: isAnomaly
      })
      .select()
      .single()

    if (telemetryError) {
      throw telemetryError
    }

    // Update device last heartbeat and status
    await supabase
      .from('devices')
      .update({
        last_heartbeat: new Date().toISOString(),
        status: 'online'
      })
      .eq('id', device.id)

    // Create incident if anomaly detected
    if (isAnomaly) {
      const { error: incidentError } = await supabase
        .from('incidents')
        .insert({
          title: `Anomaly detected on ${device.name}`,
          description: `Anomaly score: ${anomalyScore.toFixed(2)}. Sensor readings outside normal parameters.`,
          device_id: device.id,
          alert_level: anomalyScore > 0.9 ? 'critical' : 'warning',
          metadata: {
            anomaly_score: anomalyScore,
            sensor_data: telemetryData.sensorData,
            telemetry_id: telemetry.id
          }
        })

      if (incidentError) {
        console.error('Failed to create incident:', incidentError)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        telemetry_id: telemetry.id,
        anomaly_detected: isAnomaly,
        anomaly_score: anomalyScore
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing telemetry:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function calculateAnomalyScore(sensorData: Record<string, any>): number {
  // Simple anomaly detection based on sensor thresholds
  let anomalyScore = 0
  
  // Temperature anomaly (assuming normal range 18-30°C)
  if (sensorData.temperature) {
    const temp = parseFloat(sensorData.temperature)
    if (temp < 0 || temp > 50) anomalyScore += 0.4
    else if (temp < 10 || temp > 40) anomalyScore += 0.2
  }

  // CPU usage anomaly (assuming normal range 0-80%)
  if (sensorData.cpu_usage) {
    const cpu = parseFloat(sensorData.cpu_usage)
    if (cpu > 95) anomalyScore += 0.3
    else if (cpu > 85) anomalyScore += 0.1
  }

  // Memory usage anomaly (assuming normal range 0-85%)
  if (sensorData.memory_usage) {
    const memory = parseFloat(sensorData.memory_usage)
    if (memory > 95) anomalyScore += 0.3
    else if (memory > 85) anomalyScore += 0.1
  }

  // Network anomaly (unusual traffic patterns)
  if (sensorData.network_traffic) {
    const traffic = parseFloat(sensorData.network_traffic)
    if (traffic > 1000000) anomalyScore += 0.2 // > 1MB/s
  }

  return Math.min(anomalyScore, 1.0)
}