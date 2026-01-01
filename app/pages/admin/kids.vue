<script setup lang="ts">
  const { getAge } = useCommon()

const { data: kids } = await useFetch('/api/admin/kids')

const grouped = computed(() => {
  const out: Record<string, any[]> = {}
  kids.value?.forEach(k => {
    const localName = k.locals?.name || 'Unassigned'
    if (!out[localName]) out[localName] = []
    out[localName].push(k)
  })
  return out
})
</script>

<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Kids</h2>
    <NuxtLink to="/admin" class="text-blue-500 underline">← Back to Dashboard</NuxtLink>

    <div v-for="(group, local) in grouped" :key="local" class="mt-6">
      <h3 class="font-semibold text-lg mb-2">{{ local }}</h3>
      <ul class="space-y-1">
        <li v-for="k in group" :key="k.id" class="border p-3 rounded-md shadow-sm flex justify-between items-center">
          <div>
            <div class="font-medium">{{ k.full_name }}</div>
            <div class="text-sm text-gray-500">{{ getAge(k.dob) }} yrs</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
