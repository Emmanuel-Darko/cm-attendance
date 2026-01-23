<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <!-- Header -->
      <div class="mb-4 sm:mb-6 md:mb-8">
        <NuxtLink to="/" class="group inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-gray-700 hover:text-indigo-600 border border-gray-100">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="font-medium text-sm sm:text-base">Back</span>
        </NuxtLink>
      </div>

      <!-- Page Title -->
      <div class="text-center mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Manage Sessions
        </h1>
        <p class="text-sm sm:text-base text-gray-600">Create and manage your church sessions</p>
      </div>

      <!-- Create Session Card -->
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-indigo-100/50 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
        <div class="flex items-center gap-3 mb-4 sm:mb-6">
          <div class="p-2 sm:p-2.5 bg-indigo-100 rounded-xl">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Create New Session</h2>
        </div>

        <form @submit.prevent="createSessionHandler" class="space-y-4 sm:space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <!-- Session Title -->
            <div class="space-y-2">
              <label for="session-title" class="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-semibold">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Session Title
                <span class="text-red-500">*</span>
              </label>
              <input
                id="session-title"
                v-model="title"
                placeholder="e.g. Sunday Service - August 10, 2025"
                class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            <!-- Session Date -->
            <div class="space-y-2">
              <label for="session-date" class="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-semibold">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date
                <span class="text-red-500">*</span>
              </label>
              <input
                id="session-date"
                v-model="date"
                type="date"
                class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div class="flex items-center gap-2 text-red-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm sm:text-base font-medium">{{ error }}</p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!title || !date || loading"
            class="w-full md:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-sm sm:text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            :class="[
              (!title || !date || loading)
                ? 'bg-gray-200 text-gray-400'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105'
            ]"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create Session
            </span>
          </button>
        </form>
      </div>

      <!-- Existing Sessions -->
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-indigo-100/50 p-4 sm:p-6 md:p-8">
        <div class="flex items-center gap-3 mb-4 sm:mb-6">
          <div class="p-2 sm:p-2.5 bg-purple-100 rounded-xl">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Existing Sessions</h3>
            <p class="text-xs sm:text-sm text-gray-500">{{ sessionsSorted.length }} total sessions</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="sessionsSorted.length === 0" class="py-12 sm:py-16 text-center">
          <div class="inline-flex p-4 bg-indigo-50 rounded-2xl mb-4">
            <svg class="w-12 h-12 sm:w-16 sm:h-16 text-indigo-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 48 48">
              <rect x="10" y="14" width="28" height="20" rx="4" stroke="currentColor" stroke-dasharray="4 2"/>
              <path d="M17 23h14M24 18v10" stroke="currentColor" stroke-linecap="round"/>
            </svg>
          </div>
          <p class="text-base sm:text-lg font-semibold text-gray-600 mb-1">No sessions yet</p>
          <p class="text-sm text-gray-400">Create your first session to get started</p>
        </div>

        <!-- Desktop Table -->
        <div v-else class="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
          <table class="w-full">
            <thead>
              <tr class="bg-gradient-to-r from-indigo-50 to-purple-50">
                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="session in sessionsSorted"
                :key="session.id"
                class="border-b border-gray-100 hover:bg-indigo-50 transition-all duration-200"
              >
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                      {{ session.title.charAt(0) }}
                    </div>
                    <span class="font-semibold text-gray-800">{{ session.title }}</span>
                  </div>
                </td>
                <td class="py-4 px-4 text-gray-600">{{ session.date }}</td>
                <td class="py-4 px-4 text-center">
                  <span
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                    :class="[
                      session.is_open
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    ]"
                  >
                    <span v-if="session.is_open">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span v-else>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    {{ session.is_open ? 'Open' : 'Closed' }}
                  </span>
                </td>
                <td class="py-4 px-4 text-center">
                  <button
                    v-if="session.is_open"
                    @click="closeSessionHandler(session.id)"
                    :disabled="loadingClose === session.id"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <svg v-if="loadingClose === session.id" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {{ loadingClose === session.id ? 'Closing...' : 'Close Session' }}
                  </button>
                  <span v-else class="text-gray-400 italic text-sm">Session Closed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div v-if="sessionsSorted.length > 0" class="md:hidden space-y-3">
          <div
            v-for="session in sessionsSorted"
            :key="session.id"
            class="rounded-xl p-4 border-2 transition-all duration-300"
            :class="[
              session.is_open
                ? 'bg-green-50/50 border-green-200'
                : 'bg-red-50/50 border-red-200'
            ]"
          >
            <div class="flex items-start gap-3 mb-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {{ session.title.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-800 text-base mb-1 truncate">{{ session.title }}</h3>
                <p class="text-sm text-gray-600 flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ session.date }}
                </p>
              </div>
              <span
                class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                :class="[
                  session.is_open
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                ]"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path v-if="session.is_open" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ session.is_open ? 'Open' : 'Closed' }}
              </span>
            </div>

            <div class="pt-3 border-t border-gray-200">
              <button
                v-if="session.is_open"
                @click="closeSessionHandler(session.id)"
                :disabled="loadingClose === session.id"
                class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="loadingClose === session.id" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {{ loadingClose === session.id ? 'Closing...' : 'Close Session' }}
              </button>
              <div v-else class="text-center text-gray-400 italic text-sm py-2">
                Session Closed
              </div>
            </div>
          </div>
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
    showModal(SuccessModal, {message: 'Session closed successfully.'})
  } catch (e) {
    error.value = e?.message || 'Failed to close session.'
  } finally {
    loadingClose.value = ''
  }
}

onMounted(fetchSessions)
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>