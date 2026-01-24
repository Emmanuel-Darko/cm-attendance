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

      <!-- Loading State -->
      <div v-if="loading" class="text-center text-gray-500 py-12 sm:py-16 text-base sm:text-lg">
        <div class="inline-block w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
        <p>Loading attendance...</p>
      </div>
      <div v-else>
        <!-- No Sessions State -->
        <div v-if="activeSessions.length === 0" class="mt-6 sm:mt-10 flex justify-center items-center px-3">
          <NuxtLink
            to="/sessions"
            class="w-full sm:w-2/3 md:w-1/2 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] bg-white rounded-xl sm:rounded-2xl border-2 border-dashed border-indigo-200 py-8 sm:py-10 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-indigo-400"
          >
            <div class="p-3 sm:p-4 bg-indigo-50 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
              <svg class="w-12 h-12 sm:w-16 sm:h-16 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 48 48">
                <rect x="10" y="14" width="28" height="20" rx="4" stroke="currentColor" stroke-dasharray="4 2"/>
                <path d="M17 23h14M24 18v10" stroke="currentColor" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="text-lg sm:text-xl font-bold text-indigo-600 mb-1 sm:mb-2 px-4 text-center">No Sessions Available</div>
            <div class="text-gray-500 text-sm sm:text-base px-4 text-center">Click here to add your first session</div>
          </NuxtLink>
        </div>

        <!-- Sessions Available -->
        <div v-else>
          <!-- Session Selection -->
          <div class="mb-4 sm:mb-6 md:mb-8">
            <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-indigo-100/50 p-4 sm:p-5 md:p-6">
              <div class="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div class="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 class="text-base sm:text-lg md:text-xl font-bold text-gray-800">Select Session</h2>
              </div>
              
              <div class="flex flex-wrap gap-3 sm:gap-3">
                <button
                  v-for="session in activeSessions"
                  :key="session.id"
                  @click="selectSession(session.id)"
                  class="px-2.5 py-1.5 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full font-semibold transition-all duration-300 text-xs sm:text-base"
                  :class="[
                    selectedSessionId === session.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:scale-105'
                  ]"
                >
                  {{ session.title }}
                </button>
              </div>
            </div>
          </div>

          <!-- Stats Card -->
          <div v-if="selectedSessionId" class="mb-4 sm:mb-6 md:mb-8 hidden">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 text-white">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="text-center sm:text-left">
                  <p class="text-indigo-100 text-xs sm:text-sm font-medium mb-1">Attendance Summary</p>
                  <p class="text-2xl sm:text-3xl font-bold">{{ presentCount }} / {{ sortedKids.length }}</p>
                </div>
                <div class="flex justify-around sm:justify-end sm:gap-4 md:gap-6">
                  <div class="text-center">
                    <div class="text-xl sm:text-2xl font-bold">{{ presentCount }}</div>
                    <div class="text-indigo-100 text-xs sm:text-sm">Present</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl sm:text-2xl font-bold">{{ sortedKids.length - presentCount }}</div>
                    <div class="text-indigo-100 text-xs sm:text-sm">Absent</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl sm:text-2xl font-bold">{{ attendanceRate }}%</div>
                    <div class="text-indigo-100 text-xs sm:text-sm">Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab Navigation -->
          <div v-if="selectedSessionId" class="mb-4 sm:mb-6">
            <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-1.5 sm:p-2 inline-flex gap-1.5 sm:gap-2 w-full sm:w-auto">
              <button
                @click="checkinView = 'scanner'"
                class="flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm md:text-base flex-1 sm:flex-initial"
                :class="[
                  checkinView === 'scanner'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                ]"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span class="hidden xs:inline">QR Scanner</span>
                <span class="xs:hidden">Scanner</span>
              </button>
              <button
                @click="checkinView = 'manual'"
                class="flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm md:text-base flex-1 sm:flex-initial"
                :class="[
                  checkinView === 'manual'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                ]"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span class="hidden xs:inline">Manual Check-in</span>
                <span class="xs:hidden">Manual</span>
              </button>
            </div>
          </div>

          <!-- Message Display -->
          <transition name="fade-slide">
            <div v-if="message" class="mb-4 sm:mb-6">
              <div class="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-md">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-green-800 font-medium text-sm sm:text-base">{{ message }}</p>
              </div>
            </div>
          </transition>

          <!-- Content Area -->
          <div v-if="selectedSessionId" class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <!-- QR Scanner View -->
            <transition name="fade" mode="out-in">
              <div v-if="checkinView === 'scanner'" key="scanner" class="p-6 sm:p-8 md:p-12">
                <div class="max-w-md mx-auto text-center">
                  <div class="mb-4 sm:mb-6">
                    <div class="inline-flex p-3 sm:p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
                      <svg class="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 class="text-xl sm:text-2xl font-bold text-gray-800 mb-1.5 sm:mb-2">QR Code Check-In</h3>
                    <p class="text-gray-600 text-sm sm:text-base">Scan a QR code to check in attendees</p>
                  </div>

                  <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-4 sm:mb-6 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                    <div class="relative">
                      <QrScanner @scan="handleScan" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Manual Table View -->
              <div v-else-if="checkinView === 'manual'" key="manual" class="p-4 sm:p-5 md:p-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div class="flex items-center gap-2 sm:gap-3">
                    <div class="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h3 class="text-lg sm:text-xl font-bold text-gray-800">Attendance List</h3>
                  </div>
                  <!-- Modern Search Bar -->
                  <div class="w-full md:w-80 mt-2 md:mt-0">
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                        </svg>
                      </span>
                      <input
                        v-model="searchKey"
                        type="text"
                        autocomplete="off"
                        placeholder="Search attendees..."
                        class="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:border-indigo-400 focus:bg-white focus:outline-none text-sm sm:text-base transition-all placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div v-if="loadingKids" class="text-center text-gray-500 py-12 sm:py-20 text-base sm:text-lg">
                  <div class="inline-block w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
                  <p>Loading attendees...</p>
                </div>

                <div v-else-if="sortedKids.length === 0" class="text-center text-gray-400 py-12 sm:py-20 text-base sm:text-lg">
                  <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p class="font-medium">No attendees registered</p>
                </div>

                <!-- Desktop Table -->
                <div v-else class="hidden md:block overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b-2 border-gray-200">
                        <th class="text-left py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                        <th class="text-center py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th class="text-center py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                        <th class="text-center py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="kid in sortedKids"
                        :key="kid.id"
                        class="border-b border-gray-100 transition-all duration-300"
                        :class="[
                          attendanceMap[kid.id] ? 'bg-green-50/50 hover:bg-green-50' : 'hover:bg-gray-50'
                        ]"
                      >
                        <td class="py-3 sm:py-4 px-3 sm:px-4">
                          <div class="flex items-center gap-2 sm:gap-3">
                            <div
                              class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm"
                              :class="[
                                attendanceMap[kid.id] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              ]"
                            >
                              {{ kid.full_name.charAt(0) }}
                            </div>
                            <span class="font-medium text-gray-800 text-sm sm:text-base">{{ kid.full_name }}</span>
                          </div>
                        </td>
                        <td class="py-3 sm:py-4 px-3 sm:px-4 text-center">
                          <span
                            class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"
                            :class="[
                              attendanceMap[kid.id]
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            ]"
                          >
                            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path v-if="attendanceMap[kid.id]" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {{ attendanceMap[kid.id] ? 'Present' : 'Absent' }}
                          </span>
                        </td>
                        <td class="py-3 sm:py-4 px-3 sm:px-4 text-center">
                          <span class="inline-flex items-center gap-1.5 sm:gap-2 text-gray-600 text-xs sm:text-sm">
                            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {{ formatTime(attendanceMap[kid.id] || '') }}
                          </span>
                        </td>
                        <td class="py-3 sm:py-4 px-3 sm:px-4 text-center">
                          <button
                            v-if="!attendanceMap[kid.id]"
                            @click="manualCheckIn(kid.id, kid.full_name)"
                            :disabled="checkingIn"
                            class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                          >
                            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Check In
                          </button>
                          <button
                            v-else
                            @click="removeAttendance(kid.id)"
                            :disabled="checkingIn"
                            class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                          >
                            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Remove
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Mobile Cards -->
                <div v-if="!loadingKids && sortedKids.length > 0" class="md:hidden space-y-2.5 sm:space-y-3">
                  <div
                    v-for="kid in sortedKids"
                    :key="kid.id"
                    class="rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 transition-all duration-300"
                    :class="[
                      attendanceMap[kid.id]
                        ? 'bg-green-50/50 border-green-200'
                        : 'bg-white border-gray-200'
                    ]"
                  >
                    <div class="flex items-center justify-between mb-2.5 sm:mb-3">
                      <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div
                          class="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm flex-shrink-0"
                          :class="[
                            attendanceMap[kid.id] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          ]"
                        >
                          {{ kid.full_name.charAt(0) }}
                        </div>
                        <span class="font-semibold text-gray-800 text-sm sm:text-base truncate">{{ kid.full_name }}</span>
                      </div>
                      <span
                        class="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2"
                        :class="[
                          attendanceMap[kid.id]
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        ]"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path v-if="attendanceMap[kid.id]" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="hidden xs:inline">{{ attendanceMap[kid.id] ? 'Present' : 'Absent' }}</span>
                      </span>
                    </div>
                    
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2 flex-1">
                        <span
                          class="inline-flex items-center gap-1.5 text-gray-600 text-xs sm:text-sm"
                        >
                          <svg v-if="attendanceMap[kid.id]" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <svg v-else class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <!-- Placeholder clock for absent -->
                            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v5l3 3" />
                          </svg>
                          <span>
                            {{ attendanceMap[kid.id] ? formatTime(attendanceMap[kid.id] || "") : '--:--' }}
                          </span>
                        </span>
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          v-if="!attendanceMap[kid.id]"
                          @click="manualCheckIn(kid.id, kid.full_name)"
                          :disabled="checkingIn"
                          class="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg font-semibold shadow-md text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span class="hidden xs:inline">Check In</span>
                          <span class="xs:hidden">In</span>
                        </button>
                        <button
                          v-else
                          @click="removeAttendance(kid.id)"
                          :disabled="checkingIn"
                          class="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg font-semibold shadow-md text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
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
  loading,
  searchKey,
  handleScan,
  manualCheckIn,
  removeAttendance
} = useCheckin()

const checkinView = ref<'scanner'|'manual'>('scanner')

const selectSession = (sessionId: string) => {
  selectedSessionId.value = sessionId
  message.value = ''
}

const formatTime = (timestamp: string) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const presentCount = computed(() => {
  return Object.keys(attendanceMap.value).length
})

const attendanceRate = computed(() => {
  if (sortedKids.value.length === 0) return 0
  return Math.round((presentCount.value / sortedKids.value.length) * 100)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Extra small breakpoint for text truncation */
@media (min-width: 380px) {
  .xs\:inline {
    display: inline;
  }
  .xs\:hidden {
    display: none;
  }
}
</style>