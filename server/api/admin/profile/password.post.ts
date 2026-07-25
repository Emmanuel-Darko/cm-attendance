import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)
  const body = await readBody(event)
  const { user_id, current_password, new_password } = body

  if (!user_id || !current_password || !new_password) {
    throw createError({ statusCode: 400, statusMessage: 'User ID, current password, and new password are required' })
  }

  if (new_password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'New password must be at least 6 characters' })
  }

  // Get user's email from auth (no dependency on teachers table)
  const { data: authUser, error: getUserError } = await client.auth.admin.getUserById(user_id)

  if (getUserError || !authUser?.user?.email) {
    throw createError({ statusCode: 400, statusMessage: 'User not found' })
  }

  const email = authUser.user.email

  // Verify current password
  const { error: signInError } = await client.auth.signInWithPassword({
    email,
    password: current_password,
  })

  if (signInError) {
    throw createError({ statusCode: 400, statusMessage: 'Current password is incorrect' })
  }

  // Update password
  const { error: updateError } = await client.auth.admin.updateUserById(user_id, {
    password: new_password
  })

  if (updateError) {
    throw createError({ statusCode: 400, statusMessage: updateError.message })
  }

  return { success: true, message: 'Password changed successfully' }
})
