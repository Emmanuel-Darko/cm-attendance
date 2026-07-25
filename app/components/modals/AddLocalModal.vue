<template>
  <BaseModal @close="closeModal" :clickOutside="true">
    <template #header>
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ editLocal ? 'Edit Local' : 'Add New Local' }}</h2>
          <p class="text-sm text-gray-500">{{ editLocal ? 'Update church location details' : 'Register a new church location' }}</p>
        </div>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Local Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="e.g. Central Assembly"
          class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
          required
        />
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Location</label>
        <input
          v-model="location"
          type="text"
          placeholder="e.g. 123 Church Street"
          class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
        />
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
            !name || processing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:scale-105'
          ]"
          :disabled="!name || processing"
        >
          <svg v-if="processing" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span v-else>{{ editLocal ? 'Save Changes' : 'Add Local' }}</span>
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script lang="ts" setup>
import SuccessModal from './SuccessModal.vue'
import type { locals as Locals } from '~/types/database'

const props = defineProps<{
  onSuccess: Function
  local?: Locals | null
}>()

const { showModal, hideModal } = useCommon()
const name = ref(props.local?.name || '')
const location = ref(props.local?.location || '')
const processing = ref(false)
const editLocal = computed(() => !!props.local)

const handleSubmit = async () => {
  processing.value = true
  try {
    if (editLocal.value) {
      const response = await $fetch(`/api/admin/locals/${props.local!.id}`, {
        method: 'PATCH',
        body: { name: name.value, location: location.value }
      }) as { success?: boolean; message?: string }
      if (!response?.success) throw new Error(response?.message || 'Failed to update local')
      showModal(SuccessModal, { message: 'Local updated successfully' })
    } else {
      const response = await $fetch('/api/admin/locals/create', {
        method: 'POST',
        body: { name: name.value, location: location.value }
      }) as { success?: boolean; message?: string }
      if (!response?.success) throw new Error(response?.message || 'Failed to add local')
      showModal(SuccessModal, { message: 'Local added successfully' })
    }
    props.onSuccess()
  } catch (error: any) {
    const msg = error?.data?.statusMessage || error?.statusMessage || error?.message || 'Operation failed'
    alert(msg)
  } finally {
    processing.value = false
  }
}

const closeModal = () => hideModal()
</script>
