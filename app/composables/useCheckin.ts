import { ref, computed, watch, onMounted } from 'vue'
import CheckinModal from '~/components/modals/CheckinModal.vue'

export const useCheckin = () => {
  const { showModal, hideModal } = useCommon()

  // UI & feedback
  const message = ref('')
  const kidName = ref('')
  const kidAvatar = ref('')
  const countdown = ref(5)

  // Session management
  const activeSessions = ref<any[]>([])
  const selectedSessionId = ref<string | null>(null)
  const loading = ref(true)
  const error = ref<any>(null)

  // Kids and attendance
  const kids = ref<any[]>([])
  const attendance = ref<any[]>([])
  const loadingKids = ref(false)
  const checkingIn = ref(false)

  const localId = computed(() => useAuth().user.value.local_id)

  // Attendance map for quick lookup
  const attendanceMap = computed<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    attendance.value.forEach((record) => {
      map[record.kid_id] = record.checkin_time
    })
    return map
  })

  // Sort kids according to their check-in time (present first, by time ascending, then absent)
  const sortedKids = computed(() => {
    // Create a lookup for checkin_time
    const kidCheckins: Record<string, string | null> = {}
    attendance.value.forEach((record) => {
      kidCheckins[record.kid_id] = record.checkin_time
    })
    return [...kids.value].sort((a, b) => {
      const timeA = kidCheckins[a.id]
      const timeB = kidCheckins[b.id]
      if (timeA && timeB) {
        // both present, sort by check-in time ascending
        return new Date(timeA).getTime() - new Date(timeB).getTime()
      } else if (timeA && !timeB) {
        // a present, b not
        return -1
      } else if (!timeA && timeB) {
        // b present, a not
        return 1
      }
      return 0 // both absent, keep order
    })
  })

  async function handleScan(kidId: string) {
    if (!selectedSessionId.value) {
      message.value = 'No session selected.'
      return
    }

    // Optimize lookup by using a Set if many kids, for now keep as simple find
    const foundKid = kids.value.find(k => k.id === kidId)
    if (!foundKid) {
      message.value = 'Kid not available'
      return
    }

    try {
      const { success, message: msg, kid } = await $fetch<{
        success: boolean
        message: string
        kid?: { full_name: string; avatar_url: string | null }
      }>('/api/admin/attendance/checkin', {
        method: 'POST',
        body: {
          kid_id: kidId,
          session_id: selectedSessionId.value,
          local_id: localId.value
        }
      })

      message.value = msg

      if (!success || !kid) return

      kidName.value = kid.full_name || 'Guest'
      kidAvatar.value = kid.avatar_url || '~/assets/avatar.jpg'
      showSuccessModal()
      await fetchAttendance()
    } catch (error) {
      message.value = 'An error occurred during check-in.'
      console.error(error)
    }
  }

  function showSuccessModal() {
    countdown.value = 10
    showModal(CheckinModal, { kidAvatar, kidName, countdown })
    launchConfetti()

    const timer = setInterval(() => {
      countdown.value -= 1
      if (countdown.value <= 0) {
        clearInterval(timer)
        hideModal()
      }
    }, 1000)
  }

  // Fetch active sessions
  async function fetchActiveSessions() {
    const data = await $fetch<any[]>('/api/admin/sessions/active', {
      method: 'POST',
      body: { local_id: localId.value }
    })
    activeSessions.value = data
    if (data.length > 0 && !selectedSessionId.value) {
      selectedSessionId.value = data[0].id
    }
  }

  // Fetch all kids
  async function fetchKids() {
    loadingKids.value = true
    const data = await $fetch<any[]>('/api/admin/kids/list', {
      method: 'POST',
      body: { local_id: localId.value }
    })
    kids.value = data
    loadingKids.value = false
  }

  // Fetch attendance for selected session
  async function fetchAttendance() {
    if (!selectedSessionId.value) {
      attendance.value = []
      return
    }

    const data = await $fetch<any[]>('/api/admin/attendance/get', {
      method: 'POST',
      body: { session_id: selectedSessionId.value }
    })
    attendance.value = data
  }

  // Manual check-in function
  async function manualCheckIn(kidId: string, fullName: string) {
    if (!selectedSessionId.value || checkingIn.value) return

    checkingIn.value = true

    try {
      const res = await $fetch<{
        success: boolean
        message: string
        kid?: { full_name: string; avatar_url: string | null }
        code?: string
      }>('/api/admin/attendance/checkin', {
        method: 'POST',
        body: {
          kid_id: kidId,
          session_id: selectedSessionId.value,
          local_id: useAuth().user.value.local_id
        }
      })

      message.value = res.message

      if (!res.success) return

      const avatarSource = res.kid?.avatar_url

      message.value = `${fullName} checked in successfully!`
      kidName.value = fullName
      kidAvatar.value = avatarSource || '~/assets/avatar.jpg'
      showSuccessModal()
      await fetchAttendance()
    } finally {
      checkingIn.value = false
    }
  }

  async function removeAttendance(kidId: string) {
    if (!selectedSessionId.value || checkingIn.value) return

    checkingIn.value = true

    try {
      const res = await $fetch<{
        success: boolean
        message: string
        code?: string
      }>('/api/admin/attendance/remove', {
        method: 'POST',
        body: {
          kid_id: kidId,
          session_id: selectedSessionId.value
        }
      })

      message.value = res.message

      if (!res.success) return

      await fetchAttendance()
    } finally {
      checkingIn.value = false
    }
  }

  // Watch for session changes
  watch(selectedSessionId, () => {
    fetchAttendance()
  })

  // Initialize on mount
  onMounted(async () => {
    try {
      await fetchActiveSessions()
      await fetchKids()
      await fetchAttendance()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  })

  return {
    // state
    message,
    activeSessions,
    selectedSessionId,
    sortedKids,
    attendance,
    loadingKids,
    checkingIn,
    attendanceMap,
    loading,

    // actions
    handleScan,
    manualCheckIn,
    removeAttendance
  }
}


