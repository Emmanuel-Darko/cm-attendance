import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Announcement ID is required' })
  }

  const updateData: Record<string, any> = {}
  if (body.title !== undefined) updateData.title = body.title.trim()
  if (body.content !== undefined) updateData.content = body.content.trim()
  if (body.image_url !== undefined) updateData.image_url = body.image_url
  if (body.published !== undefined) updateData.published = body.published

  if (Object.keys(updateData).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No fields to update' })
  }

  const { error } = await client.from('announcements').update(updateData).eq('id', id)

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return { success: true, message: 'Announcement updated successfully' }
})
