import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { full_name, dob, gender, local_id, avatar_url, guardian_name, guardian_contact } = body

  const supabase = serverSupabaseServiceRole<Database>(event)

  /* 1️⃣ Create kid */
  const { data: kid, error: kidError } = await supabase
    .from('kids')
    .insert([
      { 
        full_name,
        dob,
        gender,
        local_id,
        avatar_url,
        guardian_name,
        guardian_contact
      },
    ])
    .select()
    .single()

  if (kidError) {
    throw createError({ statusCode: 400, statusMessage: kidError.message })
  }

  /* 2️⃣ Check if there are any OPEN sessions for this local */
  const { data: openSessions, error: openSessionsError } = await supabase
    .from('sessions')
    .select('id')
    .eq('local_id', local_id)
    .eq('is_open', true)
    .order('created_at', { ascending: false })

  if (openSessionsError) {
    throw createError({ statusCode: 400, statusMessage: openSessionsError.message })
  }

  /* 3️⃣ If sessions exist → add kid to snapshot for all sessions */
  if (openSessions && openSessions.length > 0) {
    const inserts = openSessions.map(session => ({
      session_id: session.id,
      kid_id: kid?.id,
      local_id: local_id,
      source: 'late_add'
    }));

    await supabase.from('session_kids').insert(inserts)
  }

  return {
    success: true,
    kid,
    added_to_session: !!(openSessions && openSessions.length > 0)
  }
})
