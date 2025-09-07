<template>
    <transition name="fade">
        <BaseModal
            @close="hideModal"
        >
            <template #header>
                <span class="flex items-center gap-2">
                    <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M7 13l3 3 7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h2 class="text-lg font-bold text-green-600">Success</h2>
                </span>
            </template>

            <!-- Content -->
            <div class="rounded-lg w-full max-w-lg relative z-50 text-center">
                {{ message }}
            </div>

            <template #footer>
                <button
                    @click="hideModal"
                    class="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                >
                    OKAY
                </button>
            </template>
        </BaseModal>
    </transition>
</template>

<script setup lang="ts">
    const { hideModal } = useCommon()
    const props = defineProps<{
        message: string
    }>()
</script>
