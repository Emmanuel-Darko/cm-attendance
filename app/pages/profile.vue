<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="max-w-5xl mx-auto px-4 py-8">
      <!-- Back Button -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-white/80 backdrop-blur-sm text-indigo-700 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-indigo-100 group"
      >
        <svg class="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-medium">Back</span>
      </NuxtLink>

      <!-- Profile Card -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        <!-- Header Section with Gradient -->
        <div class="relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div class="relative">
              <div class="w-32 h-32 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-white overflow-hidden">
                <img
                  v-if="profile?.avatar_url"
                  :src="profile.avatar_url"
                  alt="User avatar"
                  class="w-full h-full object-cover"
                />
                <span
                  v-else
                  class="text-5xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                >
                  {{ initials }}
                </span>
              </div>
              <!-- Online Status Indicator -->
              <div class="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
            </div>
          </div>
        </div>

        <!-- Profile Info -->
        <div class="pt-20 pb-8 px-8 text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ profile?.full_name || 'Your Name' }}
          </h1>
          <div class="flex items-center justify-center gap-2 text-gray-600 mb-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="text-sm">{{ profile?.email || user?.email || 'user@email.com' }}</span>
          </div>
          <div class="flex items-center justify-center gap-2 text-indigo-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-sm font-medium">{{ localName || 'Central Assembly' }}</span>
          </div>
        </div>

        <!-- Divider -->
        <div class="px-8">
          <div class="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        <!-- Profile Details -->
        <div class="p-8">
          <div class="flex items-center gap-2 mb-6">
            <div class="h-8 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
            <h2 class="text-xl font-bold text-gray-900">Profile Details</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <div class="group">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
              </div>
              <div class="text-lg font-medium text-gray-900 bg-gray-50 rounded-xl px-4 py-3 group-hover:bg-indigo-50 transition-colors">
                {{ profile?.full_name || '-' }}
              </div>
            </div>

            <!-- Email -->
            <div class="group">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
              </div>
              <div class="text-lg font-medium text-gray-900 bg-gray-50 rounded-xl px-4 py-3 group-hover:bg-indigo-50 transition-colors break-all">
                {{ profile?.email || user?.email || '-' }}
              </div>
            </div>

            <!-- Gender -->
            <div class="group">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</label>
              </div>
              <div class="text-lg font-medium text-gray-900 bg-gray-50 rounded-xl px-4 py-3 group-hover:bg-indigo-50 transition-colors">
                {{ profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : '-' }}
              </div>
            </div>

            <!-- Date of Birth -->
            <div class="group">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date of Birth</label>
              </div>
              <div class="text-lg font-medium text-gray-900 bg-gray-50 rounded-xl px-4 py-3 group-hover:bg-indigo-50 transition-colors">
                {{ profile?.dob ? formatDate(profile.dob) : '-' }}
              </div>
            </div>

            <!-- Role -->
            <div class="group">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</label>
              </div>
              <div class="inline-flex items-center gap-2 text-lg font-medium text-gray-900 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl px-4 py-3 capitalize border border-indigo-100">
                <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                {{ profile?.role || '-' }}
              </div>
            </div>

            <!-- Contact -->
            <div class="group">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Number</label>
              </div>
              <div class="text-lg font-medium text-gray-900 bg-gray-50 rounded-xl px-4 py-3 group-hover:bg-indigo-50 transition-colors">
                {{ profile?.contact || '-' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="px-8 pb-8">
          <div class="flex gap-4 flex-wrap">
            <NuxtLink 
              to="/settings" 
              class="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-medium group"
            >
              <svg class="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Edit Profile
            </NuxtLink>
            <button class="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all font-medium">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import type { locals } from '~/types/database'
import { getInitials } from '~/utils'

const { user } = useAuth()
const profile = ref<any>(null)

const initials = computed(() => {
  return getInitials(profile.value?.full_name || "")
})

const localsList = ref<any[]>([])

const localName = computed(() => {
  if (!profile.value?.local_id || !Array.isArray(localsList.value)) return '-'
  const match = localsList.value.find((l: any) => l.id === profile.value.local_id)
  return match ? match.name : '-'
})

function formatDate(ts: number | string) {
  if (typeof ts === 'number') {
    const d = new Date(ts)
    return d.toLocaleDateString()
  }
  if (typeof ts === 'string') {
    const d = new Date(ts)
    return d.toLocaleDateString()
  }
  return '-'
}

onMounted(async () => {
  if (user.value) {
    profile.value = {
      full_name: user.value.full_name || user.value.name,
      email: user.value.email,
      local_id: user.value.local_id,
      avatar_url: user.value.avatar_url,
      gender: user.value.gender,
      dob: user.value.dob,
      role: user.value.role,
      contact: user.value.contact,
    }
  }
  const { data } = await useFetch<locals[]>('/api/admin/locals/list')
  if (data.value) localsList.value = data.value
})
</script>