<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="max-w-3xl mx-auto px-4 py-8">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-white/80 backdrop-blur-sm text-indigo-700 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-indigo-100 group"
      >
        <svg class="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-medium">Back</span>
      </NuxtLink>

      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center mb-4">
          <div class="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          Announcements
        </h1>
        <p class="text-sm text-gray-600 mt-1">Church news and updates</p>
      </div>

      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-white/80 rounded-2xl p-6 shadow-md border border-white/50 animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>

      <div v-else-if="announcements.length === 0" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <p class="font-medium text-lg text-gray-500">No announcements yet</p>
        <p class="text-sm text-gray-400 mt-1">Check back later for updates</p>
      </div>

      <div v-else class="space-y-5">
        <div
          v-for="a in announcements"
          :key="a.id"
          class="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all"
        >
          <div class="flex items-center gap-2 mb-3">
            <div class="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
            <span class="text-xs font-medium text-gray-400">{{ formatDate(a.created_at) }}</span>
            <span v-if="a.teachers?.name" class="text-xs font-medium text-gray-400">· {{ a.teachers.name }}</span>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-3">{{ a.title }}</h2>
          <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{{ a.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const announcements = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await useFetch('/api/announcements')
    announcements.value = (data.value || []) as any[]
  } catch {
    announcements.value = []
  } finally {
    loading.value = false
  }
})

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}
</script>
