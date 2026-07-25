import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.first_name || !body?.last_name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'First name and last name are required.'
    })
  }

  const supabase = serverSupabaseServiceRole<Database>(event)

  const { data, error } = await supabase
    .from('adult_visitors')
    .insert({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email || null,
      phone: body.phone || null,
      visit_date: body.visit_date || undefined,
      first_time_guest: body.first_time_guest ?? true,
      address: body.address || null,
      occupation: body.occupation || null,
      how_heard: body.how_heard || null,
      interested_in: Array.isArray(body.interested_in) ? body.interested_in : [],
      notes: body.notes || null
    })
    .select('id, first_name, last_name, email, phone, visit_date, first_time_guest, address, how_heard, interested_in, notes, created_at')
    .single()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  setResponseStatus(event, 201)
  return data
})
