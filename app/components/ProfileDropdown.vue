<template v-if="showProfileMenu">
  <div class="absolute top-4 right-4 z-50">
    <div class="relative inline-block text-left">
      <button
        @click="toggleMenu"
        class="flex items-center px-4 py-2 rounded-full bg-white shadow hover:bg-indigo-50 focus:outline-none"
      >
        <!-- Avatar circle: use img if available, fallback to initials -->
        <span class="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-200 overflow-hidden mr-2">
          <img
            v-if="user?.avatar_url"
            :src="user.avatar_url"
            alt="avatar"
            class="w-8 h-8 object-cover rounded-full"
          />
          <span
            v-else
            class="text-indigo-900 font-bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" fill="#4F46E5"/>
              <path d="M4 20c0-4 8-6 8-6s8 2 8 6" fill="#A5B4FC"/>
            </svg>
          </span>
        </span>
        <svg
          class="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        v-if="menuOpen"
        class="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black/5 focus:outline-none"
      >
        <div class="py-2 space-y-1">
          <button
            class="w-full flex items-center text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 transition rounded gap-2"
            disabled
          >
            <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M4 20c0-4 8-6 8-6s8 2 8 6" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <span>Profile</span>
          </button>
          <button
            class="w-full flex items-center text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 transition rounded gap-2"
            disabled
          >
            <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 3v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              <rect x="4" y="17" width="16" height="2" rx="1" fill="currentColor" class="opacity-40"/>
            </svg>
            <span>Settings</span>
          </button>
          <button
            @click="handleLogout"
            class="w-full flex items-center text-left px-4 py-2 text-red-600 hover:bg-red-100 transition rounded gap-2"
          >
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              <path d="M3 21V3a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue'
  const { user, logout } = useAuth()

  // Controls menu open/close state
  const menuOpen = ref(false)

  // Show dropdown only if logged in
  const showProfileMenu = computed(() => !!user.value)

  // Handle menu toggle
  function toggleMenu() {
    menuOpen.value = !menuOpen.value
  }

  // Handle logout and close dropdown
  async function handleLogout() {
    await logout()
    menuOpen.value = false
  }
</script>