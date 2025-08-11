<template>
  <div class="max-w-4xl mx-auto p-4">
    <NuxtLink to="/" class="inline-flex items-center mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
      Back
    </NuxtLink>
    <div
      class="scanner-container flex flex-col items-center justify-center"
    >
      <h2>📸 QR Check-In</h2>
      <div class="w-full flex justify-center">
        <QrScanner @scan="handleScan" />
      </div>
      <p v-if="log">{{ log }}</p>
      <p v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import QrScanner from '~/components/QrScanner.vue'
  import type { Database } from '~/types/database'

  const log = ref('')
  const message = ref('')
  const success = ref(false)
  const supabase = useSupabaseClient<Database>()

  async function handleScan(kidId: string) {
    log.value = `Scanned: ${kidId}`

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
      success.value = true
    }
  }
</script>

<style scoped>
  .scanner-container {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
  }
</style>