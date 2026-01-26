<template v-if="showProfileMenu">
  <div class="absolute top-3 right-3 z-50">
    <div class="relative">
      <!-- Trigger Button -->
      <button
        @click="toggleMenu"
        class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white transition-all border border-white/50 group"
      >
        <!-- Avatar -->
        <div class="relative">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 shadow-md">
            <div class="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img
                v-if="user?.avatar_url"
                :src="user.avatar_url"
                alt="avatar"
                class="w-full h-full object-cover"
              />
              <span
                v-else
                class="text-xs font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >
                {{ getInitials(user?.name || '') }}
              </span>
            </div>
          </div>
          <!-- Online indicator -->
          <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
        </div>

        <!-- User Info (hidden on mobile) -->
        <div class="hidden md:block text-left">
          <div class="text-xs font-semibold text-gray-900 leading-tight">
            {{ user?.name || 'User' }}
          </div>
          <div class="text-[11px] text-gray-500">
            {{ user?.role || 'Member' }}
          </div>
        </div>

        <!-- Chevron -->
        <svg
          class="w-3.5 h-3.5 text-gray-500 transition-transform"
          :class="{ 'rotate-180': menuOpen }"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95 -translate-y-2"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="menuOpen" class="absolute right-0 mt-2 w-56 origin-top-right">
          <!-- Click-outside overlay -->
          <div
            class="fixed inset-0 z-40"
            @click="toggleMenu"
          ></div>

          <!-- Menu content -->
          <div
            class="relative z-50 rounded-xl shadow-2xl bg-white/95 backdrop-blur-xl border border-gray-200/50 overflow-hidden"
          >
            <!-- User Info Header -->
            <div class="px-3 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200/50">
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5">
                  <div class="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img
                      v-if="user?.avatar_url"
                      :src="user.avatar_url"
                      alt="avatar"
                      class="w-full h-full object-cover"
                    />
                    <span
                      v-else
                      class="text-base font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    >
                      {{ getInitials(user?.name || '') }}
                    </span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-semibold text-gray-900 truncate">
                    {{ user?.name || 'User' }}
                  </div>
                  <div class="text-[11px] text-gray-600 truncate">
                    {{ user?.email || '' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Menu Items -->
            <div class="py-1.5">
              <NuxtLink
                to="/profile"
                @click="menuOpen = false"
                class="flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-indigo-50 transition-colors group"
              >
                <div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-xs font-medium text-gray-900">Profile</div>
                  <div class="text-[10px] text-gray-500">View your profile</div>
                </div>
              </NuxtLink>

              <NuxtLink
                to="/settings"
                @click="menuOpen = false"
                class="flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-purple-50 transition-colors group"
              >
                <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-xs font-medium text-gray-900">Settings</div>
                  <div class="text-[10px] text-gray-500">Manage preferences</div>
                </div>
              </NuxtLink>

              <div class="my-2 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

              <button
                @click="handleLogout"
                class="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors group"
              >
                <div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div class="flex-1 text-left">
                  <div class="text-xs font-medium">Logout</div>
                  <div class="text-[10px] text-red-500">Sign out of account</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
const { user, logout } = useAuth()

const menuOpen = ref(false)
const showProfileMenu = computed(() => !!user.value)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

async function handleLogout() {
  await logout()
  menuOpen.value = false
}
</script>