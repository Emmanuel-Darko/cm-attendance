<template>
  <section class="w-full px-3 py-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-400 shadow flex flex-col items-center justify-center gap-4 min-h-[110px]">
    <div class="flex items-center gap-2">
      <span class="inline-flex items-center justify-center rounded-full bg-white/80 border border-indigo-200 p-2 shadow-sm">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="9" r="3" stroke="#6366f1" stroke-width="1.4" />
          <path d="M5 20a7 7 0 0 1 14 0" stroke="#6366f1" stroke-width="1.4" stroke-linecap="round" />
        </svg>
      </span>
      <span class="text-sm text-white/90 font-medium">Try quick check-ins</span>
    </div>
    <h1 class="text-[1.5rem] sm:text-2xl font-bold text-white text-center leading-tight">
      Children’s Ministry Check-In
    </h1>
    <p class="text-sm text-indigo-100/90 text-center max-w-sm">
      Effortless check-in for kids & parents. Fast, simple & happy.
    </p>
    <div class="flex w-full gap-2 justify-center">
      <button
        @click="$emit('cta')"
        class="flex items-center justify-center bg-white/95 hover:bg-indigo-50 text-indigo-700 font-semibold rounded-full px-6 py-2 transition shadow w-full sm:w-auto text-base"
      >
        <svg class="w-4 h-4 mr-1 text-indigo-500" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M12 5l7 7-7 7"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ ctaText }}</span>
      </button>
      <NuxtLink
        to="/sessions"
        class="flex items-center text-indigo-100 hover:text-white underline underline-offset-2 transition text-sm font-medium px-2 min-w-max"
      >
        <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2"/>
          <rect x="7" y="4" width="10" height="4" rx="1" stroke="currentColor"/>
        </svg>
        Sessions
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  ctaText: { type: String, default: 'Start' },
});
</script>
