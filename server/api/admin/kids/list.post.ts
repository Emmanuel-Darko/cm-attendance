import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)
  const { local_id, allHistorical=false } = await readBody(event)
  
  const query = client
    .from('kids')
    .select('*')
    .eq('local_id', local_id ?? null)

  if (!allHistorical) {
    query.eq('is_active', true)
  }

  const { data, error } = await query.order('full_name', { ascending: true })

  if(error)
    throw createError({ status: 400, message: error.message })

  return data
})
