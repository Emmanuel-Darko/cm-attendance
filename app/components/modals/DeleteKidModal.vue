<template>
    <transition name="fade">
      <BaseModal @close="hideModal">
        <template #header>
          <div class="flex flex-col items-center text-center">
            <div class="relative mb-3 sm:mb-4">
              <div class="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div class="relative p-3 sm:p-4 bg-gradient-to-br from-red-400 to-red-500 rounded-full">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Delete Child</h2>
            <p class="text-xs sm:text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </template>
  
        <!-- Content -->
        <div class="rounded-lg w-full max-w-lg relative z-50">
          <div class="bg-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-red-100 text-center space-y-3">
            <div class="flex items-center justify-center gap-2 text-gray-700">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm sm:text-base font-medium">
                Are you sure you want to delete
              </p>
            </div>
            
            <p class="text-lg sm:text-xl font-bold text-red-600">
              {{ name }}?
            </p>
            
            <div class="bg-white rounded-lg p-3 sm:p-4 border border-red-200">
              <p class="text-xs sm:text-sm text-gray-600">
                <span class="font-semibold text-red-600">Warning:</span> All records, attendance history, and associated data will be permanently removed from the system.
              </p>
            </div>
          </div>
        </div>
  
        <template #footer>
          <div class="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              @click="hideModal"
              class="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all text-sm sm:text-base border-2 border-gray-200"
            >
              Cancel
            </button>
            <button
              @click="deleteKid(kidId)"
              :disabled="processing"
              class="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
            >
              <loaderIcon v-if="processing" />
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Yes, Delete
              </span>
            </button>
          </div>
        </template>
      </BaseModal>
    </transition>
  </template>
  
  <script setup lang="ts">
    const { hideModal } = useCommon()
    const { processing, deleteKid } = await useAttendance()
  
    const props = defineProps<{
      kidId: string,
      name: string
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