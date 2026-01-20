<template>
  <!-- Modal Overlay -->
  <transition name="fade">
    <BaseModal @close="closeModal" :clickOutside="true">
      <template #header>
        <h2 class="text-xl font-semibold mb-6 text-gray-700">Add New Teacher</h2>
      </template>
      <!-- Modal Content -->
      <div class="rounded-lg w-full max-w-lg relative z-50">
        <form @submit.prevent="addTeacher" class="grid grid-cols-1 gap-4">
          <div class="flex flex-col gap-1">
            <input
              v-model="name"
              type="text"
              placeholder="Name"
              class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div class="flex flex-col gap-1">
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div class="flex flex-col gap-1">
            <select v-model="localId" 
              class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="">Select Local</option>
              <option
                v-for="local in (localsList ?? []) as Locals[]"
                :key="local.id"
                :value="local.id"
              >
                {{ local.name }}
              </option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <select v-model="role"
              class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button type="button" class="btn-secondary" @click="$emit('close')">
              Cancel
            </button>
            <button 
              type="submit" 
              :class="[
                'rounded px-4 py-2 font-semibold transition',
                (!name || !email || !role || !localId || processing)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              ]"
              :disabled="!name || !email || !role || !localId || processing"
            >
              <loaderIcon v-if="processing" />
              <span v-else>Add Teacher</span>
            </button>
          </div>
        </form>
      </div>
    </BaseModal>
  </transition>
</template>

<script lang="ts" setup>
import SuccessModal from './SuccessModal.vue';
import type { locals as Locals } from '~/types/database';

const { showModal, hideModal } = useCommon();
const name = ref<string>("");
const email = ref<string>("");
const localId = ref<string>("");
const role = ref<'admin'|'teacher'>("teacher");
const processing = ref<boolean>(false);

const addTeacher = async () => {
  processing.value = true

  try {
    const response = await $fetch('/api/admin/teachers/create', {
      method: 'POST',
      credentials: 'include',
      body: {
        name: name.value,
        email: email.value,
        local_id: localId.value,
        role: role.value
      }
    }) as { success?: boolean; message?: string };

    if (response && response.success) {
      showModal(SuccessModal, { message: response.message ?? 'Teacher added successfully.' })
    
      name.value = ''
      email.value = ''
      role.value = 'teacher'
      localId.value = ''
      
      hideModal()
    }
  }
  catch (error: any) {
    console.error('Error adding teacher:', error)
    const errorMessage = error?.data?.statusMessage || error?.statusMessage || error?.message || 'Failed to add teacher'
    alert(errorMessage)
  }
  finally {
    processing.value = false
  }
};

const { data: localsList } = await useFetch<Locals[]>('/api/admin/locals/list');

const closeModal = () => {
  hideModal();
};
</script>
