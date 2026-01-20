<template>
  <div class="overflow-y-scroll hide-scroll">
    <ProfileDropdown />
    <slot></slot>
    <component
      v-if="isVisible"
      v-bind="props"
      :is="content"
      @close="hideModal"
      :class="[
        'z-50',
        'fixed inset-0 flex items-center justify-center',
        'p-2 sm:p-4 md:p-8'
      ]"
    />
  </div>
</template>
<script setup lang="ts">
const { isVisible, content, props, hideModal } = useCommon();
</script>
