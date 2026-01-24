<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 mt-[55px]">
      <!-- Compact Hero Banner -->
      <HeroBanner @cta="goCheckin" />

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

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