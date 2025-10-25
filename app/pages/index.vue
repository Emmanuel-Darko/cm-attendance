<!-- <template>
  <div
    class="min-h-screen py-10"
    style="
      background:
        linear-gradient(to bottom right, #eff6ff, #c7d2fe),
        url('https://raw.githubusercontent.com/Emmanuel-Darko/images/main/kids.webp') no-repeat center bottom;
      background-size: cover, 400px;
      background-blend-mode: lighten;
    "
  >
    <div class="max-w-4xl mx-auto p-10">
      <div class="text-center mb-10">
        <div class="flex justify-center mb-3">
          <span class="text-5xl">👩‍👧‍👦</span>
        </div>
        <h1 class="text-4xl font-extrabold text-indigo-700 mb-2 drop-shadow">
          CM Attendance System 📊
        </h1>
        <p class="text-lg text-gray-600 italic">
          Effortless attendance management for Children's Ministry
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <AppHomeCard
          v-for="card in appCards"
          :to="card.to"
          :icon="card.icon"
          :title="card.title"
          :description="card.description"
        />
      </div>

      <div class="flex justify-center mt-6">
        <NuxtLink
          to="/checkin"
          class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          🚀 Start Check-In
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const qrUrl = ref<string>('')

  const appCards = [
    {
      to:"/checkin",
      icon:"📷",
      title:"QR Check-In",
      description:"Scan QR codes to mark attendance"
    },
    {
      to:"/admin/kids",
      icon:"🔗",
      title:"Generate QR Code",
      description:"Create QR codes for attendance"
    },
    {
      to:"/admin/sessions",
      icon:"📅",
      title:"Manage Sessions",
      description:"Create and close attendance sessions"
    },
    {
      to:"/admin/attendance",
      icon:"📝",
      title:"Attendance Records",
      description:"View and export attendance data"
    },
  ]

  onMounted(async () => qrUrl.value = await useQrGenerator(location.href as string))
</script>  -->






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
  { to: '/admin/sessions', title: 'Sessions', description: 'Create and close attendance sessions', icon: 'calendar', accent: 'bg-orange-100 text-orange-600' },
  { to: '/admin/kids', title: 'Kids', description: 'Manage kids and generate QR codes', icon: 'users', accent: 'bg-green-100 text-green-600' },
  { to: '/admin/attendance', title: 'Reports', description: 'View and export attendance data', icon: 'chart', accent: 'bg-purple-100 text-purple-600' },
  { to: '/announcements', title: 'Announcements', description: 'Post messages for parents', icon: 'megaphone', accent: 'bg-yellow-100 text-yellow-600' },
  { to: '/settings', title: 'Settings', description: 'Configure the system', icon: 'settings', accent: 'rose' }
]
</script>

<style scoped>
/* small visual tweak so hero sits nicely on all screens */
.container { max-width: 1200px; }
</style>
