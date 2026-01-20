import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole<Database>(event)
  const { kid_id, session_id, local_id } = await readBody(event)

  if (!kid_id || !session_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'kid_id and session_id are required'
    })
  }

  // Check if kid already checked in
  const { data: existing, error: existingError } = await supabase
    .from('attendance')
    .select('*')
    .eq('kid_id', kid_id)
    .eq('session_id', session_id)
    .maybeSingle()

  if (existingError) {
    throw createError({
      statusCode: 400,
      statusMessage: existingError.message
    })
  }

  if (existing) {
    return {
      success: false,
      code: 'ALREADY_CHECKED_IN',
      message: 'Already checked in.'
    }
  }

  // Get kid details
  const { data: kid, error: kidError } = await supabase
    .from('kids')
    .select('full_name, avatar_url')
    .eq('id', kid_id)
    .maybeSingle()

  if (kidError || !kid) {
    return {
      success: false,
      code: 'KID_NOT_FOUND',
      message: 'Kid not found.'
    }
  }

  // Insert attendance record
  const { error: insertError } = await supabase.from('attendance').insert([
    {
      kid_id,
      session_id,
      checkin_time: new Date().toISOString(),
      local_id
    }
  ])

  if (insertError) {
    throw createError({
      statusCode: 400,
      statusMessage: insertError.message
    })
  }

  return {
    success: true,
    message: 'Check-in successful!',
    kid
  }
})


