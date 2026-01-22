<template>
  <div class="max-w-6xl mx-auto p-4">
    <!-- Back Button -->
    <NuxtLink to="/"
      class="inline-flex items-center mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </NuxtLink>

    <!-- Session Tabs -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-3">Check-in</h2>
      <div v-if="activeSessions.length === 0" class="mt-20 flex justify-center items-center">
        <NuxtLink
          to="/sessions"
          class="w-full md:w-1/2 flex flex-col items-center justify-center min-h-[120px] bg-white/90 rounded-xl border border-dashed border-indigo-200 py-8 shadow-inner"
        >
          <svg class="w-14 h-14 text-indigo-200 mb-4" fill="none" stroke="currentColor" stroke-width="1.5"
            viewBox="0 0 48 48">
            <rect x="10" y="14" width="28" height="20" rx="4" stroke="currentColor" stroke-dasharray="4 2" />
            <path d="M17 23h14M24 18v10" stroke="currentColor" stroke-linecap="round" />
          </svg>
          <div class="text-lg font-semibold text-indigo-500 mb-1">No session available</div>
          <div class="text-gray-500 text-base">Add a session to begin tracking</div>
        </NuxtLink>
      </div>

      <div v-else>
        <div class="flex gap-2 overflow-x-auto pb-2">
          <button v-for="session in activeSessions" :key="session.id" @click="selectSession(session.id)" :class="[
            'px-4 py-2 rounded-lg font-medium transition whitespace-nowrap',
            selectedSessionId === session.id
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]">
            {{ session.title }}
          </button>
        </div>

        <!-- Scanner -->
        <div class="scanner-container flex flex-col items-center justify-center mb-8">
          <h2 class="text-lg font-semibold mb-4">📸 QR Check-In</h2>
          <div class="w-full flex justify-center">
            <QrScanner @scan="handleScan" />
          </div>
          <p v-if="message" class="mt-1 text-indigo-700 font-medium">{{ message }}</p>
        </div>

        <!-- Attendance Table -->
        <div v-if="selectedSessionId" class="bg-white rounded-xl shadow p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Attendance Status</h2>
          <div v-if="loadingKids" class="text-center text-gray-500 py-8">Loading...</div>
          <div v-else-if="sortedKids.length === 0" class="text-center text-gray-500 py-8">No kids registered</div>
          <div v-else class="overflow-x-auto">
            <div class="w-full">
              <!-- Responsive Table for md+ screens -->
              <table class="w-full border-collapse hidden md:table">
                <thead>
                  <tr class="bg-indigo-100">
                    <th class="p-3 border-b text-left text-gray-700">Name</th>
                    <th class="p-3 border-b text-center text-gray-700">Status</th>
                    <th class="p-3 border-b text-center text-gray-700">Check-in Time</th>
                    <th class="p-3 border-b text-center text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="kid in sortedKids" :key="kid.id" :class="[
                    'transition',
                    attendanceMap[kid.id] ? 'bg-green-50' : 'bg-red-50'
                  ]">
                    <td class="p-3 border-b">{{ kid.full_name }}</td>
                    <td class="p-3 border-b text-center">
                      <span :class="[
                        'inline-block px-3 py-1 rounded-full text-sm font-semibold',
                        attendanceMap[kid.id]
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      ]">
                        {{ attendanceMap[kid.id] ? 'Present' : 'Absent' }}
                      </span>
                    </td>
                    <td class="p-3 border-b text-center text-gray-600">
                      {{ attendanceMap[kid.id] ? formatTime(attendanceMap[kid.id] || '') : '-' }}
                    </td>
                    <td class="p-3 border-b text-center">
                      <button v-if="!attendanceMap[kid.id]" @click="manualCheckIn(kid.id, kid.full_name)"
                        :disabled="checkingIn"
                        class="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-full shadow hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg class="w-4 h-4 mr-1 -ml-1" fill="none" stroke="currentColor" stroke-width="2"
                          viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Mark Present
                      </button>
                      <button v-else title="Remove" @click="removeAttendance(kid.id)" :disabled="checkingIn"
                        class="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M6 18L18 6" />
                        </svg>
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Card List for mobile screens -->
              <div class="flex flex-col gap-3 md:hidden">
                <div v-for="kid in sortedKids" :key="kid.id" :class="[
                  'rounded-lg shadow px-4 py-3 flex flex-col transition',
                  attendanceMap[kid.id] ? 'bg-green-50' : 'bg-red-50'
                ]">
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <div class="font-semibold text-gray-900 text-base">{{ kid.full_name }}</div>
                    <span :class="[
                      'px-2 py-0.5 rounded-full text-xs font-semibold',
                      attendanceMap[kid.id]
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    ]">
                      {{ attendanceMap[kid.id] ? 'Present' : 'Absent' }}
                    </span>
                  </div>
                  <div class="flex gap-2 mt-1">
                    <div
                      class="flex items-center text-xs text-gray-600 min-w-[90px] justify-center bg-gray-100 rounded px-2 py-1 mr-2">
                      <span v-if="attendanceMap[kid.id]">{{ formatTime(attendanceMap[kid.id] || '') }}</span>
                      <span v-else>-</span>
                    </div>
                    <button v-if="!attendanceMap[kid.id]" @click="manualCheckIn(kid.id, kid.full_name)"
                      :disabled="checkingIn"
                      class="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[90px] ml-auto">
                      Mark Present
                    </button>
                    <button v-else title="Remove" @click="removeAttendance(kid.id)" :disabled="checkingIn"
                      class="flex items-center justify-center px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow font-semibold min-w-[90px] ml-auto">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M6 18L18 6" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  message,
  activeSessions,
  selectedSessionId,
  sortedKids,
  loadingKids,
  checkingIn,
  attendanceMap,
  handleScan,
  manualCheckIn,
  removeAttendance
} = useCheckin()

const selectSession = (sessionId: string) => {
  selectedSessionId.value = sessionId
  message.value = ''
}
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
