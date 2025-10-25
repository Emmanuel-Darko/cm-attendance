<template>
  <div class="max-w-6xl mx-auto p-4">
    <!-- Back Button -->
    <NuxtLink
      to="/"
      class="inline-flex items-center mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
    >
      <svg
        class="h-5 w-5 mr-2"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back
    </NuxtLink>

    <!-- Session Tabs -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-3">Active Sessions</h2>
      <div class="flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="session in activeSessions"
          :key="session.id"
          @click="selectedSessionId = session.id"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition whitespace-nowrap',
            selectedSessionId === session.id
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ session.title }}
        </button>
        <div v-if="activeSessions.length === 0" class="text-gray-500 italic">
          No active sessions
        </div>
      </div>
    </div>

    <!-- Scanner -->
    <div class="scanner-container flex flex-col items-center justify-center mb-8">
      <h2 class="text-lg font-semibold mb-4">📸 QR Check-In</h2>
      <div class="w-full flex justify-center">
        <QrScanner @scan="handleScan" />
      <Shimmer width="10" height="10" rounded="md"/>

      </div>
      <p v-if="message" class="mt-1 text-indigo-700 font-medium">{{ message }}</p>
    </div>

    <!-- Attendance Table -->
    <div v-if="selectedSessionId" class="bg-white rounded-xl shadow p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Attendance Status</h2>
      <div v-if="loadingKids" class="text-center text-gray-500 py-8">Loading...</div>
      <div v-else-if="kids.length === 0" class="text-center text-gray-500 py-8">No kids registered</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-indigo-100">
              <th class="p-3 border-b text-left text-gray-700">Name</th>
              <th class="p-3 border-b text-center text-gray-700">Status</th>
              <th class="p-3 border-b text-center text-gray-700">Check-in Time</th>
              <th class="p-3 border-b text-center text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="kid in kids"
              :key="kid.id"
              :class="[
                'transition',
                attendanceMap[kid.id] ? 'bg-green-50' : 'bg-red-50'
              ]"
            >
              <td class="p-3 border-b">{{ kid.full_name }}</td>
              <td class="p-3 border-b text-center">
                <span
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-sm font-semibold',
                    attendanceMap[kid.id]
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  ]"
                >
                  {{ attendanceMap[kid.id] ? 'Present' : 'Absent' }}
                </span>
              </td>
              <td class="p-3 border-b text-center text-gray-600">
                {{ attendanceMap[kid.id] ? formatTime(attendanceMap[kid.id]) : '-' }}
              </td>
              <td class="p-3 border-b text-center">
                <button
                  v-if="!attendanceMap[kid.id]"
                  @click="manualCheckIn(kid.id, kid.full_name)"
                  :disabled="checkingIn"
                  class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark Present
                </button>
                <span v-else class="text-green-600 font-medium">✓ Checked in</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import QrScanner from '~/components/QrScanner.vue'
import type { Database } from '~/types/database'
// @ts-ignore
import confetti from 'canvas-confetti'
import CheckinModal from '~/components/modals/CheckinModal.vue'

const { showModal, hideModal } = useCommon()

const message = ref('')
const kidName = ref('')
const kidAvatar = ref('')

const countdown = ref(5)
const supabase = useSupabaseClient<Database>()

// Session management
const activeSessions = ref<any[]>([])
const selectedSessionId = ref<string | null>(null)

// Kids and attendance
const kids = ref<any[]>([])
const attendance = ref<any[]>([])
const loadingKids = ref(false)
const checkingIn = ref(false)

// Attendance map for quick lookup
const attendanceMap = computed(() => {
  const map: Record<string, string> = {}
  attendance.value.forEach((record) => {
    map[record.kid_id] = record.checkin_time
  })
  return map
})

