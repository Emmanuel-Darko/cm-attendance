<template>
  <div class="max-w-4xl mx-auto p-4">
    <NuxtLink to="/" class="inline-flex items-center mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
      Back
    </NuxtLink>
    <h2 class="text-2xl font-bold mb-4">Create New Session</h2>
    <form @submit.prevent="createSessionHandler" class="flex flex-col gap-3 mb-8 bg-white p-4 rounded shadow">
      <label class="font-medium">Session Title
        <input v-model="title" placeholder="e.g. Sunday 10th August, 2025" class="mt-1 w-full px-3 py-2 border rounded" />
      </label>
      <label class="font-medium">Date
        <input v-model="date" type="date" class="mt-1 w-full px-3 py-2 border rounded" />
      </label>
      <button :disabled="!title || !date || loading" class="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50">
        {{ loading ? 'Creating...' : 'Create' }}
      </button>
      <div v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</div>
    </form>

    <h3 class="text-xl font-semibold mb-2">Existing Sessions</h3>
    <div v-if="sessionsSorted.length === 0" class="text-gray-500 text-center py-8">No sessions found.</div>
    <ul class="space-y-3">
      <li v-for="session in sessionsSorted" :key="session.id" class="flex items-center justify-between bg-gray-50 p-3 rounded shadow-sm">
        <div>
          <span class="font-medium">{{ session.title }}</span>
          <span class="ml-2 text-gray-500">({{ session.date }})</span>
          <span :class="session.is_open ? 'text-green-600 ml-2' : 'text-red-600 ml-2'">
            {{ session.is_open ? '✅ Open' : '❌ Closed' }}
          </span>
        </div>
        <button v-if="session.is_open" @click="closeSessionHandler(session.id)" :disabled="loadingClose === session.id" class="ml-4 px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50">
          {{ loadingClose === session.id ? 'Closing...' : 'Close' }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SuccessModal from '~/components/modals/SuccessModal.vue'
import { useSessions } from '~/composables/useSessions'

const { title, date, sessions, fetchSessions, createSession, closeSession } = await useSessions()
const { showModal } = useCommon()
const loading = ref(false)
const error = ref('')
const loadingClose = ref('')

const sessionsSorted = computed(() =>
  [...sessions.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)

async function createSessionHandler() {
  error.value = ''
  loading.value = true
  try {
    await createSession()
    await fetchSessions()
    showModal(SuccessModal, {message: 'Session created successfully.'})
  } catch (e) {
    error.value = e?.message || 'Failed to create session.'
  } finally {
    loading.value = false
  }
}

async function closeSessionHandler(id) {
  loadingClose.value = id
  error.value = ''
  try {
    await closeSession(id)
    await fetchSessions()
    showModal(SuccessModal, {message: 'Session closed successfuly.'})
  } catch (e) {
    error.value = e?.message || 'Failed to close session.'
  } finally {
    loadingClose.value = ''
  }
}

onMounted(fetchSessions)
</script>

<style scoped>
  input[type="date"]::-webkit-input-placeholder { color: #aaa; }
  input[type="date"]::-moz-placeholder { color: #aaa; }
  input[type="date"]:-ms-input-placeholder { color: #aaa; }
  input[type="date"]::placeholder { color: #aaa; }
</style>
  