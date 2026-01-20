<template>
    <!-- Modal Overlay -->
    <transition name="fade">
        <BaseModal 
          @close="closeModal"
          :clickOutside="true"
        >
          <template #header>
            <h2 class="text-xl font-semibold mb-6 text-gray-700">
              {{ isEditing ? 'Edit Kid' : 'Add New Kid' }}
            </h2>
          </template>
          <!-- Modal Content -->
          <div class="rounded-lg w-full max-w-lg relative z-50">
            <form @submit.prevent="isEditing ? editKid(selectedRecord as string) : addKid()" class="grid grid-cols-1 gap-4">
              <div class="flex flex-col gap-1">
                <label for="kid-name" class="text-xs text-gray-600 font-medium">Full Name</label>
                <input
                  id="kid-name"
                  v-model="name"
                  placeholder="Eg. Junior Kode"
                  class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  autocomplete="off"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label for="kid-dob" class="text-xs text-gray-600 font-medium">
                  Dob
                  <span class="text-[red]">
                    (least year: {{ leastYear }})
                  </span>
                </label>
                <input
                  id="kid-dob"
                  v-model="dob"
                  type="date"
                  placeholder="11"
                  class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  :min="`${leastYear}-01-01`"
                  autocomplete="off"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label for="kid-gender" class="text-xs text-gray-600 font-medium">Gender</label>
                <select
                  id="kid-gender"
                  v-model="gender"
                  class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option disabled value="">Select Gender</option>
                  <option :value="GENDER.male">Male</option>
                  <option :value="GENDER.female">Female</option>
                </select>
              </div>
              <!-- Give this select option if isAdmin -->
              <div v-if="isAdmin" class="flex flex-col gap-1">
                <label for="kid-gender" class="text-xs text-gray-600 font-medium">Local</label>
                <select
                  id="local"
                  v-model="local_id"
                  class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option disabled value="">Select Local</option>
                  <option
                    v-for="local in (localsList as Array<Locals>)"
                    :key="local.id"
                    :value="local.id"
                  >
                    {{ local.name }}
                  </option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label for="guardian-name" class="text-xs text-gray-600 font-medium">Guardian Name</label>
                <input
                  id="guardian-name"
                  v-model="gName"
                  placeholder="Eg. Emmanuel Darko"
                  class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  autocomplete="off"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label for="guardian-contact" class="text-xs text-gray-600 font-medium">Guardian Contact</label>
                <input
                  id="guardian-contact"
                  v-model="gContact"
                  placeholder="Eg. 054*******"
                  class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  autocomplete="off"
                />
              </div>
              <button
                type="submit"
                :class="[
                  'rounded px-4 py-2 font-semibold transition',
                  (!name || !dob || !gender)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                ]"
                :disabled="!name || !dob || !gender || processing"
              >
                <loaderIcon v-if="processing" />
                <span v-else>{{ isEditing ? 'Edit Kid' : 'Add Kid' }}</span>
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

