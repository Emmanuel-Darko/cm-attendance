<template>
  <div
    class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left"
  >
    <!-- Text Section -->
    <div class="flex-1 order-2 lg:order-1">
      <div class="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-2 mb-3">
        <div class="rounded-full bg-indigo-100 p-3 shadow flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" class="text-indigo-700">
            <path
              d="M12 12a3 3 0 100-6 3 3 0 000 6zM4 20a4 4 0 018 0"
              stroke="#5b21b6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M20 20a3 3 0 00-3-3h-1"
              stroke="#5b21b6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <h1
          class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-indigo-700 leading-tight"
        >
          Welcome to
          <span class="block">Children’s Ministry Check-In</span>
        </h1>
      </div>

      <p class="text-gray-600 mt-2 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg">
        Making check-in fun and easy for kids and parents — quick QR scanning, simple session management and friendly reports.
      </p>

      <div class="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
        <button
          @click="$emit('cta')"
          class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-md transition w-full sm:w-auto"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="font-semibold">{{ ctaText }}</span>
        </button>
        <NuxtLink
          to="/admin/sessions"
          class="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Manage Sessions
        </NuxtLink>
      </div>
    </div>

    <!-- Illustration -->
    <div class="order-1 lg:order-2 w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 mb-4 lg:mb-0">
      <img
        src="../assets/kids-ballon.png"
        alt="Kids illustration"
        class="w-full h-full object-contain"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  ctaText: { type: String, default: 'Start' },
});
</script>
