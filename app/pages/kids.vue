<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <!-- Header -->
      <div class="mb-4 sm:mb-6 md:mb-8">
        <NuxtLink to="/" class="group inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-gray-700 hover:text-indigo-600 border border-gray-100">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="font-medium text-sm sm:text-base">Back</span>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <!-- QR Code Section -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-indigo-100/50 p-4 sm:p-6 sticky top-4">
            <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div class="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h2 class="text-base sm:text-lg md:text-xl font-bold text-gray-800">QR Code</h2>
            </div>
            
            <div class="flex justify-center mb-4">
              <div class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <img :src="qrUrl" alt="QR Code" class="relative rounded-xl shadow-lg w-48 h-48 sm:w-56 sm:h-56 object-contain border-4 border-white bg-white p-3" />
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-indigo-100">
              <p class="text-xs sm:text-sm text-gray-600 text-center">
                <span class="font-semibold text-indigo-700">Click on a child</span> to generate their QR code
              </p>
            </div>
          </div>
        </div>

        <!-- Children Directory Section -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-indigo-100/50 p-4 sm:p-5 md:p-6">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h5 class="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                    Children Directory
                  </h5>
                  <p class="text-xs sm:text-sm text-indigo-600 font-semibold">{{ filtered.length }} total</p>
                </div>
              </div>
              
              <button 
                @click="showModal(AddKidModal, { isEditing: false })"
                class="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add New Child
              </button>
            </div>

            <!-- Search Bar -->
            <div class="relative mb-4 sm:mb-6">
              <svg class="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                v-model="search" 
                type="text" 
                placeholder="Search by name or ID" 
                class="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center text-gray-500 py-12 sm:py-16 text-base sm:text-lg">
              <div class="inline-block w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
              <p>Loading children...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center text-red-500 py-12 sm:py-16 text-base sm:text-lg">
              <svg class="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="font-semibold">Error: {{ error }}</p>
            </div>

            <!-- Table Container -->
            <div v-else>
              <!-- Desktop Table -->
              <div class="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                <table class="w-full">
                  <thead>
                    <tr class="bg-gradient-to-r from-indigo-50 to-purple-50">
                      <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                      <th class="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                      <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Age</th>
                      <th class="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filtered.length === 0">
                      <td colspan="4" class="p-8 sm:p-12 text-center text-gray-400">
                        <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p class="font-medium text-base sm:text-lg">No children found</p>
                      </td>
                    </tr>
                    <tr 
                      v-for="(item, index) in filtered" 
                      :key="item.id"
                      @click="generateCode(item.id)"
                      class="cursor-pointer transition-all duration-200 border-b border-gray-100 hover:bg-indigo-50"
                      :class="{ 'bg-indigo-50 ring-2 ring-indigo-200': item.id === selectedRecord }"
                    >
                      <td class="py-3 px-4">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
                          {{ index + 1 }}
                        </span>
                      </td>
                      <td class="py-3 px-4">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold text-sm">
                            {{ item.full_name.charAt(0) }}
                          </div>
                          <div>
                            <p class="font-semibold text-gray-800 text-sm">{{ item.full_name }}</p>
                            <p class="text-xs text-gray-500">ID: {{ item.id.slice(0, 8) }}...</p>
                          </div>
                        </div>
                      </td>
                      <td class="py-3 px-4 text-center">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {{ getAge(item.dob) }}
                        </span>
                      </td>
                      <td class="py-3 px-4">
                        <div class="flex items-center justify-center gap-2">
                          <button 
                            @click.stop="editItem(item)" 
                            title="Edit"
                            class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            @click.stop="deleteItem(item)" 
                            title="Delete"
                            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Cards -->
              <div class="md:hidden space-y-3">
                <div v-if="filtered.length === 0" class="p-8 text-center text-gray-400">
                  <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p class="font-medium text-lg">No children found</p>
                </div>

                <div
                  v-for="(item, index) in filtered"
                  :key="item.id"
                  @click="generateCode(item.id)"
                  class="rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer"
                  :class="[
                    item.id === selectedRecord
                      ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200'
                      : 'bg-white border-gray-200 hover:border-indigo-200'
                  ]"
                >
                  <div class="flex items-start gap-3 mb-3">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {{ item.full_name.charAt(0) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between gap-2 mb-1">
                        <h3 class="font-bold text-gray-800 text-base truncate">{{ item.full_name }}</h3>
                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs flex-shrink-0">
                          {{ index + 1 }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 mb-2">ID: {{ item.id.slice(0, 12) }}...</p>
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Age: {{ getAge(item.dob) }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex gap-2 pt-3 border-t border-gray-200">
                    <button 
                      @click.stop="editItem(item)" 
                      class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button 
                      @click.stop="deleteItem(item)" 
                      class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-100 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import scanImg from '~/assets/scan.jpeg'
import AddKidModal from '~/components/modals/AddKidModal.vue'
import DeleteKidModal from '~/components/modals/DeleteKidModal.vue'

const { name, dob, gender, local_id, gName, gContact, localKids, selectedRecord, getLocalKids } = await useAttendance()
const { showModal } = useCommon()
const qrUrl = ref<string>(scanImg)

const loading = ref(true)
const error = ref<any>(null)
const search = ref('')

const filtered = computed(() =>
  localKids.value.filter(a =>
    a.full_name?.toLowerCase().includes(search.value.toLowerCase()) ||
    a.id?.toLowerCase().includes(search.value.toLowerCase())
  )
)

const generateCode = async (id: string) => {
  qrUrl.value = await useQrGenerator(id)
  selectedRecord.value = id
}

const editItem = (item: {
  id: string,
  full_name: string,
  dob: number,
  gender: string,
  local_id: string,
  guardian_name?: string,
  guardian_contact?: string
}) => {
  name.value = item.full_name
  dob.value = item.dob
  gender.value = item.gender
  local_id.value = item.local_id
  gName.value = item.guardian_name || ''
  gContact.value = item.guardian_contact || ''
  selectedRecord.value = item.id

  showModal(AddKidModal, { item, isEditing: true })
}

const deleteItem = (item: any) => {
  showModal(DeleteKidModal, { kidId: item.id, name: item.full_name })
}

const copyId = (id: string) => navigator.clipboard.writeText(id)

onMounted(async () => {
  try {
    await getLocalKids()
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
})

// Animation for spin
const getAge = (dob: number) => {
  if (!dob) return 'N/A'
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>