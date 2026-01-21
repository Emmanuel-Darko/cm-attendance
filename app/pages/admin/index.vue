<script setup lang="ts">
const { data: locals } = await useFetch('/api/admin/locals/list')
const { data: teachers } = await useFetch('/api/admin/teachers/list')
const { data: kids } = await useFetch('/api/admin/kids/adminList')
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">Admin Dashboard</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink
        v-for="card in [
          { title: 'Locals', count: Array.isArray(locals) ? locals.length : 0, to: '/admin/locals', color: 'bg-blue-100 text-blue-700' },
          { title: 'Teachers', count: Array.isArray(teachers) ? teachers.length : 0, to: '/admin/teachers', color: 'bg-green-100 text-green-700' },
          { title: 'Kids', count: Array.isArray(kids) ? kids.length : 0, to: '/admin/kids', color: 'bg-yellow-100 text-yellow-700' }
        ]"
        :key="card.title"
        :to="card.to"
        class="p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100 flex flex-col items-center justify-center gap-2"
        :class="card.color"
      >
        <div class="text-4xl font-bold">{{ card.count ?? 0 }}</div>
        <div class="text-lg font-semibold">{{ card.title }}</div>
      </NuxtLink>
    </div>
  </div>
</template>
