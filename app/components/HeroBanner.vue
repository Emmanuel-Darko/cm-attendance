<template>
  <section
    class="relative w-full bg-gradient-to-tr from-indigo-700 via-blue-500 to-purple-400 overflow-hidden flex items-center justify-center px-1.5 sm:px-8 py-4 sm:py-14 rounded-xl sm:rounded-[2rem] shadow-2xl min-h-0"
    style="perspective: 1200px; border-radius: 1.25rem; box-shadow: 0 6px 32px 0 rgba(99,102,241,0.12), 0 2px 30px 0 rgba(198,238,255,0.12);"
  >
    <!-- Decorative blobs and shadow glass remain visible, not hidden -->
    <div class="absolute -top-10 -left-8 w-24 h-24 sm:w-80 sm:h-80 sm:-top-28 sm:-left-32 opacity-40 z-0 rounded-full"
      style="background: radial-gradient(circle at 40% 50%, #a5b4fc 73%, transparent 90%); filter: blur(16px) brightness(1.06);"></div>
    <div class="absolute -bottom-7 -right-8 w-28 h-28 sm:w-96 sm:h-96 sm:-bottom-20 sm:-right-32 opacity-20 z-0 rounded-full"
      style="background: radial-gradient(circle at 55% 70%, #7dd3fc 70%, transparent 98%); filter: blur(18px) brightness(1.07);"></div>
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none sm:block"
      style="width:340px;height:120px;box-shadow:0 18px 36px 0 rgba(91,129,255,0.19), 0 3px 36px 0 rgba(198,238,255,0.14);border-radius:36px;filter:blur(13px) brightness(1.03);z-index:1;backdrop-filter:blur(2.5px) saturate(1.15) contrast(1.01); background:rgba(255,255,255,0.10);"
    ></div>
    <div
      class="max-w-xl w-full z-10 relative flex flex-col items-center justify-center gap-4 text-center"
      style="border-radius: 1.3rem;"
    >
      <!-- Icon and text, only keep visible part -->
      <div class="flex items-center gap-1.5 sm:gap-3 justify-center mb-1" style="transform: translateZ(26px);">
        <span class="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-white via-blue-200 to-blue-100 shadow-3xl border border-indigo-200 p-2 sm:p-3 scale-95 sm:scale-100"
          style="box-shadow: 0 3.5px 16px 0 rgba(91,129,255,0.13), 0 2px 8px 0 rgba(156,163,255,0.08); border-radius: 50%;">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style="filter: drop-shadow(0 2px 8px #6366f140)">
            <ellipse cx="14" cy="11" rx="6.5" ry="6.6" fill="#fff" stroke="#6366f1" stroke-width="2"/>
            <ellipse cx="10.7" cy="12" rx="1.1" ry="1.0" fill="#6366f1"/>
            <ellipse cx="17.3" cy="12" rx="1.1" ry="1.0" fill="#6366f1"/>
            <ellipse cx="14" cy="15.2" rx="2.2" ry="0.85" fill="#e0e7ff" opacity="0.75"/>
            <path d="M7.8 21.1c1.2-3.1 10-3.2 11.4 0" stroke="#6366f1" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="text-sm sm:text-base text-indigo-50 font-semibold drop-shadow-sm leading-tight">
          Effortless Check-In
        </span>
      </div>
      <!-- Main Title -->
      <h1 class="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-[0_1.5px_12px_rgba(129,154,255,0.21)] rounded-xl px-3 py-0.5"
        style="text-shadow: 0 5px 17px #a5b4fc33, 0 1.2px 7px #6366f188; background: rgba(255,255,255,0.01);">
        Kids Check-In
      </h1>
      <!-- Only visible description, remove hidden/unused copy -->
      <p class="text-xs xs:text-sm sm:text-base md:text-lg text-white/80 mx-auto sm:max-w-xl font-medium mb-1.5 rounded-xl px-3 py-1 backdrop-blur-md bg-white/10"
         style="backdrop-filter: blur(2.5px) saturate(.98); border-radius:1rem;">
        Fast, secure &amp; happy church check-ins.
        <br class="sm:inline hidden" />Manage attendance with a tap. Enjoy the flow!
      </p>
      <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-5 w-full sm:w-auto justify-center mt-0.5 sm:mt-4"
           style="transform: translateZ(9px);">
        <button
          @click="$emit('cta')"
          class="flex items-center justify-center bg-gradient-to-tr from-blue-200 via-indigo-100 to-white text-indigo-800 font-extrabold rounded-full px-5 py-2.5 sm:px-8 sm:py-3 transition-all shadow-3xl focus:outline-none focus:ring-2 focus:ring-blue-200/60 active:scale-[.98] border border-white/60 hover:bg-white/95 hover:shadow-xl text-base sm:text-lg gap-1.5"
          style="box-shadow: 0 3px 16px 0 rgba(110,135,255,0.14), 0 1.5px 8px 0 rgba(162,176,255,0.12); border-radius: 999px;"
        >
          <span class="flex items-center justify-center bg-white/80 mr-1.5 rounded-full p-0.5 shadow"
                style="box-shadow: 0 1px 5px 0 rgba(67,56,202,0.045);">
            <svg class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 1px 2px #4338ca30)">
              <path
                d="M5 12h14M12 5l7 7-7 7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span>{{ ctaText }}</span>
        </button>
        <NuxtLink
          to="/sessions"
          class="flex items-center justify-center text-indigo-100 hover:text-white/100 underline underline-offset-4 transition text-sm font-medium px-3 sm:px-5 min-w-max drop-shadow-sm rounded-full py-1 border border-white/10 bg-white/0 hover:bg-white/10"
          style="border-radius:2em;"
        >
          <span class="flex items-center justify-center rounded-full bg-indigo-200/50 mr-1.5 p-0.5 shadow"
                style="box-shadow: 0 1px 4px #7dd3fc30;">
            <svg class="w-3 h-3 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2"/>
              <rect x="7" y="4" width="10" height="4" rx="1" stroke="currentColor"/>
            </svg>
          </span>
          Sessions
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  ctaText: { type: String, default: 'Start' },
});
</script>
