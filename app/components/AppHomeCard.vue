<script lang="ts" setup>
    const props = defineProps(['to', 'icon', 'title', 'description'])
</script>

<template>
    <NuxtLink :to="props.to" class="group relative block focus:outline-none my-1">
      <div class="bg-white/80 rounded-2xl shadow-lg border-t-4 border-indigo-200 hover:border-indigo-400 hover:scale-105 transition-transform p-8 pt-14">
        <!-- Peg Icon -->
        <div class="absolute left-1/2 -top-8 transform -translate-x-1/2">
          <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center shadow-md border-4 border-white group-hover:bg-indigo-200 transition">
            <span class="text-4xl select-none">{{ props.icon }}</span>
          </div>
          <div class="w-2 h-4 bg-gray-300 rounded-b-full mx-auto -mt-1"></div>
        </div>
        <h2 class="text-xl font-bold text-indigo-700 mb-2 text-center mt-2">{{ props.title }}</h2>
        <p class="text-gray-500 text-center">{{ props.description }}</p>
      </div>
    </NuxtLink>
</template>
