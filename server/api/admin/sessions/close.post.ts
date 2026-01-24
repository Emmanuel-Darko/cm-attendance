import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole<Database>(event)
  const { session_id, recap, offertory, teacher_ids } = await readBody(event)

  if (!session_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Session ID is required'
    })
  }

  // 1️⃣ Update session
  const { error } = await supabase
    .from('sessions')
    .update({
      recap,
      offertory,
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

  // 2️⃣ Insert teacher attendance
  const rows = teacher_ids.map((teacher_id: string) => ({
    session_id,
    teacher_id
  }))

  const { error: teacherError } = await supabase
    .from('session_teachers')
    .insert(rows)

  if (teacherError) throw teacherError

  return {
    success: true,
    message: 'Session closed successfully'
  }
})
