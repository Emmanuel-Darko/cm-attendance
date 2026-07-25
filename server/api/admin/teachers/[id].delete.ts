import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Teacher ID is required' })
  }

  // Get teacher record to find the user_id
  const { data: teacher, error: fetchError } = await client
    .from('teachers')
    .select('user_id')
    .eq('id', id)
    .single()

  if (fetchError) {
    throw createError({ statusCode: 400, statusMessage: fetchError.message })
  }

  // Delete teacher record
  const { error: deleteError } = await client.from('teachers').delete().eq('id', id)

  if (deleteError) {
    throw createError({ statusCode: 400, statusMessage: deleteError.message })
  }

  // Optionally delete the auth user
  if (teacher?.user_id) {
    const { error: authError } = await client.auth.admin.deleteUser(teacher.user_id)
    if (authError) {
      console.error('Failed to delete auth user:', authError.message)
    }
  }

  return { success: true, message: 'Teacher deleted successfully' }
})
