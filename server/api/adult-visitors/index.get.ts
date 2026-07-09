import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const supabase = serverSupabaseServiceRole<Database>(event)

  let request = supabase
    .from('adult_visitors')
    .select('*')
    .order('visit_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (query.status && query.status !== 'all') {
    request = request.eq('follow_up_status', String(query.status))
  }

  if (query.search) {
    const search = String(query.search).replace(/[%_]/g, '\\$&')
    request = request.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
    )
  }

  const { data, error } = await request

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return data
})
