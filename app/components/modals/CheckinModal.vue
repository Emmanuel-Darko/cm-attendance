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
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Check-In Successful!</h2>
            <p class="text-xs sm:text-sm text-gray-500">Welcome to today's session</p>
          </div>
        </template>
  
        <!-- Content -->
        <div class="rounded-lg w-full max-w-lg relative z-50">
          <div class="flex flex-col items-center text-center py-4 sm:py-6">
            <!-- Avatar with gradient border -->
            <div class="relative mb-4 sm:mb-6">
              <div class="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-75"></div>
              <NuxtImg
                :src="kidAvatar"
                alt="Kid Avatar"
                class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-xl"
                width="96"
                height="96"
                format="webp"
                quality="30"
              />
            </div>
            
            <!-- Welcome Message -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full border-2 border-green-100 mb-4 sm:mb-6">
              <p class="text-base sm:text-lg text-gray-700 mb-2">
                Welcome back,
              </p>
              <p class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {{ kidName }} 🎉
              </p>
            </div>
  
            <!-- Countdown Info -->
            <div class="flex items-center gap-2 text-gray-500">
              <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-xs sm:text-sm">Auto-closing in <span class="font-bold text-green-600">{{ countdown }}s</span></p>
            </div>
          </div>
        </div>
  
        <template #footer>
          <button
            @click="hideModal"
            class="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm sm:text-base"
          >
            Got it!
          </button>
        </template>
      </BaseModal>
    </transition>
  </template>
  
  <script setup lang="ts">
    const { hideModal } = useCommon()
    const props = defineProps<{
      kidAvatar: string,
      kidName: string,
      countdown: number
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
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 2s linear infinite;
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