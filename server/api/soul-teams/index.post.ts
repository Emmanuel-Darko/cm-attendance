import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.name || typeof body.name !== 'string' || !body.name.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team name is required.'
    })
  }

  const supabase = serverSupabaseServiceRole<Database>(event)

  const { data, error } = await supabase
    .from('soul_teams')
    .insert({
      name: body.name.trim(),
      color_tag: body.color_tag?.trim() || 'amber'
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: 'A team with this name already exists.'
      })
    }
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  setResponseStatus(event, 201)
  return data
})
