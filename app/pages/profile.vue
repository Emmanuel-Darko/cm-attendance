<template>
  <div class="max-w-3xl mx-auto px-4 py-4">
    <NuxtLink to="/" class="inline-flex items-center mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </NuxtLink>

    <div class="text-center">
      <div class="flex flex-col items-center gap-2">
        <div class="w-24 h-24 rounded-full bg-gray-200 shadow-lg flex items-center justify-center border-4 border-indigo-400 overflow-hidden mb-2">
          <img
            v-if="profile?.avatar_url"
            :src="profile.avatar_url"
            alt="User avatar"
            class="w-full h-full object-cover"
          />
          <span
            v-else
            class="text-4xl font-bold text-indigo-600"
          >
            {{ initials }}
          </span>
        </div>
        <h1 class="text-2xl font-semibold text-indigo-900">
          {{ profile?.full_name || 'Your Name' }}
        </h1>
        <div class="text-gray-500">
          {{ profile?.email || user?.email || 'user@email.com' }}
        </div>
        <div class="text-gray-500">
          {{ localName || 'Central Assembly' }}
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-lg text-left font-bold mb-4 text-indigo-800">Profile Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div>
            <div class="text-gray-400 text-xs mb-1">Name</div>
            <div class="text-lg font-medium text-gray-800">{{ profile?.full_name }}</div>
          </div>
          <div>
            <div class="text-gray-400 text-xs mb-1">Email</div>
            <div class="text-lg font-medium text-gray-800">{{ profile?.email || user?.email }}</div>
          </div>
          <div>
            <div class="text-gray-400 text-xs mb-1">Gender</div>
            <div class="text-lg font-medium text-gray-800">{{ profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : '-' }}</div>
          </div>
          <div>
            <div class="text-gray-400 text-xs mb-1">Date of Birth</div>
            <div class="text-lg font-medium text-gray-800">{{ profile?.dob ? formatDate(profile.dob) : '-' }}</div>
          </div>
          <div>
            <div class="text-gray-400 text-xs mb-1">Role</div>
            <div class="text-lg font-medium text-gray-800 capitalize">{{ profile?.role || '-' }}</div>
          </div>
          <div>
            <div class="text-gray-400 text-xs mb-1">Contact</div>
            <div class="text-lg font-medium text-gray-800">{{ profile?.contact || '-' }}</div>
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

// Use current logged in user from the auth composable
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
  // Fetch the list of locals and assign to localsList
  const { data } = await useFetch<locals[]>('/api/admin/locals/list')
  if (data.value) localsList.value = data.value
})
</script>

<style scoped>
.text-indent {
  text-indent: 2rem;
}
</style>