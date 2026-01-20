import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, local_id, role } = body

  const client = serverSupabaseServiceRole(event)

  // 1️⃣ Create auth user
  const { data: authUser, error: authError } = await client.auth.admin.createUser({
    email,
    password: 'password123',
    email_confirm: true
  })
  if (authError) throw createError({ statusCode: 400, statusMessage: authError.message })

  // 2️⃣ Insert teacher record
  const { error: insertError } = await client.from('teachers').insert([
    {
      user_id: authUser.user?.id,
      name,
      email,
      local_id,
      role
    }
  ])
  if (insertError) throw createError({ statusCode: 400, statusMessage: insertError.message })

  return { success: true, message: 'Teacher added successfully!' }
})
