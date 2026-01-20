import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole<Database>(event)
  const { local_id } = await readBody(event)

  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('local_id', local_id)
    .order('checkin_time', { ascending: true })

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }

  return data
})


