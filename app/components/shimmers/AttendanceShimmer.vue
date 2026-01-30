<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <!-- Header Shimmer -->
        <div class="mb-4 sm:mb-6 md:mb-8">
          <ShimmerLoader className="w-24 h-10 rounded-xl" />
        </div>
  
        <!-- Page Title Shimmer -->
        <div class="text-center mb-6 sm:mb-8 space-y-2">
          <ShimmerLoader className="h-10 w-72 mx-auto rounded" />
          <ShimmerLoader className="h-5 w-80 mx-auto rounded" />
        </div>
  
        <!-- Search and Export Bar Shimmer -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-indigo-100/50 p-4 sm:p-6 mb-6 sm:mb-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <!-- Search Bar -->
            <ShimmerLoader className="flex-1 max-w-md h-12 rounded-xl" />
            
            <!-- Export Button -->
            <ShimmerLoader className="w-full md:w-32 h-12 rounded-xl" />
          </div>
        </div>
  
        <!-- Sessions List Shimmer -->
        <div class="space-y-6 sm:space-y-8">
          <div v-for="i in 3" :key="i" class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-indigo-100/50 overflow-hidden">
            <!-- Session Header -->
            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 p-4 sm:p-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div class="space-y-2">
                  <ShimmerLoader className="h-6 w-56 rounded" />
                  <ShimmerLoader className="h-4 w-32 rounded" />
                </div>
                <div class="flex flex-wrap items-center gap-3">
                  <ShimmerLoader className="w-20 h-7 rounded-full" />
                  <ShimmerLoader className="w-32 h-7 rounded-full" />
                </div>
              </div>
            </div>
  
            <!-- Present and Absent Tables -->
            <div class="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
              <!-- Present Students Shimmer -->
              <div class="p-4 sm:p-6">
                <div class="flex items-center gap-2 mb-4">
                  <ShimmerLoader className="w-5 h-5 rounded" />
                  <ShimmerLoader className="h-6 w-32 rounded" />
                </div>
                <div class="space-y-2">
                  <div v-for="j in 6" :key="j" class="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                    <div class="flex items-center gap-3">
                      <ShimmerLoader className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div class="space-y-2">
                        <ShimmerLoader className="h-4 w-32 rounded" />
                        <ShimmerLoader className="h-3 w-20 rounded" />
                      </div>
                    </div>
                    <ShimmerLoader className="w-12 h-4 rounded flex-shrink-0" />
                  </div>
                </div>
              </div>
  
              <!-- Absent Students Shimmer -->
              <div class="p-4 sm:p-6">
                <div class="flex items-center gap-2 mb-4">
                  <ShimmerLoader className="w-5 h-5 rounded" />
                  <ShimmerLoader className="h-6 w-32 rounded" />
                </div>
                <div class="space-y-2">
                  <div v-for="j in 4" :key="j" class="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                    <ShimmerLoader className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div class="flex-1 space-y-2">
                      <ShimmerLoader className="h-4 w-28 rounded" />
                      <ShimmerLoader className="h-3 w-16 rounded" />
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