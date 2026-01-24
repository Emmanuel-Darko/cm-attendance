<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl animate-blob"></div>
        <div class="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-300/15 to-indigo-300/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <!-- Hero Banner -->
        <section class="mb-12 sm:mb-16 md:mb-20">
          <ModernHeroBanner
            ctaText="Start Check-In"
            @cta="goCheckin"
          />
        </section>

        <!-- Feature Cards -->
        <section class="mb-12 sm:mb-16">
          <div class="text-center mb-8 sm:mb-12">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Everything You Need
            </h2>
            <p class="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools to manage your children's ministry with ease and joy
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <ModernFeatureCard
              v-for="(card, index) in cards"
              :key="card.title"
              :title="card.title"
              :description="card.description"
              :to="card.to"
              :accent="card.accent"
              :icon="card.icon"
              :delay="index * 100"
            />
          </div>
        </section>

        <!-- Stats Section -->
        <section class="mb-12 sm:mb-16">
          <div class="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 md:p-12">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div class="text-center transform hover:scale-105 transition-transform duration-300">
                <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mb-3 sm:mb-4 shadow-lg">
                  <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div class="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">500+</div>
                <div class="text-xs sm:text-sm text-gray-600 font-medium">Children Registered</div>
              </div>

              <div class="text-center transform hover:scale-105 transition-transform duration-300">
                <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-3 sm:mb-4 shadow-lg">
                  <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">98%</div>
                <div class="text-xs sm:text-sm text-gray-600 font-medium">Check-In Rate</div>
              </div>

              <div class="text-center transform hover:scale-105 transition-transform duration-300">
                <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl mb-3 sm:mb-4 shadow-lg">
                  <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-1">&lt;30s</div>
                <div class="text-xs sm:text-sm text-gray-600 font-medium">Avg Check-In Time</div>
              </div>

              <div class="text-center transform hover:scale-105 transition-transform duration-300">
                <div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl mb-3 sm:mb-4 shadow-lg">
                  <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-1">100%</div>
                <div class="text-xs sm:text-sm text-gray-600 font-medium">Happy Families</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Tagline Footer -->
        <footer class="text-center py-8">
          <div class="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-lg rounded-full border border-white/50 shadow-xl">
            <span class="text-2xl animate-pulse">✨</span>
            <p class="text-base sm:text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Together, we grow God's little stars
            </p>
            <span class="text-2xl animate-pulse animation-delay-1000">✨</span>
          </div>
        </footer>
      </div>
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
    title: 'QR Check-In', 
    description: 'Scan QR codes to mark attendance instantly', 
    icon: 'qr', 
    accent: 'from-indigo-500 to-indigo-600' 
  },
  { 
    to: '/sessions', 
    title: 'Sessions', 
    description: 'Create and manage attendance sessions', 
    icon: 'calendar', 
    accent: 'from-orange-500 to-orange-600' 
  },
  { 
    to: '/kids', 
    title: 'Kids Directory', 
    description: 'Manage children and generate QR codes', 
    icon: 'users', 
    accent: 'from-green-500 to-green-600' 
  },
  { 
    to: '/attendance', 
    title: 'Reports', 
    description: 'View and export attendance analytics', 
    icon: 'chart', 
    accent: 'from-purple-500 to-purple-600' 
  },
  { 
    to: '/announcements', 
    title: 'Announcements', 
    description: 'Share important messages with families', 
    icon: 'megaphone', 
    accent: 'from-yellow-500 to-yellow-600' 
  },
  { 
    to: '/settings', 
    title: 'Settings', 
    description: 'Configure and customize your system', 
    icon: 'settings', 
    accent: 'from-pink-500 to-pink-600' 
  }
]
</script>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>