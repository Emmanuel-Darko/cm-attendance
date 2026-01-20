import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole<Database>(event)
  const { kid_id, session_id } = await readBody(event)

  if (!kid_id || !session_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'kid_id and session_id are required'
    })
  }

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

  if (!existing) {
    return {
      success: false,
      code: 'NOT_FOUND',
      message: 'record not found.'
    }
  }

  const { error: deleteError } = await supabase
    .from('attendance')
    .delete()
    .eq('kid_id', kid_id)
    .eq('session_id', session_id)

  if (deleteError) {
    throw createError({
      statusCode: 400,
      statusMessage: deleteError.message
    })
  }

  return {
    success: true,
    message: 'Record removed successfully'
  }
})


