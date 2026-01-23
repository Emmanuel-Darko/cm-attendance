<template>
  <transition name="fade">
    <BaseModal 
      @close="closeModal"
      :clickOutside="true"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="p-2 sm:p-2.5 rounded-xl" :class="[
            isEditing ? 'bg-blue-100' : 'bg-indigo-100'
          ]">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" :class="[
              isEditing ? 'text-blue-600' : 'text-indigo-600'
            ]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path v-if="isEditing" stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 class="text-lg sm:text-xl font-bold text-gray-800">
            {{ isEditing ? 'Edit Child' : 'Add New Child' }}
          </h2>
        </div>
      </template>

      <!-- Modal Content -->
      <div class="rounded-lg w-full max-w-lg relative z-50">
        <form @submit.prevent="isEditing ? editKid(selectedRecord as string) : addKid()" class="space-y-4 sm:space-y-5">
          <!-- Full Name -->
          <div class="space-y-1.5 sm:space-y-2">
            <label for="kid-name" class="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-semibold">
              <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Full Name
              <span class="text-red-500">*</span>
            </label>
            <input
              id="kid-name"
              v-model="name"
              placeholder="Eg. Junior Kode"
              class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              autocomplete="off"
            />
          </div>

          <!-- Date of Birth -->
          <div class="space-y-1.5 sm:space-y-2">
            <label for="kid-dob" class="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-semibold">
              <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date of Birth
              <span class="text-red-500">*</span>
              <span class="text-xs text-gray-500 font-normal">
                (From {{ leastYear }})
              </span>
            </label>
            <input
              id="kid-dob"
              v-model="dob"
              type="date"
              class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              :min="`${leastYear}-01-01`"
              autocomplete="off"
            />
          </div>

          <!-- Gender -->
          <div class="space-y-1.5 sm:space-y-2">
            <label for="kid-gender" class="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-semibold">
              <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Gender
              <span class="text-red-500">*</span>
            </label>
            <select
              id="kid-gender"
              v-model="gender"
              class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base bg-white"
            >
              <option disabled value="">Select Gender</option>
              <option :value="GENDER.male">Male</option>
              <option :value="GENDER.female">Female</option>
            </select>
          </div>

          <!-- Local (Admin Only) -->
          <div v-if="isAdmin" class="space-y-1.5 sm:space-y-2">
            <label for="local" class="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-semibold">
              <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Local
            </label>
            <select
              id="local"
              v-model="local_id"
              class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base bg-white"
            >
              <option disabled value="">Select Local</option>
              <option
                v-for="local in (localsList as unknown as Locals[])"
                :key="local.id"
                :value="local.id"
              >
                {{ local.name }}
              </option>
            </select>
          </div>

          <!-- Guardian Information Header -->
          <div class="pt-3 sm:pt-4 border-t-2 border-gray-100">
            <div class="flex items-center gap-2 mb-3 sm:mb-4">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 class="text-sm sm:text-base font-bold text-gray-700">Guardian Information</h3>
            </div>

            <!-- Guardian Name -->
            <div class="space-y-1.5 sm:space-y-2 mb-4">
              <label for="guardian-name" class="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-semibold">
                <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Guardian Name
              </label>
              <input
                id="guardian-name"
                v-model="gName"
                placeholder="Eg. Emmanuel Darko"
                class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                autocomplete="off"
              />
            </div>

            <!-- Guardian Contact -->
            <div class="space-y-1.5 sm:space-y-2">
              <label for="guardian-contact" class="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-semibold">
                <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Guardian Contact
              </label>
              <input
                id="guardian-contact"
                v-model="gContact"
                placeholder="Eg. 054*******"
                class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                autocomplete="off"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :class="[
              'w-full rounded-lg sm:rounded-xl px-4 py-2.5 sm:py-3 font-bold transition-all text-sm sm:text-base shadow-lg',
              (!name || !dob || !gender)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isEditing 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-xl hover:scale-105'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105'
            ]"
            :disabled="!name || !dob || !gender || processing"
          >
            <loaderIcon v-if="processing" />
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path v-if="isEditing" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {{ isEditing ? 'Update Child' : 'Add Child' }}
            </span>
          </button>
        </form>
      </div>
    </BaseModal>
  </transition>    
</template>

<script lang="ts" setup>
  import BaseModal from './BaseModal.vue'
  import type { locals as Locals } from '~/types/database'

  const { name, dob, gender, local_id, gName, gContact, selectedRecord, processing, addKid, editKid } = await useAttendance()
  const { isAdmin } = useAuth()
  const  { hideModal } = useCommon()
  const { data: localsList } = await useFetch('/api/admin/locals/list')
  
  const props = defineProps(['item', 'isEditing'])

  const leastYear = new Date().getFullYear() - 18

  const closeModal = () => {
    hideModal()
    name.value = ''
    dob.value = null
    gender.value = ''
    local_id.value = ''
    gName.value = ''
    gContact.value = ''
    selectedRecord.value = ''
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
</style>