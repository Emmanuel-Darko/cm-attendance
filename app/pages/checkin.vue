<template>
  <div class="max-w-4xl mx-auto p-4">
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

    <!-- Scanner -->
    <div class="scanner-container flex flex-col items-center justify-center">
      <h2 class="text-lg font-semibold mb-4">📸 QR Check-In</h2>
      <div class="w-full flex justify-center">
        <QrScanner @scan="handleScan" />
      <Shimmer width="10" height="10" rounded="md"/>

      </div>
      <p v-if="message" class="mt-1 text-indigo-700 font-medium">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

async function handleScan(kidId: string) {
  // Get active session
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('*')
    .eq('is_open', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (sessionError || !session) {
    message.value = 'No active session found.'
    return
  }

  // Check if kid already checked in
  const { data: existing } = await supabase
    .from('attendance')
    .select('*')
    .eq('kid_id', kidId)
    .eq('session_id', session.id)
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
  }

  // Save attendance
  const { error } = await supabase.from('attendance').insert([
    {
      kid_id: kidId,
      session_id: session.id,
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
  const duration = 2000
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
