<template>
    <transition name="fade">
        <transition name="fade">
            <BaseModal
                @close="hideModal"
            >
                <template #header>
                    <h2 class="text-lg font-bold text-red-600">Delete Kid</h2>
                </template>

                <!-- Content -->
                <div class="rounded-lg w-full max-w-lg relative z-50">
                    <p>Are you sure you want to delete <span class="font-bold">{{ name }}</span>? </p>
                    <p>This action cannot be undone.</p>
                </div>

                <template #footer>
                    <button
                        @click="hideModal"
                        class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        No
                    </button>
                    <button
                        @click="deleteKid(kidId)"
                        class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                        :disabled="processing"
                    >
                        <loaderIcon v-if="processing" />
                        <span v-else>Yes, Delete</span>
                    </button>
                </template>
            </BaseModal>
        </transition>
    </transition>
</template>

<script setup lang="ts">
    const { hideModal } = useCommon()
    const { processing, deleteKid } = await useAttendance()

    const props = defineProps<{
        kidId: string,
        name: string
    }>()
</script>
