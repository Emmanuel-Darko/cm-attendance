<template>
    <div class="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]"
        :class="className">
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    className?: string
}>()
</script>

<style scoped>
@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

.animate-shimmer {
    animation: shimmer 1.5s ease-in-out infinite;
}
</style>