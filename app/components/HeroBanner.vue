<template>
  <section class="relative overflow-hidden">
    <div class="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-grid-pattern"></div>
      </div>

      <!-- Decorative Blobs -->
      <div class="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

      <!-- Content -->
      <div class="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Left: Icon & Text -->
          <div class="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <div class="relative">
                <div class="absolute inset-0 bg-white/20 rounded-xl blur-lg"></div>
                <div class="relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
                  <img src="~/assets/images/logo.svg" alt="Logo" class="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                </div>
              </div>
            </div>

            <!-- Text -->
            <div>
              <h1 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Kids Check-In
              </h1>
              <p class="text-xs sm:text-sm text-white/80 mt-0.5 sm:mt-1 font-medium">
                Fast, secure & joyful attendance
              </p>
            </div>
          </div>

          <!-- Right: CTA Button -->
          <div class="w-full sm:w-auto">
            <button
              @click="$emit('cta')"
              class="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-indigo-600 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span class="flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
                <svg class="w-3.5 h-3.5 text-indigo-600 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <span>Start Check-In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineEmits(['cta'])
</script>

<style scoped>
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}
</style>