import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { name, location } = body

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Local ID is required' })
  }

  const updateData: Record<string, any> = {}
  if (name !== undefined) {
    if (!name.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Name cannot be empty' })
    }
    updateData.name = name.trim()
  }
  if (location !== undefined) {
    updateData.location = location?.trim() || null
  }

  if (Object.keys(updateData).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No fields to update' })
  }

  const { error } = await client.from('locals').update(updateData).eq('id', id)

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return { success: true, message: 'Local updated successfully' }
})
