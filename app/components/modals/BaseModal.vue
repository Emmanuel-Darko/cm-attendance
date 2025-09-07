<template>
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <!-- Overlay -->
			<div
				class="fixed inset-0 bg-black/50"
				@click.self="clickOutside ? closeModal() : null"
				:class="{ 'cursor-pointer': clickOutside }"
				aria-hidden="true"
			></div>
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
        <!-- Close Button -->
        <button
          v-if="showCloseButton"
          @click="closeModal"
          class="py-1 px-2 hover:bg-gray-100 rounded-sm transition-colors absolute top-3 right-2.5 cursor-pointer outline-0"
          aria-label="Close modal"
        >
          <span class="text-black font-normal">✕</span>
        </button>

        <!-- Header slot -->
        <header v-if="$slots.header" class="mb-4">
          <slot name="header"></slot>
        </header>
  
        <!-- Default body slot -->
        <main class="mb-6">
          <slot></slot>
        </main>
  
        <!-- Footer slot (default to confirm/cancel) -->
        <footer v-if="$slots.footer" class="flex justify-end gap-2">
          <slot name="footer">
            <button
              @click="$emit('cancel')"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              @click="$emit('confirm')"
              class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Confirm
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup>
    const props = defineProps({
      showCloseButton: {
        type: Boolean,
        default: true
      },
      clickOutside: {
        type: Boolean,
        default: true
      }
    })
    const emit = defineEmits(['close'])

    const closeModal = () => emit('close')
  </script>