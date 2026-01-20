import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole<Database>(event)
  const { session_id } = await readBody(event)

  if (!session_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Session ID is required'
    })
  }

  const { error } = await supabase
    .from('sessions')
    .update({
      is_open: false,
      closed_at: new Date().toISOString()
    })
    .eq('id', session_id)

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }

  return {
    success: true,
    message: 'Session closed successfully'
  }
})
