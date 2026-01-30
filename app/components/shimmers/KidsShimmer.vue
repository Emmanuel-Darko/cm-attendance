<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <!-- Header Shimmer -->
      <div class="mb-6 sm:mb-8">
        <ShimmerLoader className="w-32 h-10 rounded-xl" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- Desktop: QR Code Preview Panel Shimmer -->
        <div class="hidden lg:block lg:col-span-1">
          <div class="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-6 sticky top-4 space-y-5">
            <div class="flex items-center gap-3">
              <ShimmerLoader className="w-12 h-12 rounded-xl" />
              <div class="flex-1 space-y-2">
                <ShimmerLoader className="h-5 w-24 rounded" />
                <ShimmerLoader className="h-3 w-32 rounded" />
              </div>
            </div>
            
            <div class="flex justify-center">
              <ShimmerLoader className="w-56 h-56 rounded-xl" />
            </div>
            
            <ShimmerLoader className="h-20 rounded-xl" />
          </div>
        </div>

        <!-- Children Directory Shimmer -->
        <div class="lg:col-span-2">
          <div class="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-4 sm:p-6">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div class="flex items-center gap-3">
                <ShimmerLoader className="w-12 h-12 rounded-xl" />
                <div class="space-y-2">
                  <ShimmerLoader className="h-6 w-40 rounded" />
                  <ShimmerLoader className="h-4 w-24 rounded" />
                </div>
              </div>
              <ShimmerLoader className="w-full sm:w-32 h-11 rounded-xl" />
            </div>

            <!-- Search & Bulk Actions -->
            <div class="flex flex-col gap-3 mb-5">
              <ShimmerLoader className="w-full h-12 rounded-xl" />
              <ShimmerLoader className="w-full sm:w-48 h-10 rounded-xl" />
            </div>

            <!-- Desktop Table Shimmer -->
            <div class="hidden md:block overflow-x-auto rounded-xl border-2 border-gray-200">
              <table class="w-full">
                <thead>
                  <tr class="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
                    <th class="py-4 px-4">
                      <ShimmerLoader className="h-4 w-8 rounded" />
                    </th>
                    <th class="py-4 px-4">
                      <ShimmerLoader className="h-4 w-20 rounded" />
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
                  <tr v-for="i in 8" :key="i" class="border-b border-gray-100">
                    <td class="py-4 px-4">
                      <ShimmerLoader className="w-9 h-9 rounded-full" />
                    </td>
                    <td class="py-4 px-4">
                      <div class="flex items-center gap-3">
                        <ShimmerLoader className="w-11 h-11 rounded-full" />
                        <div class="space-y-2">
                          <ShimmerLoader className="h-4 w-32 rounded" />
                          <ShimmerLoader className="h-3 w-24 rounded" />
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-4">
                      <ShimmerLoader className="h-8 w-16 rounded-full mx-auto" />
                    </td>
                    <td class="py-4 px-4">
                      <div class="flex items-center justify-center gap-2">
                        <ShimmerLoader className="w-9 h-9 rounded-xl" />
                        <ShimmerLoader className="w-9 h-9 rounded-xl" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Cards Shimmer -->
            <div class="md:hidden space-y-3">
              <div v-for="i in 6" :key="i" class="rounded-2xl p-3.5 border-2 bg-white border-gray-200">
                <div class="flex items-start gap-3">
                  <ShimmerLoader className="w-12 h-12 rounded-full flex-shrink-0" />
                  <div class="flex-1 min-w-0 space-y-2">
                    <div class="flex items-center justify-between gap-2">
                      <ShimmerLoader className="h-4 w-32 rounded" />
                      <ShimmerLoader className="w-6 h-6 rounded-full" />
                    </div>
                    <ShimmerLoader className="h-3 w-40 rounded" />
                    <div class="flex items-center justify-between pt-1">
                      <ShimmerLoader className="h-6 w-16 rounded-full" />
                      <div class="flex gap-1">
                        <ShimmerLoader className="w-8 h-8 rounded-lg" />
                        <ShimmerLoader className="w-8 h-8 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
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