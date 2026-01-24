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

        <!-- Sessions List (Desktop & Mobile) -->
        <div v-else class="space-y-3">
          <div
            v-for="session in sessionsSorted"
            :key="session.id"
            class="rounded-xl border-2 transition-all duration-300 overflow-hidden"
            :class="[
              session.is_open
                ? 'bg-green-50/50 border-green-200'
                : expandedSession === session.id 
                  ? 'bg-gray-50 border-indigo-300 shadow-lg' 
                  : 'bg-gray-50/50 border-gray-200 hover:border-gray-300'
            ]"
          >
            <!-- Main Card Content -->
            <div 
              class="p-4 cursor-pointer"
              :class="{ 'cursor-default': session.is_open }"
              @click="!session.is_open && toggleExpand(session.id)"
            >
              <div class="flex items-start gap-3">
                <!-- Avatar -->
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">
                  {{ session.title.charAt(0) }}
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div class="flex-1 min-w-0">
                      <h3 class="font-bold text-gray-800 text-sm sm:text-base truncate">{{ session.title }}</h3>
                      <p class="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 mt-0.5">
                        <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ session.date }}
                      </p>
                    </div>

                    <!-- Status Badge -->
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
                      <span class="hidden sm:inline">{{ session.is_open ? 'Open' : 'Closed' }}</span>
                    </span>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex flex-wrap gap-2 mt-3">
                    <button
                      v-if="session.is_open"
                      @click.stop="closeSessionHandler(session.id, session.title)"
                      :disabled="loadingClose === session.id"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      <svg v-if="loadingClose === session.id" class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span class="hidden xs:inline">{{ loadingClose === session.id ? 'Closing...' : 'Close Session' }}</span>
                      <span class="xs:hidden">{{ loadingClose === session.id ? 'Closing...' : 'Close' }}</span>
                    </button>

                    <button
                      v-if="!session.is_open"
                      @click.stop="toggleExpand(session.id)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg font-semibold text-xs sm:text-sm hover:bg-indigo-200 transition-all"
                    >
                      <svg 
                        class="w-3.5 h-3.5 transition-transform" 
                        :class="{ 'rotate-180': expandedSession === session.id }"
                        fill="none" 
                        stroke="currentColor" 
                        stroke-width="2" 
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                      <span>{{ expandedSession === session.id ? 'Hide' : 'Details' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Expanded Details (Only for closed sessions) -->
            <transition name="expand">
              <div v-if="!session.is_open && expandedSession === session.id" class="border-t border-gray-200 bg-white/50 p-4">
                <!-- Attendance Stats -->
                <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <!-- Present Kids -->
                  <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-green-200">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <div class="p-1.5 sm:p-2 bg-green-500 rounded-lg">
                          <svg class="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span class="text-xs sm:text-sm font-semibold text-green-800">Present</span>
                      </div>
                    </div>
                    <div class="text-2xl sm:text-3xl font-bold text-green-700">
                      {{ session.kidsPresent || 0 }}
                    </div>
                    <div class="text-xs text-green-600 mt-1">Children attended</div>
                  </div>

                  <!-- Absent Kids -->
                  <div class="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-red-200">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <div class="p-1.5 sm:p-2 bg-red-500 rounded-lg">
                          <svg class="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span class="text-xs sm:text-sm font-semibold text-red-800">Absent</span>
                      </div>
                    </div>
                    <div class="text-2xl sm:text-3xl font-bold text-red-700">
                      {{ session.kidsAbsent || 0 }}
                    </div>
                    <div class="text-xs text-red-600 mt-1">Children missed</div>
                  </div>
                </div>

                <!-- Session Details Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <!-- Sermon Recap -->
                  <div class="bg-white rounded-lg p-3 border border-gray-200">
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span class="text-xs sm:text-sm font-semibold text-gray-700">Sermon Recap</span>
                    </div>
                    <p class="text-xs sm:text-sm text-gray-600 line-clamp-3">
                      {{ session.recap || 'No sermon notes added' }}
                    </p>
                  </div>

                  <!-- Offertory -->
                  <div class="bg-white rounded-lg p-3 border border-gray-200">
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="text-xs sm:text-sm font-semibold text-gray-700">Offertory</span>
                    </div>
                    <p class="text-xs sm:text-sm text-gray-600">
                      {{ session.offertory ? `GH₵ ${parseFloat(session.offertory).toFixed(2)}` : 'Not recorded' }}
                    </p>
                  </div>

                  <!-- Teachers Present -->
                  <div class="bg-white rounded-lg p-3 border border-gray-200 sm:col-span-2 lg:col-span-1">
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span class="text-xs sm:text-sm font-semibold text-gray-700">Teachers Present</span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <template v-if="session.teachers && session.teachers.length > 0">
                        <span
                          v-for="teacher in session.teachers"
                          :key="teacher.id"
                          class="inline-flex items-center px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-medium border border-indigo-200"
                        >
                          <svg class="w-3.5 h-3.5 mr-1 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6a3 3 0 110 6 3 3 0 010-6zm0 8c-3.314 0-6 1.343-6 3v1h12v-1c0-1.657-2.686-3-6-3z" />
                          </svg>
                          {{ teacher.name }}
                        </span>
                      </template>
                      <span v-else class="text-xs sm:text-sm text-gray-400">No teachers recorded</span>
                    </div>
                  </div>
                </div>

                <!-- View Reports Button -->
                <NuxtLink
                  :to="`/attendance?session=${session.id}`"
                  class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:shadow-lg transition-all hover:scale-105"
                >
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Attendance Report
                </NuxtLink>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CloseSessionModal from '~/components/modals/CloseSessionModal.vue'
import SuccessModal from '~/components/modals/SuccessModal.vue'
import { useSessions } from '~/composables/useSessions'

const { title, date, sessions, fetchSessions, createSession, closeSession } = useSessions()
const { showModal } = useCommon()
const loading = ref(false)
const error = ref('')
const loadingClose = ref('')
const expandedSession = ref(null)

const sessionsSorted = computed(() =>
  [...sessions.value].sort((a, b) => {
    // Sort open sessions before closed
    if (a.is_open !== b.is_open) return a.is_open ? -1 : 1
    // If same status, sort by date desc
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
)

const toggleExpand = (sessionId) => {
  expandedSession.value = expandedSession.value === sessionId ? null : sessionId
}

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

async function closeSessionHandler(id, title) {
  showModal(CloseSessionModal, { sessionId: id, title, onSuccess: fetchSessions })
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

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}

@media (min-width: 380px) {
  .xs\:inline {
    display: inline;
  }
  .xs\:hidden {
    display: none;
  }
}
</style>