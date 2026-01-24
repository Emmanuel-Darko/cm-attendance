import type { Session, Kid, Teacher, SessionKid, Attendance } from '~/types/database'

export const useSessions = () => {
  const sessions = useState<Session[]>('sessions', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const title = ref('')
  const date = ref<string | null>(null)
  const localId = computed(() => useAuth().user.value.local_id)

  // closing session
  const recap = ref('')
  const offertory = ref<number | null>(null)
  const selected = ref<string[]>([])

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
      const data = await $fetch<any[]>('/api/admin/sessions/list', {
        method: 'POST',
        body: { local_id: localId.value }
      })
      // Map from API structure to desired view model with extra details
      // Assumes API returns: id, title, date, recap, offertory, is_open, closed_at, created_at,
      // locals ({ id, name }), session_teachers ({ teacher_id, teachers }),
      // session_kids ({ kid_id, kids }), attendance ({ kid_id })
      sessions.value = data.map((session) => ({
        ...session,
        // Flatten local for easy access
        local: session.locals ? session.locals : null,
        // Teachers: extract array of teacher info
        teachers: session.session_teachers?.map((st: any) => st.teachers) ?? [],
        // Kids: extract kid objects
        kids: session.session_kids?.map((sk: any) => sk.kids) ?? [],
        // Attendance: record of present kid_ids as Set
        presentKidIds: new Set(session.attendance?.map((a: any) => a.kid_id)),
        // Add absent/present kid splits for convenience
        kidsPresent: session.session_kids?.filter(
          (sk: any) => session.attendance?.some((a: any) => a.kid_id === sk.kid_id)
        ).map((sk: any) => sk.kids)?.length ?? []?.length,
        kidsAbsent: session.session_kids?.filter(
          (sk: any) => !(session.attendance?.some((a: any) => a.kid_id === sk.kid_id))
        ).map((sk: any) => sk.kids)?.length ?? []?.length
      }))
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
    const { data, error, refresh } = await useFetch(
      '/api/admin/sessions/get',
      {
        method: 'POST',
        body: { session_id: sessionId }
      }
    )
  
    if (error.value) throw error.value
  
    const session = computed(() => data.value)
  
    // map attendance kid_ids
    const presentKidIds = computed(() =>
      new Set(session.value?.attendance.map((a:Attendance) => a.kid_id))
    )
  
    const kidsPresent = computed(() =>
      session.value?.session_kids
        .filter((k: SessionKid) => presentKidIds.value.has(k.kid_id))
        .map((k: {kids: Kid[]})=> k.kids)
    )
  
    const kidsAbsent = computed(() =>
      session.value?.session_kids
        .filter((k: SessionKid) => !presentKidIds.value.has(k.kid_id))
        .map((k: {kids: Kid[]}) => k.kids)
    )
  
    const teachersPresent = computed(() =>
      session.value?.session_teachers.map((st: {teachers: Teacher[]}) => st.teachers) ?? []
    )
  
    return {
      session,
      kidsPresent,
      kidsAbsent,
      teachersPresent,
      refresh
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
        body: { 
          session_id: sessionId,
          recap: recap.value,
          offertory: offertory.value,
          teacher_ids: selected.value
        }
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
    recap,
    offertory,
    selected,

    // actions
    createSession,
    fetchSessions,
    fetchSessionById,
    closeSession
  }
}
