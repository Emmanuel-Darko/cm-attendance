import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Local ID is required' })
  }

  // Check if any teachers are assigned to this local
  const { data: teachers, error: checkError } = await client
    .from('teachers')
    .select('id')
    .eq('local_id', id)
    .limit(1)

  if (checkError) {
    throw createError({ statusCode: 400, statusMessage: checkError.message })
  }

  if (teachers && teachers.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot delete local with assigned teachers. Reassign teachers first.'
    })
  }

  const { error } = await client.from('locals').delete().eq('id', id)

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return { success: true, message: 'Local deleted successfully' }
})
