<template>
  <NuxtLink 
    :to="to" 
    class="group block animate-fade-in-up"
    :style="{ animationDelay: `${delay}ms` }"
  >
    <div class="relative h-full bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md border border-white/50 hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 overflow-hidden">
      <!-- Hover Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" :class="`bg-gradient-to-br ${accent}`"></div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col items-center text-center">
        <!-- Icon -->
        <div 
          class="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transform transition-all duration-300 bg-gradient-to-br mb-3"
          :class="accent"
        >
          <div v-html="iconSvg" class="text-white"></div>
        </div>

        <!-- Title -->
        <h3 class="text-sm sm:text-base font-bold text-gray-800 group-hover:text-indigo-600 transition-colors leading-tight">
          {{ title }}
        </h3>

        <!-- Arrow Indicator (Desktop only) -->
        <div class="hidden sm:flex mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg class="w-4 h-4 text-indigo-600 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>

      <!-- Shine Effect -->
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { getIcon } = useIcons()

const props = defineProps({
  title: { type: String, required: true },
  to: { type: String, required: true },
  icon: { type: String, required: true },
  accent: {
    type: String,
    default: 'from-indigo-500 to-indigo-600',
  },
  delay: {
    type: Number,
    default: 0
  }
})

const iconSvg = computed(() => getIcon(props.icon))
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out forwards;
  opacity: 0;
}
</style>