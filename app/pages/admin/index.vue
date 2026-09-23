<script setup lang="ts">
const { data: locals } = await useFetch('/api/admin/locals/list')
const { data: teachers } = await useFetch('/api/admin/teachers/list')
const { data: kids } = await useFetch('/api/admin/kids/adminList')
const { data: announcements } = await useFetch('/api/admin/announcements')

const cards = [
  {
    title: 'Locals',
    count: Array.isArray(locals.value) ? locals.value.length : 0,
    to: '/admin/locals',
    icon: 'building',
    accent: 'from-blue-500 to-blue-600',
    description: 'Manage church locations'
  },
  {
    title: 'Teachers',
    count: Array.isArray(teachers.value) ? teachers.value.length : 0,
    to: '/admin/teachers',
    icon: 'users',
    accent: 'from-green-500 to-green-600',
    description: 'Manage teacher accounts'
  },
  {
    title: 'Kids',
    count: Array.isArray(kids.value) ? kids.value.length : 0,
    to: '/admin/kids',
    icon: 'child',
    accent: 'from-purple-500 to-pink-600',
    description: 'Manage children records'
  },
  {
    title: 'Announcements',
    count: Array.isArray(announcements.value) ? announcements.value.length : 0,
    to: '/admin/announcements',
    icon: 'megaphone',
    accent: 'from-yellow-500 to-orange-600',
    description: 'Manage church news'
  }
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div class="mb-6 sm:mb-8">
        <NuxtLink to="/dashboard" class="group inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white/50 hover:bg-white">
          <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="font-semibold text-gray-700">Back to Dashboard</span>
        </NuxtLink>
      </div>

      <div class="text-center mb-8">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Admin Panel
        </h1>
        <p class="text-sm sm:text-base text-gray-600">Manage your church system settings</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <NuxtLink
          v-for="card in cards"
          :key="card.title"
          :to="card.to"
          class="group block"
        >
          <div class="relative h-full bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md border border-white/50 hover:shadow-xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" :class="card.accent"></div>
            <div class="relative z-10 flex items-center gap-4">
              <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl sm:rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transform transition-all duration-300 bg-gradient-to-br flex-shrink-0" :class="card.accent">
                <div class="text-white">
                  <svg v-if="card.icon === 'building'" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <svg v-else-if="card.icon === 'users'" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <svg v-else-if="card.icon === 'megaphone'" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-3xl font-bold text-gray-900">{{ card.count }}</p>
                <h3 class="text-base sm:text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{{ card.title }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">{{ card.description }}</p>
              </div>
              <svg class="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>