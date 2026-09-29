<template>
  <div v-if="showNav">
    <!-- Bottom Navigation Bar (Mobile Only: md:hidden) -->
    <nav
      class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] md:hidden transition-transform duration-300"
      style="padding-bottom: env(safe-area-inset-bottom, 0px);"
    >
      <div class="grid h-14 max-w-lg mx-auto" :style="{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }">
        <template v-for="tab in tabs" :key="tab.id">
          <!-- Action tab (e.g. More Drawer toggle) -->
          <button
            v-if="tab.action"
            type="button"
            @click="tab.action"
            class="relative flex flex-col items-center justify-center py-1 transition-all duration-200"
            :class="isMoreOpen ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-900'"
          >
            <div class="relative">
              <component :is="tab.icon" class="w-5 h-5 transition-transform active:scale-90" />
              <span
                v-if="tab.badge"
                class="absolute -top-1 -right-2 px-1 py-0.2 text-[9px] font-black bg-rose-500 text-white rounded-full min-w-3.5 text-center shadow-2xs"
              >
                {{ tab.badge }}
              </span>
            </div>
            <span class="text-[10px] mt-0.5 tracking-tight font-medium" :class="{ 'font-bold text-indigo-600': isMoreOpen }">
              {{ tab.label }}
            </span>
          </button>

          <!-- Router Link tab -->
          <NuxtLink
            v-else
            :to="tab.to"
            class="relative flex flex-col items-center justify-center py-1 transition-all duration-200 group"
            :class="isActive(tab.to) ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-900'"
          >
            <!-- Active pill indicator -->
            <div
              v-if="isActive(tab.to)"
              class="absolute top-0 inset-x-4 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
            ></div>

            <div class="relative">
              <!-- Highlighted icon container if primary CTA -->
              <div
                v-if="tab.isCta"
                class="w-7 h-7 -mt-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs active:scale-95 transition-transform"
              >
                <component :is="tab.icon" class="w-4 h-4" />
              </div>
              <component
                v-else
                :is="tab.icon"
                class="w-5 h-5 transition-transform group-active:scale-90"
              />

              <span
                v-if="tab.badge"
                class="absolute -top-1 -right-2 px-1 py-0.2 text-[9px] font-black bg-amber-500 text-white rounded-full min-w-3.5 text-center shadow-2xs"
              >
                {{ tab.badge }}
              </span>
            </div>
            <span
              class="text-[10px] mt-0.5 tracking-tight"
              :class="isActive(tab.to) ? 'font-bold text-indigo-600' : 'font-medium'"
            >
              {{ tab.label }}
            </span>
          </NuxtLink>
        </template>
      </div>
    </nav>

    <!-- Slide-up "More" Drawer / Bottom Sheet -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isMoreOpen"
          class="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs md:hidden"
          @click="isMoreOpen = false"
        ></div>
      </Transition>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div
          v-if="isMoreOpen"
          class="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-gray-200/90 shadow-2xl p-5 md:hidden max-h-[85vh] overflow-y-auto space-y-4"
          style="padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1.25rem);"
        >
          <!-- Drawer Handle -->
          <div class="flex justify-center -mt-2 mb-2">
            <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          <!-- Header & User Status -->
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
                {{ user ? (user.name?.[0]?.toUpperCase() || 'U') : '✝' }}
              </div>
              <div class="min-w-0">
                <h3 class="font-bold text-sm text-gray-900 truncate">
                  {{ user ? (user.name || user.email?.split('@')[0]) : 'Guest User' }}
                </h3>
                <p class="text-xs text-gray-500 truncate">
                  {{ user ? (user.role === 'admin' ? 'Administrator' : 'Staff / Worker') : 'Not signed in' }}
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="isMoreOpen = false"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <!-- Ministry Portals -->
          <div class="space-y-1.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-1">
              Ministry Portals
            </span>
            <div class="grid grid-cols-2 gap-2">
              <NuxtLink
                to="/souls"
                @click="isMoreOpen = false"
                class="p-2.5 rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 to-orange-50/40 hover:bg-amber-100/50 flex items-center gap-2 transition"
              >
                <span class="text-lg">🔥</span>
                <div class="min-w-0">
                  <p class="font-bold text-xs text-gray-900 truncate">Souls 800k</p>
                  <p class="text-[10px] text-gray-500 truncate">Outreach tracker</p>
                </div>
              </NuxtLink>

              <NuxtLink
                to="/adult"
                @click="isMoreOpen = false"
                class="p-2.5 rounded-xl border border-teal-200/80 bg-gradient-to-br from-teal-50/60 to-emerald-50/40 hover:bg-teal-100/50 flex items-center gap-2 transition"
              >
                <span class="text-lg">🤝</span>
                <div class="min-w-0">
                  <p class="font-bold text-xs text-gray-900 truncate">Adult Visitors</p>
                  <p class="text-[10px] text-gray-500 truncate">Church guests</p>
                </div>
              </NuxtLink>

              <NuxtLink
                to="/checkin"
                @click="isMoreOpen = false"
                class="p-2.5 rounded-xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 hover:bg-indigo-100/50 flex items-center gap-2 transition"
              >
                <span class="text-lg">🧒</span>
                <div class="min-w-0">
                  <p class="font-bold text-xs text-gray-900 truncate">Kids Check-In</p>
                  <p class="text-[10px] text-gray-500 truncate">Attendance kiosk</p>
                </div>
              </NuxtLink>

              <NuxtLink
                to="/dashboard"
                @click="isMoreOpen = false"
                class="p-2.5 rounded-xl border border-purple-200/80 bg-gradient-to-br from-purple-50/60 to-pink-50/40 hover:bg-purple-100/50 flex items-center gap-2 transition"
              >
                <span class="text-lg">📊</span>
                <div class="min-w-0">
                  <p class="font-bold text-xs text-gray-900 truncate">Dashboard</p>
                  <p class="text-[10px] text-gray-500 truncate">Metrics & reports</p>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Quick Utilities & Settings -->
          <div class="space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-1 pt-1">
              Account & Navigation
            </span>

            <NuxtLink
              to="/"
              @click="isMoreOpen = false"
              class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 text-gray-700 font-medium text-xs transition"
            >
              <span class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-sm">🏠</span>
              <span>All Services Directory</span>
            </NuxtLink>

            <NuxtLink
              v-if="user"
              to="/profile"
              @click="isMoreOpen = false"
              class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 text-gray-700 font-medium text-xs transition"
            >
              <span class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">👤</span>
              <span>My Profile</span>
            </NuxtLink>

            <NuxtLink
              v-if="user"
              to="/settings"
              @click="isMoreOpen = false"
              class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 text-gray-700 font-medium text-xs transition"
            >
              <span class="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm">⚙️</span>
              <span>Preferences & Settings</span>
            </NuxtLink>

            <NuxtLink
              v-if="isAdmin"
              to="/admin"
              @click="isMoreOpen = false"
              class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50 text-amber-900 font-medium text-xs transition border border-amber-200/60"
            >
              <span class="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm">🔒</span>
              <span>Admin Management Panel</span>
            </NuxtLink>
          </div>

          <!-- Auth Actions -->
          <div class="pt-2 border-t border-gray-100">
            <button
              v-if="user"
              type="button"
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
            <NuxtLink
              v-else
              to="/login"
              @click="isMoreOpen = false"
              class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-xs hover:shadow transition"
            >
              <span>Staff Login</span>
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { h, ref, computed } from 'vue'

