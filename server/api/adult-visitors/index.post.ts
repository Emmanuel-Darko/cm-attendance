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
      how_heard: body.how_heard || null,
      interested_in: body.interested_in || [],
      assigned_to: body.assigned_to || null,
      follow_up_status: body.follow_up_status || 'new',
      notes: body.notes || null
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  setResponseStatus(event, 201)
  return data
})
