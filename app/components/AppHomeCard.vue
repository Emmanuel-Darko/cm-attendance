<template>
  <NuxtLink :to="to" class="group block">
    <div
      class="relative rounded-2xl p-6 shadow-lg border border-transparent hover:shadow-2xl transform hover:-translate-y-1 transition"
      style="background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95))"
    >
      <div class="flex items-center gap-4">
        <!-- Icon -->
        <div
          class="w-16 h-16 rounded-xl flex items-center justify-center shadow-md ring-4 ring-white transition"
          :class="[accent]"
          v-html="iconSvg"
        ></div>


        <!-- Title + Description -->
        <div>
          <h3 class="text-lg font-bold text-slate-800">{{ title }}</h3>
          <p class="text-sm text-slate-500 mt-1">{{ description }}</p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const icons: Record<string, string> = {
  qr: `
    <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 text-slate-700">
      <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
      <rect x="15" y="3" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
      <rect x="3" y="15" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
      <path d="M9 15h6v6H9z" stroke="currentColor" stroke-width="1.5"/>
    </svg>
  `,
  calendar: `
    <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 text-slate-700">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M16 3v4M8 3v4" stroke="currentColor" stroke-width="1.5"/>
    </svg>
  `,
  users: `
    <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 text-slate-700">
      <path d="M17 21v-2a3 3 0 00-3-3H10a3 3 0 00-3 3v2" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="9" cy="7" r="3" stroke="currentColor" stroke-width="1.5"/>
      <path d="M20 8a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" stroke-width="1.5"/>
    </svg>
  `,
  chart: `
    <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 text-slate-700">
      <path d="M3 3v18h18" stroke="currentColor" stroke-width="1.5"/>
      <rect x="7" y="12" width="2" height="6" fill="currentColor"/>
      <rect x="11" y="8" width="2" height="10" fill="currentColor"/>
      <rect x="15" y="4" width="2" height="14" fill="currentColor"/>
    </svg>
  `,
  megaphone: `
    <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 text-slate-700">
      <path d="M3 11v2l9 4V7L3 11z" stroke="currentColor" stroke-width="1.5"/>
      <path d="M16 12h2a2 2 0 012 2v0a2 2 0 01-2 2h-2" stroke="currentColor" stroke-width="1.5"/>
    </svg>
  `,
  settings: `
    <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 text-slate-700">
      <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="currentColor" stroke-width="1.5"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 114.26 18.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L3.21 6.1a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09c0 .62.39 1.2 1 1.51h2.06a1.65 1.65 0 001.82-.33l.06-.06A2 2 0 1119.74 5.1l-.06.06a1.65 1.65 0 00-.33 1.82V9c.62 0 1.2.39 1.51 1h.09a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="1.1"/>
    </svg>
  `,
}

const props = defineProps({
  title: String,
  description: String,
  to: String,
  icon: String,
  accent: {
    type: String,
    default: 'bg-indigo-100 text-indigo-600',
  },
})

const iconSvg = computed(() => {
  // fallback if props.icon is undefined, null, or key doesn't exist
  if (props.icon && Object.prototype.hasOwnProperty.call(icons, props.icon)) {
    return icons[props.icon]
  }
  return icons.qr
})
</script>

