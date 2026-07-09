import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

type AdultVisitorUpdate = Database['public']['Tables']['adult_visitors']['Update']

const ALLOWED_FIELDS = [
  'first_name', 'last_name', 'email', 'phone', 'visit_date',
  'first_time_guest', 'address', 'how_heard', 'interested_in',
  'assigned_to', 'follow_up_status', 'notes'
]

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const supabase = serverSupabaseServiceRole<Database>(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Visitor id is required.' })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: 'A visitor update payload is required.' })
  }

  const fields = Object.keys(body).filter((key) =>
    ALLOWED_FIELDS.includes(key)
  ) as (keyof AdultVisitorUpdate)[]

  if (!fields.length) {
    throw createError({ statusCode: 400, statusMessage: 'No valid fields to update.' })
  }

  const patch = fields.reduce<AdultVisitorUpdate>((payload, field) => {
    payload[field] = body[field]
    return payload
  }, {})

  const { data, error } = await supabase
    .from('adult_visitors')
    .update(patch)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Visitor record not found.' })
  }

  return data
})
