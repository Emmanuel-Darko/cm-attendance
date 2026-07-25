import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { name, email, local_id, role, contact } = body

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Teacher ID is required' })
  }

  const updateData: Record<string, any> = {}
  if (name !== undefined) updateData.name = name
  if (email !== undefined) updateData.email = email
  if (local_id !== undefined) updateData.local_id = local_id
  if (role !== undefined) updateData.role = role
  if (contact !== undefined) updateData.contact = contact

  if (Object.keys(updateData).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No fields to update' })
  }

  const { error } = await client.from('teachers').update(updateData).eq('id', id)

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return { success: true, message: 'Teacher updated successfully' }
})
