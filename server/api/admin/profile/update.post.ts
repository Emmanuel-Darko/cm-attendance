import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)
  const body = await readBody(event)
  const { user_id, full_name, contact, avatar_url, gender, dob } = body

  if (!user_id) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' })
  }

  // Check if user has a teacher record
  const { data: teacher } = await client
    .from('teachers')
    .select('id')
    .eq('user_id', user_id)
    .maybeSingle()

  const metadata: Record<string, any> = {}
  if (full_name !== undefined) metadata.name = full_name
  if (contact !== undefined) metadata.contact = contact
  if (avatar_url !== undefined) metadata.avatar_url = avatar_url
  if (gender !== undefined) metadata.gender = gender
  if (dob !== undefined) metadata.dob = dob

  if (teacher) {
    // Update teacher record (only columns that exist on the table)
    const updateData: Record<string, any> = {}
    if (full_name !== undefined) updateData.name = full_name
    if (contact !== undefined) updateData.contact = contact
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url

    const { error: updateError } = await client
      .from('teachers')
      .update(updateData)
      .eq('id', teacher.id)

    if (updateError) {
      throw createError({ statusCode: 400, statusMessage: updateError.message })
    }

    // Also update auth user_metadata so all fields are accessible
    const { error: metaError } = await client.auth.admin.updateUserById(user_id, {
      user_metadata: metadata
    })
    if (metaError) {
      console.error('Failed to update user_metadata:', metaError.message)
    }
  } else {
    // Admin without teacher record — store in auth user_metadata
    const { error: updateError } = await client.auth.admin.updateUserById(user_id, {
      user_metadata: metadata
    })

    if (updateError) {
      throw createError({ statusCode: 400, statusMessage: updateError.message })
    }
  }

  return { success: true, message: 'Profile updated successfully' }
})
