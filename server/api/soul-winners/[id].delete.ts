import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const supabase = serverSupabaseServiceRole<Database>(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Winner id is required.' })
  }

  // Check if any souls reference this winner
  const { data: souls, error: checkError } = await supabase
    .from('souls')
    .select('id')
    .eq('won_by', id)
    .limit(1)

  if (checkError) {
    throw createError({ statusCode: 400, statusMessage: checkError.message })
  }

  if (souls && souls.length > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Cannot delete soul winner because recorded souls are assigned to them. Reassign or remove their soul entries first.'
    })
  }

  const { data, error } = await supabase
    .from('soul_winners')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Winner record not found.' })
  }

  setResponseStatus(event, 200)
  return { id: data.id }
})
