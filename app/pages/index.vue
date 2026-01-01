<template>
  <div class="min-h-screen bg-gradient-to-b from-[rgba(239,246,255,1)] to-[rgba(245,232,255,0.7)] flex flex-col">
    <div class="container mx-auto px-6 py-12">
      <!-- Header / Hero -->
      <HeroBanner
        title="Welcome to Children's Ministry Check-In"
        subtitle="Making check-in fun and easy for kids and parents!"
        ctaText="Start Check-In"
        @cta="goCheckin"
      />

      <!-- Cards -->
      <section class="mt-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AppHomeCard
            v-for="card in cards"
            :key="card.title"
            :title="card.title"
            :description="card.description"
            :to="card.to"
            :accent="card.accent"
            :icon="card.icon"
          />
        </div>
      </section>

      <!-- Tagline -->
      <footer class="mt-12 text-center">
        <p class="text-lg text-gray-700">✨ Together, we grow God’s little stars ✨</p>
      </footer>
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
  { to: '/checkin', title: 'QR Check-In', description: 'Scan QR codes to mark attendance', icon: 'qr', accent: 'bg-indigo-100 text-indigo-600' },
  { to: '/sessions', title: 'Sessions', description: 'Create and close attendance sessions', icon: 'calendar', accent: 'bg-orange-100 text-orange-600' },
  { to: '/kids', title: 'Kids', description: 'Manage kids and generate QR codes', icon: 'users', accent: 'bg-green-100 text-green-600' },
  { to: '/attendance', title: 'Reports', description: 'View and export attendance data', icon: 'chart', accent: 'bg-purple-100 text-purple-600' },
  { to: '/announcements', title: 'Announcements', description: 'Post messages for parents', icon: 'megaphone', accent: 'bg-yellow-100 text-yellow-600' },
  { to: '/settings', title: 'Settings', description: 'Configure the system', icon: 'settings', accent: 'rose' }
]
</script>

<style scoped>
/* small visual tweak so hero sits nicely on all screens */
.container { max-width: 1200px; }
</style>
