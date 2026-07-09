import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const supabase = serverSupabaseServiceRole<Database>(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Visitor id is required.' })
  }

  const { data, error } = await supabase
    .from('adult_visitors')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Visitor record not found.' })
  }

  setResponseStatus(event, 200)
  return { id: data.id }
})
