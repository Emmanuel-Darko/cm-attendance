<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <!-- Compact Hero Banner -->
      <HeroBanner @cta="goCheckin" class="mt-[55px]" />

      <!-- Quick Actions Grid -->
      <section class="mt-6 sm:mt-8">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <AppHomeCard
            v-for="(card, index) in cards"
            :key="card.title"
            :title="card.title"
            :to="card.to"
            :icon="card.icon"
            :accent="card.accent"
            :delay="index * 50"
          />
        </div>
      </section>

      <div class="flex flex-col items-center my-20 gap-4">
        <!-- Android PWA install -->
        <button
          v-if="isInstallable"
          @click="install"
          class="relative flex items-center justify-center px-10 py-3 font-semibold rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg text-white transition-all hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <svg
            class="w-6 h-6 mr-3 relative z-10"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 16V4m0 12l-4-4m4 4l4-4M5 20h14"
            />
          </svg>
          <span class="relative z-10">Install App</span>
        </button>

        <!-- iOS Add to Home Screen instructions, hidden after installed -->
        <div
          v-if="isIos && !hasInstalled"
          class="text-sm text-gray-600 text-center"
        >
          📱 To install:<br />
          Tap <strong>Share</strong> → <strong>Add to Home Screen</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { usePWAInstall } from '~/composables/usePWAInstall'

const router = useRouter()
const { isIos, isInstallable, hasInstalled, install } = usePWAInstall()

function goCheckin() {
  router.push('/checkin')
}

const cards = [
  { 
    to: '/checkin', 
    title: 'Check-In', 
    icon: 'qr', 
    accent: 'from-indigo-500 to-indigo-600' 
  },
  { 
    to: '/sessions', 
    title: 'Sessions', 
    icon: 'calendar', 
    accent: 'from-orange-500 to-orange-600' 
  },
  { 
    to: '/kids', 
    title: 'Kids', 
    icon: 'users', 
    accent: 'from-green-500 to-green-600' 
  },
  { 
    to: '/attendance', 
    title: 'Reports', 
    icon: 'chart', 
    accent: 'from-purple-500 to-purple-600' 
  },
  { 
    to: '/announcements', 
    title: 'News', 
    icon: 'megaphone', 
    accent: 'from-yellow-500 to-yellow-600' 
  },
  { 
    to: '/settings', 
    title: 'Settings', 
    icon: 'settings', 
    accent: 'from-pink-500 to-pink-600' 
  }
]
</script>