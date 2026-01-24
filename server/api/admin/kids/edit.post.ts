import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, full_name, dob, gender, local_id, avatar_url, guardian_name, guardian_contact } = body

  if (!id) {
    return { success: false, error: 'No kid ID provided for edit.' }
  }

  const supabase = serverSupabaseServiceRole<Database>(event)

  // 1️⃣ Update kid row
  const { data: kid, error } = await supabase
    .from('kids')
    .update({
      full_name,
      dob,
      gender,
      local_id,
      avatar_url,
      guardian_name,
      guardian_contact
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return {
    success: true,
    kid
  }
})
