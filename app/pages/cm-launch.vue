<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 mt-[55px]">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">CM Launch 2026</h1>
          <p class="text-sm text-gray-500 mt-1">Children's Ministry Launch Document</p>
        </div>
        <a
          href="/cm-launch-2026.pdf"
          download
          class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 16V4m0 12l-4-4m4 4l4-4M5 20h14" />
          </svg>
          Download
        </a>
      </div>

      <!-- PDF Viewer -->
      <div class="rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200">
        <iframe
          src="/cm-launch-2026.pdf"
          class="w-full border-0"
          :style="{ height: iframeHeight }"
          title="CM Launch 2026"
        />
      </div>

      <!-- Fallback for mobile / unsupported browsers -->
      <div class="mt-4 text-center text-sm text-gray-500 sm:hidden">
        <p>
          If the PDF doesn't display,
          <a href="/cm-launch-2026.pdf" target="_blank" class="text-indigo-600 underline">tap here to open it</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const iframeHeight = computed(() => {
  if (import.meta.client) {
    return `${window.innerHeight - 160}px`
  }
  return '80vh'
})
</script>
