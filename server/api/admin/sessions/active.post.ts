import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  const { local_id } = await readBody(event)

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      id,
      title,
      date,
      is_open,
      created_at,
      locals ( id, name )
    `)
    .eq('is_open', true)
    .eq('local_id', local_id)
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }

  return data
})


