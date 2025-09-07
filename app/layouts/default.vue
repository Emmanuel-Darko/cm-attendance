<template>
    <div class="overflow-y-scroll hide-scroll">
        <slot></slot>
        <component
            v-if="isVisible"
            v-bind="props"
            :is="content"
            @close="hideModal"
        />
    </div>
</template>
<script setup lang="ts">
    const { isVisible, content, props, hideModal } = useCommon()
</script>