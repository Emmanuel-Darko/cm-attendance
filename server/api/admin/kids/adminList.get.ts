import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)

  const { data, error } = await client
  .from('kids')
  .select('*')
  .order('full_name', { ascending: true })

  if(error)
    throw createError({ status: 400, message: error.message })

  return data
})
