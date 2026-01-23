<template>
    <transition name="fade">
      <BaseModal @close="hideModal">
        <template #header>
          <div class="flex flex-col items-center text-center">
            <div class="relative mb-3 sm:mb-4">
              <div class="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div class="relative p-3 sm:p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Success!
            </h2>
          </div>
        </template>
  
        <!-- Content -->
        <div class="rounded-lg w-full max-w-lg relative z-50">
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-green-100 text-center">
            <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
              {{ message }}
            </p>
          </div>
        </div>
  
        <template #footer>
          <button
            @click="hideModal"
            class="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm sm:text-base"
          >
            Okay
          </button>
        </template>
      </BaseModal>
    </transition>
  </template>
  
  <script setup lang="ts">
    const { hideModal } = useCommon()
    const props = defineProps<{
      message: string
    }>()
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  </style>