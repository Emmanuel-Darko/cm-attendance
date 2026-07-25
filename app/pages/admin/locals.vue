<script setup lang="ts">
import type { locals as Locals } from '~/types/database'
import AddLocalModal from '~/components/modals/AddLocalModal.vue'
import ConfirmModal from '~/components/modals/ConfirmModal.vue'

const { showModal } = useCommon()
const locals = ref<Locals[] | null>(null)

const fetchLocals = async () => {
  const { data } = await useFetch<Locals[]>('/api/admin/locals/list', { key: 'locals-list-' + Date.now() })
  locals.value = data.value || []
}

await fetchLocals()

function editLocal(local: Locals) {
  showModal(AddLocalModal, { local, onSuccess: fetchLocals })
}

function confirmDelete(local: Locals) {
  showModal(ConfirmModal, {
    message: `Are you sure you want to delete "${local.name}"?`,
    onConfirm: async () => {
      try {
        await $fetch(`/api/admin/locals/${local.id}`, { method: 'DELETE' })
        await fetchLocals()
      } catch (e: any) {
        alert(e?.data?.statusMessage || e?.message || 'Failed to delete local')
      }
    }
  })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div class="mb-6 sm:mb-8">
        <NuxtLink to="/admin" class="group inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white/50 hover:bg-white">
          <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="font-semibold text-gray-700">Back to Admin</span>
        </NuxtLink>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Locals
          </h1>
          <p class="text-sm text-gray-600 mt-1">Manage church locations</p>
        </div>
        <button
          class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 sm:py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
          @click="showModal(AddLocalModal, { onSuccess: fetchLocals })"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Local
        </button>
      </div>

      <div v-if="!locals || locals.length === 0" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <p class="font-medium text-lg text-gray-500">No locations found</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div
            v-for="local in locals"
            :key="local.id"
            class="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <div class="flex items-start gap-4">
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex-shrink-0">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="text-lg font-bold text-gray-900">{{ local.name }}</h3>
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      @click="editLocal(local)"
                      class="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors"
                      title="Edit local"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="confirmDelete(local)"
                      class="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                      title="Delete local"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-sm text-gray-500 mt-1">{{ local.location || 'No location set' }}</p>
                <p class="text-xs text-gray-400 font-mono mt-0.5">ID: {{ local.id }}</p>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>