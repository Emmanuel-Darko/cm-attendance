import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

type SoulTeamUpdate = Database['public']['Tables']['soul_teams']['Update']

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Team id is required.' })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Update payload is required.' })
  }

  const patch: SoulTeamUpdate = {}
  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || !body.name.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Team name cannot be empty.' })
    }
    patch.name = body.name.trim()
  }

  if (body.color_tag !== undefined) {
    patch.color_tag = typeof body.color_tag === 'string' ? body.color_tag.trim() : 'amber'
  }

  if (Object.keys(patch).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid fields provided to update.' })
  }

  const supabase = serverSupabaseServiceRole<Database>(event)

  const { data, error } = await supabase
    .from('soul_teams')
    .update(patch)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'A team with this name already exists.' })
    }
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Team not found.' })
  }

  return data
})
