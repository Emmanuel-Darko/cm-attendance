import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { session_id } = await readBody(event)
  const supabase = serverSupabaseServiceRole(event)

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
    .eq('id', session_id)
    .single()

  if (error) throw error

  return data
})
