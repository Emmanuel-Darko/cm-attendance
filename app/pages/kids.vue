<template>
  <template v-if="loading">
    <KidsShimmer />
  </template>
  <template v-else>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <!-- Header -->
        <div class="mb-6 sm:mb-8">
          <NuxtLink to="/" class="group inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white/50 hover:bg-white">
            <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="font-semibold text-gray-700">Back to Dashboard</span>
          </NuxtLink>
        </div>

        <!-- Mobile: Generate QR Button (Fixed at bottom when items selected) -->
        <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
          <div v-if="selectedKids.size > 0" class="lg:hidden fixed bottom-4 left-4 right-4 z-40">
            <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-green-300 p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm font-bold text-green-800">{{ selectedKids.size }} Selected</span>
                </div>
                <button @click="clearSelection" class="text-xs text-green-600 hover:text-green-800 font-semibold">Clear</button>
              </div>
              <button @click="handleExportPDF" :disabled="exportingPDF" class="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50">
                <svg v-if="exportingPDF" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{{ exportingPDF ? 'Generating...' : 'Export as PDF' }}</span>
              </button>
            </div>
          </div>
        </transition>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <!-- Desktop: QR Code Preview Panel -->
          <div class="hidden lg:block lg:col-span-1">
            <div class="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-6 sticky top-4 space-y-5">
              <div class="flex items-center gap-3">
                <div class="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-bold text-gray-900">QR Preview</h2>
                  <p class="text-xs text-gray-500">Click child to view</p>
                </div>
              </div>
              
              <div class="flex justify-center">
                <div class="relative group">
                  <div class="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <img :src="qrUrl" alt="QR Code" class="relative rounded-xl shadow-xl w-56 h-56 object-contain border-4 border-white bg-white p-3" />
                </div>
              </div>
              
              <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                <p class="text-sm text-gray-700 text-center leading-relaxed">
                  <span class="font-bold text-indigo-700">Select children</span> below to export their QR codes as PDF
                </p>
              </div>

              <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="selectedKids.size > 0" class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="text-sm font-bold text-green-800">{{ selectedKids.size }} Selected</span>
                    </div>
                    <button @click="clearSelection" class="text-xs text-green-600 hover:text-green-800 font-semibold hover:underline">Clear All</button>
                  </div>
                  
                  <button @click="handleExportPDF" :disabled="exportingPDF" class="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-sm hover:shadow-2xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                    <svg v-if="exportingPDF" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{{ exportingPDF ? 'Generating PDF...' : 'Export as PDF' }}</span>
                  </button>
                </div>
              </transition>
            </div>
          </div>

          <!-- Children Directory -->
          <div class="lg:col-span-2">
            <div class="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-4 sm:p-6">
              <!-- Header -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div class="flex items-center gap-3">
                  <div class="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 class="text-lg sm:text-xl font-bold text-gray-900">Children Directory</h5>
                    <p class="text-xs sm:text-sm font-semibold">
                      <span class="text-indigo-600">{{ filtered.length }} total</span>
                      <span v-if="selectedKids.size > 0" class="text-green-600">• {{ selectedKids.size }} selected</span>
                    </p>
                  </div>
                </div>
                
                <button @click="showModal(AddKidModal, { isEditing: false })" class="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto text-sm sm:text-base">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Child
                </button>
              </div>

              <!-- Search & Bulk Actions -->
              <div class="flex flex-col gap-3 mb-5">
                <div class="relative">
                  <svg class="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input v-model="search" type="text" placeholder="Search by name or ID..." class="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white text-sm sm:text-base" />
                </div>

                <div class="flex gap-2">
                  <button v-if="!selectionMode" @click="enableSelectionMode" class="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm">
                    <span class="flex items-center justify-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Generate QR Codes
                    </span>
                  </button>
                  <template v-else>
                    <button @click="selectAll" :disabled="filtered.length === 0" class="flex-1 px-3 sm:px-4 py-2.5 bg-indigo-100 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-200 transition-colors disabled:opacity-50 text-sm whitespace-nowrap">
                      Select All
                    </button>
                    <button @click="disableSelectionMode" class="flex-1 px-3 sm:px-4 py-2.5 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-colors text-sm">
                      Cancel
                    </button>
                  </template>
                </div>
              </div>

              <!-- Error State -->
              <div v-if="error" class="text-center py-16">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-base sm:text-lg font-semibold text-red-600">{{ error }}</p>
              </div>

              <!-- Desktop Table -->
              <div v-else class="hidden md:block overflow-x-auto rounded-xl border-2 border-gray-200">
                <table class="w-full">
                  <thead>
                    <tr class="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
                      <th v-if="selectionMode" class="py-4 px-4 text-center w-12">
                        <input type="checkbox" @change="toggleSelectAll" :checked="selectedKids.size === filtered.length && filtered.length > 0" class="w-5 h-5 rounded border-2 border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer" />
                      </th>
                      <th class="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">#</th>
                      <th class="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                      <th class="py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Age</th>
                      <th class="py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filtered.length === 0">
                      <td :colspan="selectionMode ? 5 : 4" class="p-12 text-center">
                        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <p class="font-medium text-lg text-gray-500">No children found</p>
                      </td>
                    </tr>
                    <tr v-for="(item, index) in filtered" :key="item.id" @click="selectionMode ? null : generateCode(item.id)" class="transition-all duration-200 border-b border-gray-100" :class="{ 'cursor-pointer hover:bg-gray-50': !selectionMode, 'bg-indigo-50 ring-2 ring-indigo-300 ring-inset': item.id === selectedRecord && !selectionMode, 'bg-green-50/50': selectedKids.has(item.id) }">
                      <td v-if="selectionMode" class="py-4 px-4 text-center" @click.stop>
                        <input type="checkbox" :checked="selectedKids.has(item.id)" @change="toggleKidSelection(item.id)" class="w-5 h-5 rounded border-2 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer" />
                      </td>
                      <td class="py-4 px-4">
                        <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold">{{ index + 1 }}</span>
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex items-center gap-3">
                          <div class="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">{{ item.full_name.charAt(0).toUpperCase() }}</div>
                          <div>
                            <p class="font-bold text-gray-900">{{ item.full_name }}</p>
                            <p class="text-xs text-gray-500">{{ item.id.slice(0, 12) }}...</p>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 px-4 text-center">
                        <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {{ getAge(item.dob) }}
                        </span>
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex items-center justify-center gap-2">
                          <button @click.stop="editItem(item)" class="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors group">
                            <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button @click.stop="deleteItem(item)" class="p-2.5 text-red-600 hover:bg-red-100 rounded-xl transition-colors group">
                            <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Cards -->
              <div class="md:hidden space-y-3" :class="{ 'pb-32': selectedKids.size > 0 }">
                <div v-if="filtered.length === 0" class="p-12 text-center">
                  <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p class="font-medium text-lg text-gray-500">No children found</p>
                </div>

                <div v-for="(item, index) in filtered" :key="item.id" @click="selectionMode ? toggleKidSelection(item.id) : generateCode(item.id)" class="rounded-2xl p-3.5 border-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md" :class="[item.id === selectedRecord && !selectionMode ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-300' : selectedKids.has(item.id) ? 'bg-green-50/50 border-green-300' : 'bg-white border-gray-200 hover:border-indigo-200']">
                  <div class="flex items-start gap-3">
                    <input v-if="selectionMode" type="checkbox" :checked="selectedKids.has(item.id)" @click.stop="toggleKidSelection(item.id)" class="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer flex-shrink-0" />
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">{{ item.full_name.charAt(0).toUpperCase() }}</div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between gap-2 mb-1">
                        <h3 class="font-bold text-gray-900 truncate text-sm">{{ item.full_name }}</h3>
                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex-shrink-0">{{ index + 1 }}</span>
                      </div>
                      <p class="text-xs text-gray-500 mb-2">{{ item.id.slice(0, 16) }}...</p>
                      <div class="flex items-center justify-between">
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {{ getAge(item.dob) }}
                        </span>
                        <div v-if="!selectionMode" class="flex gap-1">
                          <button @click.stop="editItem(item)" class="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button @click.stop="deleteItem(item)" class="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Success Toast -->
        <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
          <div v-if="showSuccessToast" class="fixed bottom-6 right-6 z-50">
            <div class="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="font-bold">PDF Generated!</p>
                <p class="text-sm">{{ pdfMessage }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import scanImg from '~/assets/scan.jpeg'
import AddKidModal from '~/components/modals/AddKidModal.vue'
import DeleteKidModal from '~/components/modals/DeleteKidModal.vue'

const { name, dob, gender, local_id, gName, gContact, localKids, selectedRecord, getLocalKids } = await useAttendance()
const { showModal } = useCommon()
const { generateQRCodesPDF } = usePDFExport()

const qrUrl = ref<string>(scanImg)
const loading = ref(true)
const error = ref<any>(null)
const search = ref('')
const selectedKids = ref(new Set<string>())
const exportingPDF = ref(false)
const showSuccessToast = ref(false)
const pdfMessage = ref('')
const selectionMode = ref(false)

const filtered = computed(() =>
  localKids.value.filter(a =>
    a.full_name?.toLowerCase().includes(search.value.toLowerCase()) ||
    a.id?.toLowerCase().includes(search.value.toLowerCase())
  )
)

const generateCode = async (id: string) => {
  qrUrl.value = await useQrGenerator(id)
  selectedRecord.value = id
}

const enableSelectionMode = () => {
  selectionMode.value = true
  selectedKids.value.clear()
}

const disableSelectionMode = () => {
  selectionMode.value = false
  selectedKids.value.clear()
}

const toggleKidSelection = (id: string) => {
  if (selectedKids.value.has(id)) {
    selectedKids.value.delete(id)
  } else {
    selectedKids.value.add(id)
  }
}

const toggleSelectAll = () => {
  if (selectedKids.value.size === filtered.value.length && filtered.value.length > 0) {
    selectedKids.value.clear()
  } else {
    selectAll()
  }
}

const selectAll = () => {
  selectedKids.value.clear()
  filtered.value.forEach(kid => selectedKids.value.add(kid.id))
}

const clearSelection = () => {
  selectedKids.value.clear()
}

const handleExportPDF = async () => {
  if (selectedKids.value.size === 0) return
  
  exportingPDF.value = true
  
  try {
    const selectedKidsList = Array.from(selectedKids.value)
      .map(id => localKids.value.find(kid => kid.id === id))
      .filter(Boolean) as Array<{ id: string; full_name: string }>
    
    const result = await generateQRCodesPDF(selectedKidsList)
    
    pdfMessage.value = `${result.count} QR codes exported successfully!`
    showSuccessToast.value = true
    
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
    
    disableSelectionMode()
  } catch (err) {
    console.error('Error generating PDF:', err)
    alert('Failed to generate PDF. Please try again.')
  } finally {
    exportingPDF.value = false
  }
}

const editItem = (item: any) => {
  name.value = item.full_name
  dob.value = item.dob
  gender.value = item.gender
  local_id.value = item.local_id
  gName.value = item.guardian_name || ''
  gContact.value = item.guardian_contact || ''
  selectedRecord.value = item.id
  showModal(AddKidModal, { item, isEditing: true })
}

const deleteItem = (item: any) => {
  showModal(DeleteKidModal, { kidId: item.id, name: item.full_name })
}

const getAge = (dob: number) => {
  if (!dob) return 'N/A'
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

onMounted(async () => {
  try {
    await getLocalKids()
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>