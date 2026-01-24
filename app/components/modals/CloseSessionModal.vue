<template>
  <transition name="fade">
    <BaseModal @close="closeModal" :clickOutside="false">
      <template #header>
        <div class="flex flex-col items-center text-center mb-2">
          <div class="relative mb-3 sm:mb-4">
            <div class="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div class="relative p-3 sm:p-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Close Session</h2>
          <p class="text-sm sm:text-base text-gray-600 font-medium">{{ title }}</p>
        </div>
      </template>

      <!-- Content -->
      <div class="space-y-4 sm:space-y-5 py-2">
        <!-- Sermon Recap -->
        <div class="space-y-2">
          <label for="recap" class="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Sermon Recap
            <span class="text-gray-400 text-xs font-normal">(Optional)</span>
          </label>
          <textarea
            id="recap"
            v-model="recap"
            placeholder="Brief summary of today's lesson or sermon..."
            class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base resize-none"
            rows="4"
            :disabled="loading"
          />
        </div>

        <!-- Offertory -->
        <div class="space-y-2">
          <label for="offertory" class="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Offertory Amount
            <span class="text-gray-400 text-xs font-normal">(Optional)</span>
          </label>
          <div class="relative">
            <span class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">GH₵</span>
            <input
              id="offertory"
              v-model="offertory"
              type="number"
              placeholder="0.00"
              class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl pl-12 sm:pl-14 pr-3 sm:pr-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
              min="0"
              step="0.01"
              :disabled="loading"
            />
          </div>
        </div>

        <!-- Teachers Present -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Teachers Present
            <span class="text-red-500">*</span>
          </label>

          <div v-if="teachers && teachers.length" class="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-gray-200">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="teacher in teachers"
                :key="teacher.id"
                type="button"
                @click="toggleTeacher(teacher.id)"
                class="inline-flex items-center gap-1.5 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border-2 font-semibold text-xs sm:text-sm transition-all"
                :class="selected.includes(teacher.id)
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'"
                :disabled="loading"
              >
                <svg 
                  v-if="selected.includes(teacher.id)"
                  class="w-3 h-3 sm:w-4 sm:h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2.5" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {{ teacher.name }}
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-3">
              {{ selected.length }} teacher{{ selected.length !== 1 ? 's' : '' }} selected
            </p>
          </div>

          <div v-else class="bg-yellow-50 border-2 border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-2">
            <svg class="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="text-sm font-semibold text-yellow-800">No Teachers Found</p>
              <p class="text-xs text-yellow-700 mt-1">Please add teachers to your system first.</p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-shake">
          <div class="flex items-center gap-2 text-red-700">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm font-medium">{{ error }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            @click="closeModal"
            :disabled="loading"
            class="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all text-sm sm:text-base border-2 border-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="close"
            :disabled="loading || selected.length === 0"
            class="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Closing...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Close Session
            </span>
          </button>
        </div>
      </template>
    </BaseModal>
  </transition>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{ sessionId: string, title: string, onSuccess?: Function }>()
const { hideModal } = useCommon()
const { recap, offertory, selected, loading, closeSession } = useSessions()

const error = ref('')

const { data: teachers } = await useFetch('/api/admin/teachers/local', {
  method: 'POST',
  body: {
    local_id: useAuth().user.value.local_id
  }
})

function toggleTeacher(id: string) {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter(t => t !== id)
  } else {
    selected.value = [...selected.value, id]
  }
}

function closeModal() {
  hideModal()
  // Reset form
  recap.value = ''
  offertory.value = null
  selected.value = []
  error.value = ''
}

async function close() {
  error.value = ''
  try {
    await closeSession(props.sessionId)
    if (props.onSuccess) props.onSuccess()
    hideModal()
    // Reset form
    recap.value = ''
    offertory.value = null
    selected.value = []
  } catch (e: any) {
    error.value = e?.message || 'Failed to close session'
  }
}
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

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
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