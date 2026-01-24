import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'
export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole<Database>(event)
  const body = await readBody(event)
  const { id } = body

  if (!id) {
    return { success: false, error: 'No ID provided for delete' }
  }

  // 1️⃣ Delete kid from 'kids' table (SOFT Delete)
  const { error } = await supabase
    .from('kids')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
})
