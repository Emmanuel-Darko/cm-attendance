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
                    <h2 class="text-lg font-bold text-green-600">Check-In Successful!</h2>
                </span>
            </template>

            <!-- Content -->
            <div class="rounded-lg w-full max-w-lg relative z-50 text-center">
                <NuxtImg
                    :src="kidAvatar"
                    alt="Kid Avatar"
                    class="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-green-500 shadow"
                    width="80"
                    height="80"
                    format="webp"
                    quality="30"
                />
                
                <p class="text-gray-700 mb-4">
                    Welcome, <span class="font-bold">{{ kidName }}</span> 🎉
                </p>
                <p class="text-sm text-gray-500">Closing in {{ countdown }}s...</p>
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
        kidAvatar: string,
        kidName: string,
        countdown: number
    }>()
</script>