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

  /* 2️⃣ Check if there is an OPEN session for this local */
  const { data: openSession } = await supabase
    .from('sessions')
    .select('id')
    .eq('local_id', local_id)
    .eq('is_open', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  /* 3️⃣ If session exists → add kid to snapshot */
  if (openSession) {
    await supabase.from('session_kids').insert([
      {
        session_id: openSession.id,
        kid_id: kid?.id,
        local_id: local_id,
        source: 'late_add'
      }
    ])
  }

  return {
    success: true,
    kid,
    added_to_session: !!openSession
  }
})
