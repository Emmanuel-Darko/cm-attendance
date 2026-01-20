import { useState, computed, onMounted } from '#imports'

type SupabaseUser = {
  id: string
  email: string
  role?: string
  is_admin?: boolean
  [key: string]: any
} | null

// Utility: set user & session info to localStorage
function setSessionData(user: any, loginUser: any, session: any) {
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('loginUser', JSON.stringify(loginUser))
  localStorage.setItem('token', session.access_token)
  localStorage.setItem('refresh_token', session.refresh_token)
  localStorage.setItem('expires_at', String(session.expires_at || ''))
  localStorage.setItem('token_type', session.token_type)
}

// Utility: clear all stored user/session items from localStorage
function clearSessionData() {
  localStorage.removeItem('user')
  localStorage.removeItem('loginUser')
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('expires_at')
  localStorage.removeItem('token_type')
}

// Utility: fetch and set teacher data to user.value
async function fetchAndSetTeacherData(userObj: any, userRef: any) {
  if (userObj?.id) {
    try {
      const { data: teacherData } = await useFetch('/api/admin/teachers/list', {
        method: 'GET',
        params: { user_id: userObj.id }
      })
      const dataArr = Array.isArray(teacherData.value) ? teacherData.value : []
      userRef.value = dataArr[0] ?? null
    } catch (e) {
      userRef.value = null
      console.error(e)
    }
  } else {
    userRef.value = null
  }
}

export const useAuth = () => {
  const user = useState<any>('user', () => null)
  const client = useSupabaseClient()
  const loading = useState<boolean>('authLoading', () => false)
  const error = useState<string>('authError', () => '')

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = ''
    try {
      const { data: response, error: fetchError } = await useFetch('/api/admin/auth', {
        method: 'POST',
        body: {
          action: 'login',
          email,
          password
        }
      })

      if (fetchError.value) {
        error.value = fetchError.value.message || 'Login failed'
        user.value = null
        return null
      }

      if (
        response.value &&
        typeof response.value === 'object' &&
        'error' in response.value &&
        response.value.error
      ) {
        error.value = typeof response.value.error === 'string' ? response.value.error : 'Login failed'
        user.value = null
        return null
      }

      const { user: loginUser, session } = response.value as { user: SupabaseUser; session: any }

      // Set teacher data to user
      await fetchAndSetTeacherData(loginUser, user)

      if (user.value && session) {
        setSessionData(user.value, loginUser, session)
      }

      const router = useRouter()
      const role = user.value?.role

      if (role === USER_ROLES.admin) {
        router.push('/admin')
      } else {
        // fallback for teacher/unknown: homepage
        router.push('/')
      }

      return user.value
    } catch (err: any) {
      error.value = err?.message || 'Unknown error'
      user.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    const router = useRouter()
    try {
      await client.auth.signOut()
      user.value = null
      clearSessionData()
      router.push('/login')
    } catch (err: any) {
      error.value = err?.message || 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  const getUser = async () => {
    loading.value = true
    try {
      // 1. Try to get user information from localStorage
      const localUser = localStorage.getItem('user')
      if (localUser) {
        try {
          user.value = JSON.parse(localUser) as SupabaseUser
          return user.value
        } catch {
          user.value = null
        }
      }

      // 2. Fallback: get user from supabase client and attach teacher info
      const { data: loginUser, error: userError } = await client.auth.getUser()
      if (userError) {
        user.value = null
        error.value = userError.message
        return null
      }
      const userId = loginUser?.user?.id
      if (!userId) {
        user.value = null
        throw new Error('User ID not found')
      }
      await fetchAndSetTeacherData({ id: userId }, user)
      return user.value
    } catch (err: any) {
      error.value = err?.message || 'Unknown error'
      user.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  const isAdmin = computed(() => {
    const u = user.value
    if (!u) return false
    return u.role === 'admin' || u.is_admin === true
  })

  return {
    client,
    user,
    loading,
    error,
    isAdmin,
    login,
    logout,
    getUser,
  }
}