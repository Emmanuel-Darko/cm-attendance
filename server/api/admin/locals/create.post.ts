import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)

  const body = await readBody(event)
  const { name, location } = body

  if (!name || typeof name !== 'string' || !name.trim()) {
    return {
      success: false,
      message: 'Name is required.',
    }
  }

  // Insert the new local into the "locals" table
  const { error } = await client
    .from('locals')
    .insert([
      { name: name.trim(), location: location?.trim() || null }
    ])

  if (error) {
    return {
      success: false,
      message: error.message || 'Failed to add local'
    }
  }

  return {
    success: true,
    message: 'Local added successfully'
  }
})