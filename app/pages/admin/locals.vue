<script setup lang="ts">
import type { locals as Locals } from '~/types/database'
import AddLocalModal from '~/components/modals/AddLocalModal.vue';

const { showModal } = useCommon()

const locals = ref<Locals[] | null>(null)

const fetchLocals = async () => {
  const { data } = await useFetch<Locals[]>('/api/admin/locals/list', { key: 'locals-list-' + Date.now() })
  locals.value = data.value || []
}

// Initial loading
await fetchLocals()
</script>

<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Locals</h2>
    <div class="flex justify-between items-center">
      <NuxtLink to="/admin" class="text-blue-500 underline">← Back to Dashboard</NuxtLink>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition mb-4 mt-6"
        @click="showModal(AddLocalModal, {onSuccess: fetchLocals})"
      >
        + Add Local
      </button>
    </div>
    <div class="grid gap-4 mt-4">
      <div
        v-for="local in locals as Locals[]"
        :key="local.id"
        class="border p-4 rounded-lg shadow-sm"
        v-if="locals"
      >
        <h3 class="font-semibold">{{ local.name }}</h3>
        <p class="text-sm text-gray-500">ID: {{ local.id }}</p>
      </div>
    </div>
  </div>
</template>
