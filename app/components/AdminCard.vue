<template>
    <div
      class="bg-white shadow-sm rounded-xl p-5 hover:shadow-md transition cursor-pointer border border-gray-100"
      @click="$emit('click')"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
          <p class="text-gray-500 text-sm mt-1">{{ description }}</p>
        </div>
  
        <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
          <slot name="icon">
            <!-- Default icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 text-blue-500"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </slot>
        </div>
      </div>
    </div>
</template>
  
<script setup>
  defineProps({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
  });
</script>
  