<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div class="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <!-- Header Shimmer -->
        <div class="mb-4 sm:mb-6 md:mb-8">
          <ShimmerLoader className="w-24 h-10 rounded-xl" />
        </div>
  
        <!-- Page Title Shimmer -->
        <div class="text-center mb-6 sm:mb-8 space-y-2">
          <ShimmerLoader className="h-10 w-64 mx-auto rounded" />
          <ShimmerLoader className="h-5 w-80 mx-auto rounded" />
        </div>
  
        <!-- Create Session Card Shimmer -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-indigo-100/50 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div class="flex items-center gap-3 mb-4 sm:mb-6">
            <ShimmerLoader className="w-12 h-12 rounded-xl" />
            <ShimmerLoader className="h-7 w-48 rounded" />
          </div>
  
          <div class="space-y-4 sm:space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <!-- Session Title Field -->
              <div class="space-y-2">
                <ShimmerLoader className="h-5 w-32 rounded" />
                <ShimmerLoader className="w-full h-11 rounded-xl" />
              </div>
  
              <!-- Session Date Field -->
              <div class="space-y-2">
                <ShimmerLoader className="h-5 w-20 rounded" />
                <ShimmerLoader className="w-full h-11 rounded-xl" />
              </div>
            </div>
  
            <!-- Submit Button -->
            <ShimmerLoader className="w-full md:w-40 h-12 rounded-xl" />
          </div>
        </div>
  
        <!-- Existing Sessions Shimmer -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-indigo-100/50 p-4 sm:p-6 md:p-8">
          <div class="flex items-center gap-3 mb-4 sm:mb-6">
            <ShimmerLoader className="w-12 h-12 rounded-xl" />
            <div class="space-y-2">
              <ShimmerLoader className="h-7 w-44 rounded" />
              <ShimmerLoader className="h-4 w-32 rounded" />
            </div>
          </div>
  
          <!-- Sessions List Shimmer -->
          <div class="space-y-3">
            <div v-for="i in 5" :key="i" class="rounded-xl border-2 bg-gray-50/50 border-gray-200 overflow-hidden">
              <!-- Main Card Content -->
              <div class="p-4">
                <div class="flex items-start gap-3">
                  <!-- Avatar -->
                  <ShimmerLoader className="w-12 h-12 rounded-full flex-shrink-0" />
  
                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <div class="flex-1 min-w-0 space-y-2">
                        <ShimmerLoader className="h-5 w-48 rounded" />
                        <ShimmerLoader className="h-4 w-32 rounded" />
                      </div>
  
                      <!-- Status Badge -->
                      <ShimmerLoader className="w-20 h-7 rounded-full flex-shrink-0" />
                    </div>
  
                    <!-- Action Buttons -->
                    <div class="flex flex-wrap gap-2 mt-3">
                      <ShimmerLoader className="w-32 h-9 rounded-lg" />
                      <ShimmerLoader className="w-28 h-9 rounded-lg" />
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