async function handleScan(kidId: string) {
  // Use selected session
  if (!selectedSessionId.value) {
    message.value = 'No session selected.'
    return
  }

  const sessionId = selectedSessionId.value

  // Check if kid already checked in
  const { data: existing } = await supabase
    .from('attendance')
    .select('*')
    .eq('kid_id', kidId)
    .eq('session_id', sessionId)
    .maybeSingle()

  if (existing) {
    message.value = 'Already checked in.'
    return
  }

  // Get kid name
  const { data: kidData, error: notFound } = await supabase
    .from('kids')
    .select('full_name,avatar_url')
    .eq('id', kidId)
    .maybeSingle()
  
  if(notFound) {
    message.value = 'Kid not found.'
    return
  }

  // Save attendance
  const { error } = await supabase.from('attendance').insert([
    {
      kid_id: kidId,
      session_id: sessionId,
      checkin_time: new Date().toISOString()
    }
  ])

  if (error) {
    message.value = 'Error saving attendance.'
  } else {
    message.value = 'Check-in successful!'
    kidName.value = kidData?.full_name || 'Guest'
    kidAvatar.value = kidData?.avatar_url || '~/assets/avatar.jpg'
    showSuccessModal()
    // Refresh attendance data
    await fetchAttendance()
  }
}

function showSuccessModal() {
  countdown.value = 10
  showModal(CheckinModal, { kidAvatar, kidName, countdown })

  launchConfetti()

  // Countdown timer
  const timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      clearInterval(timer)
      hideModal()
    }
  }, 1000)
}

function launchConfetti() {
  const duration = 3000
  const end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

// Fetch active sessions
async function fetchActiveSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('is_open', true)
    .order('created_at', { ascending: false })

  if (!error && data) {
    activeSessions.value = data
    if (data.length > 0 && !selectedSessionId.value) {
      selectedSessionId.value = data[0].id
    }
  }
}

// Fetch all kids
async function fetchKids() {
  loadingKids.value = true
  const { data, error } = await supabase
    .from('kids')
    .select('*')
    .order('full_name', { ascending: true })

  if (!error && data) {
    kids.value = data
  }
  loadingKids.value = false
}

// Fetch attendance for selected session
async function fetchAttendance() {
  if (!selectedSessionId.value) {
    attendance.value = []
    return
  }

  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('session_id', selectedSessionId.value)

  if (!error && data) {
    attendance.value = data
  }
}

// Manual check-in function
async function manualCheckIn(kidId: string, fullName: string) {
  if (!selectedSessionId.value || checkingIn.value) return

  checkingIn.value = true

  try {
    // Check if already checked in
    const { data: existing } = await supabase
      .from('attendance')
      .select('*')
      .eq('kid_id', kidId)
      .eq('session_id', selectedSessionId.value)
      .maybeSingle()

    if (existing) {
      message.value = `${fullName} is already checked in.`
      return
    }

    // Get kid avatar
    const { data: kidData } = await supabase
      .from('kids')
      .select('avatar_url')
      .eq('id', kidId)
      .maybeSingle()

    // Insert attendance record
    const { error } = await supabase.from('attendance').insert([
      {
        kid_id: kidId,
        session_id: selectedSessionId.value,
        checkin_time: new Date().toISOString()
      }
    ])

    if (error) {
      message.value = `Error checking in ${fullName}.`
      console.error(error)
    } else {
      message.value = `${fullName} checked in successfully!`
      kidName.value = fullName
      kidAvatar.value = kidData?.avatar_url || '~/assets/avatar.jpg'
      showSuccessModal()
      // Refresh attendance data
      await fetchAttendance()
    }
  } finally {
    checkingIn.value = false
  }
}

// Format time for display
function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

// Watch for session changes
watch(selectedSessionId, () => {
  fetchAttendance()
})

// Initialize on mount
onMounted(async () => {
  await fetchActiveSessions()
  await fetchKids()
  await fetchAttendance()
})

// onMounted(() => showModal(CheckinModal, {kidAvatar: '~/assets/avatar.jpg', kidName, countdown}))
</script>

<style scoped>
.scanner-container {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
