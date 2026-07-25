<template>
  <BaseModal @close="closeModal" :clickOutside="true">
    <template #header>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ editTeacher ? 'Edit Teacher' : 'Add New Teacher' }}</h2>
          <p class="text-sm text-gray-500">{{ editTeacher ? 'Update teacher account details' : 'Create a new teacher account' }}</p>
        </div>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Full Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="e.g. John Doe"
          class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
          required
        />
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Email Address</label>
        <input
          v-model="email"
          type="email"
          placeholder="e.g. john@email.com"
          class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
          :required="!editTeacher"
        />
        <p v-if="editTeacher" class="mt-1 text-xs text-gray-400">Email change requires admin reassign</p>
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Local</label>
        <select
          v-model="localId"
          class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm font-medium"
          required
        >
          <option value="" disabled>Select a local</option>
          <option v-for="local in (localsList ?? []) as Locals[]" :key="local.id" :value="local.id">
            {{ local.name }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Role</label>
        <select
          v-model="role"
          class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm font-medium"
          required
        >
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div class="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all text-sm"
          @click="closeModal"
        >
          Cancel
        </button>
        <button
          type="submit"
          :class="[
            'px-5 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-2',
            (!name || !localId || !role || processing)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-xl hover:scale-105'
          ]"
          :disabled="!name || !localId || !role || processing"
        >
          <svg v-if="processing" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span v-else>{{ editTeacher ? 'Save Changes' : 'Add Teacher' }}</span>
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script lang="ts" setup>
import SuccessModal from './SuccessModal.vue'
import type { locals as Locals } from '~/types/database'

const props = defineProps<{
  onSuccess?: Function
  teacher?: any | null
}>()

const { showModal, hideModal } = useCommon()
const name = ref(props.teacher?.name || '')
const email = ref(props.teacher?.email || '')
const localId = ref(props.teacher?.local_id || '')
const role = ref<'admin' | 'teacher'>(props.teacher?.role || 'teacher')
const processing = ref(false)
const editTeacher = computed(() => !!props.teacher)

const { data: localsList } = await useFetch<Locals[]>('/api/admin/locals/list')

const handleSubmit = async () => {
  processing.value = true
  try {
    if (editTeacher.value) {
      const response = await $fetch(`/api/admin/teachers/${props.teacher!.id}`, {
        method: 'PATCH',
        body: {
          name: name.value,
          email: email.value,
          local_id: localId.value,
          role: role.value
        }
      }) as { success?: boolean; message?: string }
      if (!response?.success) throw new Error(response?.message || 'Failed to update teacher')
      showModal(SuccessModal, { message: 'Teacher updated successfully' })
      if (props.onSuccess) props.onSuccess()
      hideModal()
    } else {
      const response = await $fetch('/api/admin/teachers/create', {
        method: 'POST',
        body: {
          name: name.value,
          email: email.value,
          local_id: localId.value,
          role: role.value
        }
      }) as { success?: boolean; message?: string }
      if (!response?.success) throw new Error(response?.message || 'Failed to add teacher')
      showModal(SuccessModal, { message: 'Teacher added successfully' })
      if (props.onSuccess) props.onSuccess()
      hideModal()
    }
  } catch (error: any) {
    const msg = error?.data?.statusMessage || error?.statusMessage || error?.message || 'Operation failed'
    alert(msg)
  } finally {
    processing.value = false
  }
}

const closeModal = () => hideModal()
</script>
