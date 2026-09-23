import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.full_name || typeof body.full_name !== 'string' || !body.full_name.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Full name is required.'
    })
  }

  if (!body?.team_id || typeof body.team_id !== 'string' || !body.team_id.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team is required.'
    })
  }

  const supabase = serverSupabaseServiceRole<Database>(event)

  // Verify team exists
  const { data: team, error: teamError } = await supabase
    .from('soul_teams')
    .select('id, name, color_tag')
    .eq('id', body.team_id.trim())
    .maybeSingle()

  if (teamError || !team) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid team selected.'
    })
  }

  const { data, error } = await supabase
    .from('soul_winners')
    .insert({
      full_name: body.full_name.trim(),
      team_id: team.id,
      phone: body.phone ? String(body.phone).trim() : null
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  setResponseStatus(event, 201)
  return {
    ...data,
    team_name: team.name,
    team_color_tag: team.color_tag,
    soul_count: 0
  }
})
