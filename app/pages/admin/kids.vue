<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { locals as LocalsType } from '~/types/database'
import scanImg from '~/assets/scan.jpeg'
import AddKidModal from '~/components/modals/AddKidModal.vue'
import DeleteKidModal from '~/components/modals/DeleteKidModal.vue'

// State
const { data: locals } = await useFetch<LocalsType[]>('/api/admin/locals/list')
const { name, dob, gender, local_id, gName, gContact, records, selectedRecord, getRecords } = await useAttendance()
const { showModal } = useCommon()

const loading = ref(true)
const error = ref<any>(null)
const search = ref('')
const selectedLocal = ref<string>('')
const qrUrl = ref<string>(scanImg)

// Computed filtered kids
const filteredKids = computed(() => {
  let list = records.value || []

  // Filter by selected local
  if (selectedLocal.value) {
    list = list.filter(k => k.local_id === selectedLocal.value)
  }

  // Filter by search
  if (search.value) {
    const searchTerm = search.value.toLowerCase()
    list = list.filter(k =>
      (k.full_name?.toLowerCase().includes(searchTerm) || k.id?.toLowerCase().includes(searchTerm))
    )
  }

  return list
})

// Utility methods
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

// Initial data load
onMounted(async () => {
  try {
    await getRecords()
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <NuxtLink to="/admin" class="inline-flex items-center mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
      Back
    </NuxtLink>
    <div class="flex justify-center items-center mb-8">
      <img :src="qrUrl" alt="QR Code" class="rounded shadow-lg w-40 h-40 object-contain border border-gray-200 bg-white p-2" />
    </div>
    <div class="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h5 class="text-xl sm:text-2xl font-semibold text-blue-700 text-center sm:text-left">
          Children Directory <span class="text-blue-600">({{ filteredKids.length }})</span>
        </h5>
        <button
          @click="showModal(AddKidModal, {isEditing: false})"
          class="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded font-semibold shadow hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Add New Kid
        </button>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          v-model="search"
          type="text"
          placeholder="Search by name or ID"
          class="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <select
          v-model="selectedLocal"
          class="border border-gray-300 rounded px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">All Locals</option>
          <option
            v-for="local in locals ?? []"
            :key="local.id"
            :value="local.id"
          >
            {{ local.name }}
          </option>
        </select>
      </div>
      <div v-if="loading" class="text-center text-gray-500 py-8">Loading...</div>
      <div v-else-if="error" class="text-center text-red-500 py-8">Error: {{ error }}</div>
      <div v-else>
        <div class="overflow-x-auto w-full">
          <table class="w-full min-w-max table-auto border-collapse">
            <thead>
              <tr class="bg-blue-300">
                <th class="p-3 border-b text-left text-gray-700">Kid ID</th>
                <th class="p-3 border-b text-left text-gray-700">Name</th>
                <th class="p-3 border-b text-left text-gray-700">Age</th>
                <th class="p-3 border-b text-left text-gray-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredKids.length === 0">
                <td colspan="4" class="p-6 text-center text-gray-500">
                  No kids found.
                </td>
              </tr>
              <tr
                v-for="item in filteredKids"
                :key="item.id"
                @click="generateCode(item.id)"
                class="cursor-pointer transition hover:bg-blue-100"
                :class="{'bg-blue-50': item.id === selectedRecord}"
              >
                <td class="p-3 border-b flex items-center gap-2">
                  <span>{{ item.id.slice(0, 6) }}...</span>
                  <button
                    @click.stop="copyId(item.id)"
                    title="Copy ID"
                    class="text-gray-400 hover:text-blue-600 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
                      <rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                  </button>
                </td>
                <td class="p-3 border-b">{{ item.full_name }}</td>
                <td class="p-3 border-b">{{ getAge(item.dob) }}</td>
                <td class="p-3 border-b flex justify-center gap-8 text-center">
                  <button
                    @click.stop="editItem(item)"
                    title="Edit"
                    class="text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h2v6z" />
                    </svg>
                  </button>
                  <button
                    @click.stop="deleteItem(item)"
                    title="Delete"
                    class="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
