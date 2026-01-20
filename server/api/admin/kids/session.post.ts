import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole<Database>(event)
  const { local_id } = await readBody(event)

  const { data, error } = await client
  .from('session_kids')
  .select('*')
  .eq('local_id', local_id)

  if(error)
    throw createError({ status: 400, message: error.message })

  return data as Database['public']['Tables']['session_kids']['Row'][]
})
