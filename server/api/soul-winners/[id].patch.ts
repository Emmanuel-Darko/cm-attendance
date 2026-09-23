import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

type SoulWinnerUpdate = Database['public']['Tables']['soul_winners']['Update']

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Winner id is required.' })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Update payload is required.' })
  }

  const patch: SoulWinnerUpdate = {}
  if (body.full_name !== undefined) {
    if (typeof body.full_name !== 'string' || !body.full_name.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Full name cannot be empty.' })
    }
    patch.full_name = body.full_name.trim()
  }

  if (body.phone !== undefined) {
    patch.phone = body.phone ? String(body.phone).trim() : null
  }

  if (body.team_id !== undefined) {
    if (typeof body.team_id !== 'string' || !body.team_id.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Team ID cannot be empty.' })
    }
    patch.team_id = body.team_id.trim()
  }

  if (Object.keys(patch).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid fields provided to update.' })
  }

  const supabase = serverSupabaseServiceRole<Database>(event)

  const { data, error } = await supabase
    .from('soul_winners')
    .update(patch)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Winner record not found.' })
  }

  // Fetch team details
  const { data: team } = await supabase
    .from('soul_teams')
    .select('name, color_tag')
    .eq('id', data.team_id)
    .maybeSingle()

  return {
    ...data,
    team_name: team?.name || '',
    team_color_tag: team?.color_tag || 'amber'
  }
})
