import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database, SoulStatus } from '~/types/database'

type SoulUpdate = Database['public']['Tables']['souls']['Update']

const ALLOWED_FIELDS = [
  'full_name', 'phone', 'location', 'date_won', 'status', 'won_by', 'notes'
]

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Soul id is required.' })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Update payload is required.' })
  }

  const fields = Object.keys(body).filter((key) =>
    ALLOWED_FIELDS.includes(key)
  ) as (keyof SoulUpdate)[]

  if (!fields.length) {
    throw createError({ statusCode: 400, statusMessage: 'No valid fields to update.' })
  }

  const patch: SoulUpdate = {}
  for (const field of fields) {
    if (field === 'status') {
      const validStatuses: SoulStatus[] = ['new', 'contacted', 'in_discipleship', 'baptized', 'integrated']
      if (validStatuses.includes(body.status)) {
        patch.status = body.status
      }
    } else if (field === 'full_name') {
      if (typeof body.full_name === 'string' && body.full_name.trim()) {
        patch.full_name = body.full_name.trim()
      }
    } else {
      (patch as any)[field] = body[field] !== undefined ? body[field] : null
    }
  }

  const supabase = serverSupabaseServiceRole<Database>(event)

  const { data, error } = await supabase
    .from('souls')
    .update(patch)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Soul record not found.' })
  }

  // Fetch winner and team info
  const { data: winner } = await supabase
    .from('soul_winners')
    .select('id, full_name, team_id')
    .eq('id', data.won_by)
    .maybeSingle()

  let teamName = 'Unknown Team'
  let teamColorTag = 'amber'
  let teamId = ''

  if (winner) {
    teamId = winner.team_id
    const { data: team } = await supabase
      .from('soul_teams')
      .select('name, color_tag')
      .eq('id', winner.team_id)
      .maybeSingle()
    if (team) {
      teamName = team.name
      teamColorTag = team.color_tag
    }
  }

  return {
    ...data,
    won_by_name: winner?.full_name || 'Unknown Winner',
    team_id: teamId,
    team_name: teamName,
    team_color_tag: teamColorTag
  }
})
