<script setup lang="ts">
const { data: locals, refresh } = await useFetch('/api/admin/locals')
</script>

<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Locals</h2>
    <NuxtLink to="/admin" class="text-blue-500 underline">← Back to Dashboard</NuxtLink>

    <div class="grid gap-4 mt-4">
      <div v-for="local in locals" :key="local.id" class="border p-4 rounded-lg shadow-sm">
        <h3 class="font-semibold">{{ local.name }}</h3>
        <p class="text-sm text-gray-500">ID: {{ local.id }}</p>
      </div>
    </div>
  </div>
</template>
