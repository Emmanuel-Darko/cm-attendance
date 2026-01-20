import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)

  // get user_id param if present (from query)
  const query = getQuery(event)
  const user_id = query?.user_id

  let queryBuilder = client
    .from('teachers')
    .select('*, locals(id, name)')

  if (user_id) {
    // Remove .single() so the type remains PostgrestFilterBuilder
    queryBuilder = queryBuilder.eq('user_id', user_id)
  } else {
    queryBuilder = queryBuilder.order('local_id', { ascending: true })
  }


  const { data, error } = await queryBuilder

  if (error)
    throw createError({ status: 400, message: error.message })

  return data
})