<script setup lang="ts">
import AddTeacherModal from '~/components/modals/AddTeacherModal.vue'

const { data: teachers } = await useFetch('/api/admin/teachers')
const { showModal } = useCommon()

const grouped = computed(() => {
  const out: Record<string, any[]> = {}
  teachers.value?.forEach(t => {
    const localName = t.locals?.name || 'Unassigned'
    if (!out[localName]) out[localName] = []
    out[localName].push(t)
  })
  return out
})
</script>

<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Teachers</h2>
    <div class="flex justify-between items-center">
      <NuxtLink to="/admin" class="text-blue-500 underline">← Back to Dashboard</NuxtLink>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition mb-4 mt-6"
        @click="showModal(AddTeacherModal)"
      >
        + Add Teacher
      </button>
    </div>

    <div v-for="(group, local) in grouped" :key="local" class="mt-6">
      <h3 class="font-semibold text-lg mb-2">{{ local }}</h3>
      <ul class="space-y-1">
        <li v-for="t in group" :key="t.id" class="border p-3 rounded-md shadow-sm flex justify-between items-center">
          <div>
            <div class="font-medium">{{ t.name }}</div>
            <div class="text-sm text-gray-500">{{ t.email }}</div>
            <div class="text-sm text-gray-500">{{ t.contact }}</div>
          </div>
          <span class="text-xs bg-gray-100 px-2 py-1 rounded">{{ t.role }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
