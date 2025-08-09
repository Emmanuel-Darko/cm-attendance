<template>
  <div class="max-w-4xl mx-auto p-4">
    <NuxtLink to="/" class="inline-flex items-center mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
      Back
    </NuxtLink>
    <div class="flex justify-center items-center mb-8">
      <img :src="qrUrl" alt="QR Code" class="rounded shadow-lg w-40 h-40 object-contain border border-gray-200 bg-white p-2" />
    </div>
    <div class="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Kids Records</h1>
        <button
          @click="openModalForAdd"
          class="bg-blue-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-700 transition"
        >
          Add New Kid
        </button>
      </div>
      <input
        v-model="search"
        type="text"
        placeholder="Search by name or ID"
        class="border border-gray-300 rounded px-4 py-2 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <div v-if="loading" class="text-center text-gray-500 py-8">Loading...</div>
      <div v-else-if="error" class="text-center text-red-500 py-8">Error: {{ error }}</div>
      <div v-else>
        <div class="overflow-x-auto w-full">
          <table class="w-full table-auto border-collapse">
            <thead>
              <tr class="bg-blue-300">
                <th class="p-3 border-b text-left text-gray-700">Kid ID</th>
                <th class="p-3 border-b text-left text-gray-700">Name</th>
                <th class="p-3 border-b text-left text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filtered"
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
                <td class="p-3 border-b flex gap-2">
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
      <!-- Add/Edit Kid Modal Trigger Button -->
      <div class="mt-10">
        <p 
          class="mt-2 font-medium min-h-[1.5em]"
          :class="isErrorMessage ? 'text-red-600' : 'text-green-600'"
        >{{ message }}</p>
      </div>

      <!-- Modal Overlay -->
      <transition name="fade">
        <div
          v-if="showModal"
          class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40"
        >
          <!-- Modal Content -->
          <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-8 relative z-50">
            <button
              @click="closeModal"
              class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 class="text-xl font-semibold mb-6 text-gray-700">
              {{ isEditing ? 'Edit Kid' : 'Add New Kid' }}
            </h2>
            <form @submit.prevent="isEditing ? editKid(selectedRecord as string) : addKid()" class="grid grid-cols-1 gap-4">
              <input
                v-model="name"
                placeholder="Name"
                class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                autocomplete="off"
              />
              <input
                v-model="age"
                type="number"
                placeholder="Age"
                class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                min="0"
                autocomplete="off"
              />
              <select
                v-model="gender"
                class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option disabled value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              <input
                v-model="gName"
                placeholder="Guardian name"
                class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                autocomplete="off"
              />
              <input
                v-model="gContact"
                placeholder="Guardian contact"
                class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                autocomplete="off"
              />
              <button
                type="submit"
                :class="[
                  'rounded px-4 py-2 font-semibold transition',
                  (!name || !age || !gender)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                ]"
                :disabled="!name || !age || !gender"
              >
                {{ isEditing ? 'Edit Kid' : 'Add Kid' }}
              </button>
            </form>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
    import scanImg from '~/assets/scan.jpeg'

    const { name, age, gender, message, records, gName, gContact, getRecords, addKid, editKid, deleteKid } = await useAttendance()
    const qrUrl = ref<string>(scanImg)
    const selectedRecord = ref<string | null>(null)

    const loading = ref(true)
    const error = ref<any>(null)
    const search = ref('')
    const isEditing = ref(false)
    const showModal = ref(false)

    const filtered = computed(() =>
        records.value.filter(a =>
            a.full_name?.toLowerCase().includes(search.value.toLowerCase()) ||
            a.id?.toLowerCase().includes(search.value.toLowerCase())
        )
    )

    const isErrorMessage = computed(() => {
        const msg = message.value?.toLowerCase() || '';
        return msg.includes('error') || msg.includes('fail') || msg.includes('invalid');
    })

    const generateCode = async(id: string) => {
        qrUrl.value = await useQrGenerator(id)
        selectedRecord.value = id
    }

    const editItem = (item: {
        id: string,
        full_name: string,
        age: number,
        gender: string,
        guardian_name?: string,
        guardian_contact?: string
    }) => {
        isEditing.value = true
        showModal.value = true

        name.value = item.full_name
        age.value = item.age.toString()
        gender.value = item.gender
        gName.value = item.guardian_name || ''
        gContact.value = item.guardian_contact || ''
        selectedRecord.value = item.id
    }

    const deleteItem = (item: any) => {
        if (confirm(`Are you sure you want to delete ${item.full_name}?`)) {
            deleteKid(item.id)
        }
    }

    const copyId = (id: string) => navigator.clipboard.writeText(id)

    const openModalForAdd = () => showModal.value = true

    const closeModal = () => {
      showModal.value=false

      if(isEditing.value) {
        isEditing.value = false
        name.value = ''
        age.value = ''
        gender.value = ''
        gName.value = ''
        gContact.value = ''
        selectedRecord.value = ''
      }
    }

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