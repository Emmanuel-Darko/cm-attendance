<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div class="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
            <!-- Header Shimmer -->
            <div class="mb-4 sm:mb-6 md:mb-8">
                <ShimmerLoader className="w-24 h-10 rounded-xl" />
            </div>

            <!-- Session Selection Shimmer -->
            <div class="mb-4 sm:mb-6 md:mb-8">
                <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-indigo-100/50 p-4 sm:p-5 md:p-6">
                    <div class="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <ShimmerLoader className="w-8 h-8 rounded-lg" />
                        <ShimmerLoader className="h-6 w-32 rounded" />
                    </div>

                    <div class="flex flex-wrap gap-3 sm:gap-3">
                        <ShimmerLoader className="w-32 h-10 rounded-full" />
                        <ShimmerLoader className="w-40 h-10 rounded-full" />
                    </div>
                </div>
            </div>

            <!-- Stats Card Shimmer -->
            <div class="mb-3 sm:mb-6 md:mb-8">
                <div class="bg-white rounded-lg sm:rounded-2xl shadow p-2.5 sm:p-5 md:p-6">
                    <div class="flex items-center justify-center gap-3">
                        <ShimmerLoader className="h-8 w-16 rounded" />
                        <ShimmerLoader className="h-8 w-4 rounded" />
                        <ShimmerLoader className="h-8 w-16 rounded" />
                        <ShimmerLoader className="h-6 w-20 rounded-full ml-2" />
                    </div>
                </div>
            </div>

            <!-- Tab Navigation Shimmer -->
            <div class="mb-4 sm:mb-6">
                <div
                    class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-1.5 sm:p-2 inline-flex gap-1.5 sm:gap-2 w-full sm:w-auto">
                    <ShimmerLoader className="flex-1 sm:flex-initial h-12 rounded-xl" />
                    <ShimmerLoader className="flex-1 sm:flex-initial h-12 rounded-xl" />
                </div>
            </div>

            <!-- Content Area Shimmer -->
            <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div class="p-4 sm:p-5 md:p-6">
                    <div
                        class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div class="flex items-center gap-2 sm:gap-3">
                            <ShimmerLoader className="w-8 h-8 rounded-lg" />
                            <ShimmerLoader className="h-6 w-40 rounded" />
                        </div>
                        <ShimmerLoader className="w-full md:w-80 h-10 rounded-lg" />
                    </div>

                    <!-- Desktop Table Shimmer -->
                    <div class="hidden md:block overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b-2 border-gray-200">
                                    <th class="py-4 px-4">
                                        <ShimmerLoader className="h-4 w-20 rounded" />
                                    </th>
                                    <th class="py-4 px-4">
                                        <ShimmerLoader className="h-4 w-16 rounded mx-auto" />
                                    </th>
                                    <th class="py-4 px-4">
                                        <ShimmerLoader className="h-4 w-12 rounded mx-auto" />
                                    </th>
                                    <th class="py-4 px-4">
                                        <ShimmerLoader className="h-4 w-16 rounded mx-auto" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="i in 10" :key="i" class="border-b border-gray-100">
                                    <td class="py-4 px-4">
                                        <div class="flex items-center gap-3">
                                            <ShimmerLoader className="w-10 h-10 rounded-full" />
                                            <ShimmerLoader className="h-4 w-32 rounded" />
                                        </div>
                                    </td>
                                    <td class="py-4 px-4">
                                        <ShimmerLoader className="h-8 w-24 rounded-full mx-auto" />
                                    </td>
                                    <td class="py-4 px-4">
                                        <ShimmerLoader className="h-6 w-20 rounded mx-auto" />
                                    </td>
                                    <td class="py-4 px-4">
                                        <ShimmerLoader className="h-10 w-28 rounded-lg mx-auto" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Mobile Cards Shimmer -->
                    <div class="md:hidden space-y-2.5 sm:space-y-3">
                        <div v-for="i in 8" :key="i"
                            class="rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 bg-white border-gray-200">
                            <div class="flex items-center justify-between mb-2.5 sm:mb-3">
                                <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                    <ShimmerLoader className="w-10 h-10 rounded-full flex-shrink-0" />
                                    <ShimmerLoader className="h-4 w-32 rounded" />
                                </div>
                                <ShimmerLoader className="w-20 h-6 rounded-full flex-shrink-0 ml-2" />
                            </div>

                            <div class="flex items-center justify-between gap-2">
                                <ShimmerLoader className="h-6 w-24 rounded" />
                                <ShimmerLoader className="h-9 w-24 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ShimmerLoader from './ShimmerLoader.vue'
</script>