const route = useRoute()
const { user, logout, isAdmin } = useAuth()
const isMoreOpen = ref(false)

// Don't show bottom nav on login or landing page
const showNav = computed(() => {
  return route.path !== '/login'
})

function isActive(path?: string): boolean {
  if (!path) return false
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

async function handleLogout() {
  isMoreOpen.value = false
  await logout()
}

// Minimal inline SVG Icon helpers
const HomeIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
  ])

const FlameIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' }),
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z' })
  ])

const UsersIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
  ])

const PlusIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2.5', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4v16m8-8H4' })
  ])

const VisitorsIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M18 9v3m0 0v3m0-3h3m-3 0h-3M9 7a3 3 0 110 6 3 3 0 010-6zM4 20a5 5 0 0110 0' })
  ])

const CheckinIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
    h('circle', { cx: '9', cy: '7', r: '3' }),
    h('path', { d: 'M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2', 'stroke-linecap': 'round' }),
    h('path', { d: 'M16 11l2 2 4-4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
  ])

const AttendanceIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' })
  ])

const MoreIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
    h('circle', { cx: '5', cy: '12', r: '1.5' }),
    h('circle', { cx: '12', cy: '12', r: '1.5' }),
    h('circle', { cx: '19', cy: '12', r: '1.5' })
  ])

// Context-aware bottom tabs
interface NavTab {
  id: string
  label: string
  to?: string
  action?: () => void
  icon: any
  isCta?: boolean
  badge?: string | number
}

const tabs = computed<NavTab[]>(() => {
  const path = route.path

  // 1. Souls Outreach Portal
  if (path.startsWith('/souls')) {
    return [
      { id: 'home', label: 'Home', to: '/', icon: HomeIcon },
      { id: 'souls', label: 'Souls', to: '/souls', icon: FlameIcon },
      { id: 'field', label: 'Log Soul', to: '/souls/register', icon: PlusIcon, isCta: true },
      { id: 'teams', label: 'Teams', to: '/souls/teams', icon: UsersIcon },
      { id: 'more', label: 'More', action: () => { isMoreOpen.value = !isMoreOpen.value }, icon: MoreIcon }
    ]
  }

  // 2. Adult Visitors Portal
  if (path.startsWith('/adult')) {
    return [
      { id: 'home', label: 'Home', to: '/', icon: HomeIcon },
      { id: 'visitors', label: 'Visitors', to: '/adult', icon: VisitorsIcon },
      { id: 'register', label: 'New Guest', to: '/adult/register', icon: PlusIcon, isCta: true },
      { id: 'souls', label: 'Souls', to: '/souls', icon: FlameIcon },
      { id: 'more', label: 'More', action: () => { isMoreOpen.value = !isMoreOpen.value }, icon: MoreIcon }
    ]
  }

  // 3. General / Kids Ministry
  return [
    { id: 'home', label: 'Home', to: '/', icon: HomeIcon },
    { id: 'checkin', label: 'Check-In', to: '/checkin', icon: CheckinIcon },
    { id: 'attendance', label: 'Attendance', to: '/attendance', icon: AttendanceIcon },
    { id: 'souls', label: 'Souls', to: '/souls', icon: FlameIcon },
    { id: 'more', label: 'More', action: () => { isMoreOpen.value = !isMoreOpen.value }, icon: MoreIcon }
  ]
})
</script>
