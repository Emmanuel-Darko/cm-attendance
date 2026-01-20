import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)
  const { local_id } = await readBody(event)

  const { data, error } = await client
  .from('kids')
  .select('*')
  .eq('local_id', local_id)
  .order('full_name', { ascending: true })

  if(error)
    throw createError({ status: 400, message: error.message })

  return data
})
