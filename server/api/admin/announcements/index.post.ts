import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)
  const body = await readBody(event)
  const { title, content, image_url, published, author_id } = body

  if (!title || !title.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }

  if (!content || !content.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Content is required' })
  }

  const { data, error } = await client
    .from('announcements')
    .insert({
      title: title.trim(),
      content: content.trim(),
      image_url: image_url || null,
      author_id: author_id || null,
      published: published ?? false
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return { success: true, message: 'Announcement created successfully', data }
})
