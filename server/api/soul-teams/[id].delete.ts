import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const supabase = serverSupabaseServiceRole<Database>(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Team id is required.' })
  }

  // Check if team has winners assigned
  const { data: winners, error: checkError } = await supabase
    .from('soul_winners')
    .select('id')
    .eq('team_id', id)
    .limit(1)

  if (checkError) {
    throw createError({ statusCode: 400, statusMessage: checkError.message })
  }

  if (winners && winners.length > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Cannot delete team because members/winners are still assigned to it. Remove or reassign members first.'
    })
  }

  const { data, error } = await supabase
    .from('soul_teams')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Team not found.' })
  }

  setResponseStatus(event, 200)
  return { id: data.id }
})
