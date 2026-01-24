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
      recap,
      offertory,
      is_open,
      closed_at,
      created_at,
      locals (
        id,
        name
      ),
      session_teachers (
        teacher_id,
        teachers (
          id,
          name,
          email
        )
      ),
      session_kids (
        kid_id,
        kids (
          id,
          full_name,
          dob
        )
      ),
      attendance (
        kid_id
      )
    `)
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
