import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  const { session_id } = await readBody(event)

  if (!session_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Session ID is required'
    })
  }

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      locals ( id, name )
    `)
    .eq('id', session_id)
    .single()

  if (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Session not found'
    })
  }

  return data
})
