import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)

  const { data, error } = await client
    .from('announcements')
    .select('id, title, content, image_url, created_at, teachers(name)')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  return data
})
