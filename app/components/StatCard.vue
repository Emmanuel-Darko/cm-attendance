<template>
  <div class="text-center transform hover:scale-105 transition-all duration-300 animate-fade-in-up" :style="{ animationDelay: `${delay}ms` }">
    <div 
      class="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl mb-3 shadow-lg group-hover:shadow-xl transition-all bg-gradient-to-br"
      :class="accent"
    >
      <div v-html="iconSvg" class="text-white"></div>
    </div>
    <div class="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-1" :class="gradientClass">
      {{ value }}
    </div>
    <div class="text-xs sm:text-sm text-gray-600 font-medium px-2">
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { getIcon } = useIcons()

const props = defineProps({
  value: { type: [String, Number], required: true },
  label: { type: String, required: true },
  icon: { type: String, required: true },
  accent: {
    type: String,
    default: 'from-indigo-500 to-indigo-600',
  },
  gradientClass: {
    type: String,
    default: 'from-indigo-600 to-purple-600'
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
  animation: fade-in-up 0.5s ease-out forwards;
  opacity: 0;
}
</style>