import type { Database } from '~/types/database'

type Session = Database['public']['Tables']['sessions']['Row']

export const useSessions = () => {
  const sessions = useState<Session[]>('sessions', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const title = ref('')
  const date = ref<string | null>(null)
  const localId = computed(() => useAuth().user.value.local_id)

  /**
   * 1️⃣ Create session (SERVER handles snapshot)
   */
  const createSession = async () => {
    loading.value = true
    error.value = null

    try {
      await $fetch('/api/admin/sessions/create', {
        method: 'POST',
        body: {
          title: title.value,
          date: date.value,
          local_id: localId.value
        }
      })

      title.value = ''
      date.value = null
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to create session'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 2️⃣ Fetch all sessions (SERVER route)
   */
  const fetchSessions = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Session[]>('/api/admin/sessions/list', {
        method: 'POST',
        body: { local_id: localId.value }
      })
      sessions.value = data
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to fetch sessions'
    } finally {
      loading.value = false
    }
  }

  /**
   * 3️⃣ Fetch single session by ID
   */
  const fetchSessionById = async (sessionId: string) => {
    try {
      return await $fetch<Session>('/api/admin/sessions/get', {
        method: 'POST',
        body: { session_id: sessionId }
      })
    } catch (err: any) {
      throw err
    }
  }

  /**
   * 4️⃣ Close session (SERVER route)
   */
  const closeSession = async (sessionId: string) => {
    loading.value = true
    error.value = null

    try {
      await $fetch('/api/admin/sessions/close', {
        method: 'POST',
        body: { session_id: sessionId }
      })

      await fetchSessions()
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to close session'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    sessions,
    title,
    date,
    localId,
    loading,
    error,

    // actions
    createSession,
    fetchSessions,
    fetchSessionById,
    closeSession
  }
}
