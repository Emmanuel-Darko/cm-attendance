import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, date, local_id } = body

  const supabase = serverSupabaseServiceRole<Database>(event)

  // 1. Create session
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      title,
      date,
      is_open: true,
      local_id
    })
    .select()
    .single()

  if (sessionError) {
    throw createError({ statusCode: 400, statusMessage: sessionError.message })
  }

  // 2. Snapshot kids
  const { data: kids } = await supabase
    .from('kids')
    .select('id')
    .eq('is_active', true)
    .eq('local_id', local_id ?? null)


  if (kids?.length) {
    await supabase.from('session_kids').insert(
      kids.map(kid => ({
        session_id: session.id,
        kid_id: kid.id,
        local_id: local_id,
        source: 'initial'
      }))
    )
  }

  return { success: true, session }
})
