import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole<Database>(event)
  const { session_id } = await readBody(event)

  if (!session_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'session_id is required'
    })
  }

  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('session_id', session_id)
    .order('checkin_time', { ascending: true })

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }

  return data
})


