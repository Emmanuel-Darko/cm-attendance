import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const supabase = serverSupabaseServiceRole<Database>(event)

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required.' })
  }

  const body = await readBody(event)
  const updates: Record<string, any> = {}

  if (typeof body?.monthly_target === 'number' && body.monthly_target > 0) {
    updates.monthly_target = Math.floor(body.monthly_target)
  }
  if (typeof body?.target_count === 'number' && body.target_count > 0) {
    updates.target_count = Math.floor(body.target_count)
  }
  if (body?.project_title && typeof body.project_title === 'string') {
    updates.project_title = body.project_title.trim()
  }

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid target updates provided.' })
  }

  const { data, error } = await supabase
    .from('soul_targets')
    .update(updates)
    .eq('id', 1)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return data
})
