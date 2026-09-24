<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-100/90 via-indigo-50/40 to-slate-100/80 flex flex-col relative">

    <!-- Colored Header Band -->
    <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 pt-8 pb-16 sm:pt-10 sm:pb-20 relative overflow-hidden">
      <!-- Subtle circle decorations -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>

      <div class="relative z-10 max-w-xl mx-auto text-center">
        <!-- Logo -->
        <div class="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg border border-white/20">
          <img src="~/assets/images/logo.svg" alt="Logo" class="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
        </div>

        <h1 class="text-2xl sm:text-3xl font-bold text-white">Church Management</h1>
        <p class="mt-2 text-sm sm:text-base text-white/75">Welcome — choose a service to get started</p>

        <!-- Auth pill -->
        <div v-if="user" class="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm text-white/90 border border-white/20">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          {{ user.name || user.email?.split('@')[0] || 'Staff' }}
          <button @click="handleSignOut" class="text-white/60 hover:text-white text-xs underline ml-1 transition-colors">Sign out</button>
        </div>
      </div>
    </div>

    <!-- Cards Section (overlapping the header) -->
    <main class="flex-1 max-w-xl w-full mx-auto px-4 -mt-10 sm:-mt-12 relative z-20 pb-8">
      <div class="space-y-4">

        <!-- Kids Check-In -->
        <div
          @click="navigateToKidsCheckin"
          class="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
        >
          <div class="flex items-center gap-4 p-5">
            <div class="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-indigo-200">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <circle cx="9" cy="7" r="3" />
                <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke-linecap="round" />
                <circle cx="16" cy="8" r="2" />
                <path d="M19 21v-1.5a3 3 0 00-2.5-3" stroke-linecap="round" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-base sm:text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Kids Check-In</h2>
              <p class="text-sm text-gray-500 mt-0.5">Attendance, sessions & children's ministry</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span v-if="!user" class="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Login
              </span>
              <div class="w-8 h-8 rounded-full bg-indigo-50 group-hover:bg-indigo-600 flex items-center justify-center transition-all">
                <svg class="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Church Visitors (leads to /adult) -->
        <NuxtLink
          to="/adult"
          class="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden block transition-all duration-200 hover:-translate-y-0.5"
        >
          <div class="flex items-center gap-4 p-5">
            <div class="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-teal-200">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3M9 7a3 3 0 110 6 3 3 0 010-6zM4 20a5 5 0 0110 0" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-base sm:text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors">Church Visitors</h2>
              <p class="text-sm text-gray-500 mt-0.5">Register new guests & first-time visitors</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-teal-50 group-hover:bg-teal-600 flex items-center justify-center flex-shrink-0 transition-all">
              <svg class="w-4 h-4 text-teal-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </NuxtLink>

        <!-- Souls -->
        <NuxtLink
          to="/souls"
          class="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden block transition-all duration-200 hover:-translate-y-0.5"
        >
          <div class="flex items-center gap-4 p-5">
            <div class="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-amber-200">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-base sm:text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">Souls</h2>
              <p class="text-sm text-gray-500 mt-0.5">800k outreach tracking & field recording</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-orange-50 group-hover:bg-orange-600 flex items-center justify-center flex-shrink-0 transition-all">
              <svg class="w-4 h-4 text-orange-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </NuxtLink>

      </div>

      <!-- PWA Install -->
      <div v-if="isInstallable || (isIos && !hasInstalled)" class="mt-8 text-center">
        <button
          v-if="isInstallable"
          @click="install"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 16V4m0 12l-4-4m4 4l4-4M5 20h14" />
          </svg>
          Install App
        </button>

        <p v-if="isIos && !hasInstalled" class="text-xs text-gray-400 mt-3">
          📱 Tap <strong>Share</strong> → <strong>Add to Home Screen</strong>
        </p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-6 text-center">
      <p class="text-xs text-gray-400">
        &copy; {{ new Date().getFullYear() }}
        <span class="font-semibold text-gray-500">Church Management</span>
        &mdash; <span class="font-semibold text-gray-500">&lt;Kode/&gt;</span>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { usePWAInstall } from '~/composables/usePWAInstall'

definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Church Management'
})

const router = useRouter()
const { user, logout } = useAuth()
const { isIos, isInstallable, hasInstalled, install } = usePWAInstall()

function navigateToKidsCheckin() {
  if (user.value) {
    router.push('/dashboard')
  } else {
    router.push('/login?redirect=/dashboard')
  }
}

async function handleSignOut() {
  await logout()
}
</script>
