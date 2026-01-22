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

    <h3 class="text-xl font-semibold mb-4">Existing Sessions</h3>
    <div v-if="sessionsSorted.length === 0" class="text-gray-500 text-center py-12 rounded bg-white/80">
      <svg class="mx-auto h-10 w-10 mb-3 text-indigo-200" fill="none" stroke="currentColor" stroke-width="1.5"
        viewBox="0 0 48 48">
        <rect x="10" y="14" width="28" height="20" rx="4" stroke="currentColor" stroke-dasharray="4 2" />
        <path d="M17 23h14M24 18v10" stroke="currentColor" stroke-linecap="round" />
      </svg>
      No sessions found.
    </div>

    <!-- Session List for md and up (table style) -->
    <div class="hidden md:block">
      <table class="w-full border-collapse bg-white rounded shadow overflow-hidden">
        <thead>
          <tr class="bg-indigo-100">
            <th class="p-3 text-left text-gray-700 font-medium">Title</th>
            <th class="p-3 text-left text-gray-700 font-medium">Date</th>
            <th class="p-3 text-center text-gray-700 font-medium">Status</th>
            <th class="p-3 text-center text-gray-700 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in sessionsSorted" :key="session.id" class="transition border-b last:border-0 hover:bg-indigo-50">
            <td class="p-3 font-semibold text-gray-900">{{ session.title }}</td>
            <td class="p-3 text-gray-600">{{ session.date }}</td>
            <td class="p-3 text-center">
              <span :class="[
                'inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm font-medium',
                session.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              ]">
                <span>{{ session.is_open ? '✅ Open' : '❌ Closed' }}</span>
              </span>
            </td>
            <td class="p-3 text-center">
              <button
                v-if="session.is_open"
                @click="closeSessionHandler(session.id)"
                :disabled="loadingClose === session.id"
                class="inline-flex items-center px-4 py-1 bg-red-600 text-white rounded shadow font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="loadingClose === session.id" class="animate-spin mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ loadingClose === session.id ? 'Closing...' : 'Close' }}</span>
              </button>
              <span v-else class="text-gray-400 italic">Closed</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card list for mobile screens -->
    <div class="flex flex-col gap-3 md:hidden">
      <div
        v-for="session in sessionsSorted"
        :key="session.id"
        class="rounded-lg shadow px-4 py-3 flex flex-col transition border-t border-indigo-100 bg-blue-50"
      >
        <div class="flex items-center justify-between gap-2 mb-2">
          <div>
            <div class="text-base font-semibold text-gray-900">{{ session.title }}</div>
            <div class="text-sm text-gray-500">{{ session.date }}</div>
          </div>
          <span :class="[
            'px-2 py-0.5 rounded-full text-xs font-semibold min-w-[72px] text-center',
            session.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          ]">
            {{ session.is_open ? '✅ Open' : '❌ Closed' }}
          </span>
        </div>
        <div class="flex justify-end mt-1">
          <button
            v-if="session.is_open"
            @click="closeSessionHandler(session.id)"
            :disabled="loadingClose === session.id"
            class="flex items-center px-4 py-1 bg-red-600 text-white text-sm rounded shadow font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loadingClose === session.id" class="animate-spin mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ loadingClose === session.id ? 'Closing...' : 'Close' }}</span>
          </button>
          <span v-else class="text-gray-400 italic text-sm ml-2">Closed</span>
        </div>
      </div>
    </div>
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
  