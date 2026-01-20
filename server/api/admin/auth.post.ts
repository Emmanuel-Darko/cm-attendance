import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { action, email, password } = body || {}

  const client = serverSupabaseServiceRole(event)

  if (action === 'login') {
    if (!email || !password) {
      return { error: 'Email and password are required.' }
    }
    const supabase = client
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      return { error: error.message || 'Login failed.' }
    }

    // Return session and user info only (do not set cookie here, since this is API)
    return {
      user: data.user,
      session: data.session,
    }
  } else if (action === 'logout') {
    const supabase = client

    const { error } = await supabase.auth.signOut()
    if (error) {
      return { error: error.message || 'Logout failed.' }
    }
    return { success: true }
  } else {
    return { error: 'Invalid action. Use "login" or "logout".' }
  }
})
