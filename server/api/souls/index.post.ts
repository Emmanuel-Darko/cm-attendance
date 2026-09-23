import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database, SoulStatus } from '~/types/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.full_name || typeof body.full_name !== 'string' || !body.full_name.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Soul full name is required.'
    })
  }

  if (!body?.won_by || typeof body.won_by !== 'string' || !body.won_by.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Soul winner is required.'
    })
  }

  const supabase = serverSupabaseServiceRole<Database>(event)

  // Verify winner exists and fetch team info
  const { data: winner, error: winnerError } = await supabase
    .from('soul_winners')
    .select('id, full_name, team_id')
    .eq('id', body.won_by.trim())
    .maybeSingle()

  if (winnerError || !winner) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid soul winner selected.'
    })
  }

  const { data: team } = await supabase
    .from('soul_teams')
    .select('id, name, color_tag')
    .eq('id', winner.team_id)
    .maybeSingle()

  const validStatuses: SoulStatus[] = ['new', 'contacted', 'in_discipleship', 'baptized', 'integrated']
  const status: SoulStatus = validStatuses.includes(body.status) ? body.status : 'new'

  const { data, error } = await supabase
    .from('souls')
    .insert({
      full_name: body.full_name.trim(),
      phone: body.phone ? String(body.phone).trim() : null,
      location: body.location ? String(body.location).trim() : null,
      date_won: body.date_won || new Date().toISOString().slice(0, 10),
      status,
      won_by: winner.id,
      notes: body.notes ? String(body.notes).trim() : null
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  setResponseStatus(event, 201)
  return {
    ...data,
    won_by_name: winner.full_name,
    team_id: winner.team_id,
    team_name: team?.name || 'Unknown Team',
    team_color_tag: team?.color_tag || 'amber'
  }
})
