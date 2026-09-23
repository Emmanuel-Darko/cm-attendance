<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="max-w-3xl mx-auto px-4 py-8">
      <NuxtLink
        to="/dashboard"
        class="inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-white/80 backdrop-blur-sm text-indigo-700 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-indigo-100 group"
      >
        <svg class="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-medium">Back</span>
      </NuxtLink>

      <!-- Profile Settings Card -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden mb-6">
        <div class="relative h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="absolute -bottom-10 left-8">
            <div class="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-white overflow-hidden">
              <span class="text-3xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {{ initials }}
              </span>
            </div>
          </div>
        </div>

        <div class="pt-14 pb-8 px-8">
          <div class="flex items-center gap-2 mb-6">
            <div class="h-8 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
            <h2 class="text-xl font-bold text-gray-900">Profile Information</h2>
          </div>

          <form @submit.prevent="updateProfile" class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                v-model="form.full_name"
                type="text"
                class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm font-medium"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <input
                :value="form.email"
                type="email"
                disabled
                class="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-500 cursor-not-allowed"
              />
              <p class="mt-1 text-xs text-gray-400">Email cannot be changed</p>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Contact Number</label>
              <input
                v-model="form.contact"
                type="text"
                placeholder="e.g. +1 555-0123"
                class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm font-medium"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Gender</label>
              <select
                v-model="form.gender"
                class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm font-medium"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date of Birth</label>
              <input
                v-model="form.dob"
                type="date"
                class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm font-medium"
              />
            </div>
            <div class="flex items-end">
              <button
                type="submit"
                :disabled="profileProcessing"
                class="w-full px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              >
                <svg v-if="profileProcessing" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{{ profileProcessing ? 'Saving...' : 'Save Changes' }}</span>
              </button>
            </div>
          </form>
          <p v-if="profileMessage" class="mt-4 text-sm font-medium" :class="profileError ? 'text-red-600' : 'text-green-600'">
            {{ profileMessage }}
          </p>
        </div>
      </div>

      <!-- Password Change Card -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        <div class="relative h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500">
          <div class="absolute inset-0 bg-black/10"></div>
        </div>
        <div class="px-8 py-6">
          <div class="flex items-center gap-2 mb-6">
            <div class="h-8 w-1 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
            <h2 class="text-xl font-bold text-gray-900">Change Password</h2>
          </div>

          <form @submit.prevent="changePassword" class="grid grid-cols-1 gap-5 max-w-md">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Current Password</label>
              <input
                v-model="passwordForm.current"
                type="password"
                placeholder="Enter current password"
                class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-sm font-medium"
                required
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
              <input
                v-model="passwordForm.newPass"
                type="password"
                placeholder="At least 6 characters"
                class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-sm font-medium"
                required
                minlength="6"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <input
                v-model="passwordForm.confirm"
                type="password"
                placeholder="Re-enter new password"
                class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-sm font-medium"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                :disabled="passProcessing"
                class="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm flex items-center gap-2"
              >
                <svg v-if="passProcessing" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{{ passProcessing ? 'Updating...' : 'Update Password' }}</span>
              </button>
            </div>
          </form>
          <p v-if="passMessage" class="mt-4 text-sm font-medium" :class="passError ? 'text-red-600' : 'text-green-600'">
            {{ passMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { user } = useAuth()
const initials = ref('')
const profileProcessing = ref(false)
const profileMessage = ref('')
const profileError = ref(false)

const form = reactive({
  full_name: '',
  email: '',
  contact: '',
  gender: '',
  dob: ''
})

const passwordForm = reactive({
  current: '',
  newPass: '',
  confirm: ''
})

const passProcessing = ref(false)
const passMessage = ref('')
const passError = ref(false)

function getInitials(name: string) {
  return name ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '?'
}

onMounted(() => {
  if (user.value) {
    form.full_name = user.value.name || user.value.full_name || ''
    form.email = user.value.email || ''
    form.contact = user.value.contact || ''
    form.gender = user.value.gender || ''
    form.dob = user.value.dob ? formatDateForInput(user.value.dob) : ''
    initials.value = getInitials(form.full_name)
  }
})

function formatDateForInput(ts: number | string) {
  if (!ts) return ''
  const d = typeof ts === 'number' ? new Date(ts) : new Date(ts)
  return d.toISOString().split('T')[0]
}

async function updateProfile() {
  profileProcessing.value = true
  profileMessage.value = ''
  profileError.value = false

  const authUserId = user.value?.user_id || user.value?.userId || user.value?.id
  if (!authUserId) {
    profileError.value = true
    profileMessage.value = 'User ID not available'
    profileProcessing.value = false
    return
  }

  try {
    const res = await $fetch('/api/admin/profile/update', {
      method: 'POST',
      body: {
        user_id: authUserId,
        full_name: form.full_name,
        contact: form.contact,
        gender: form.gender || null,
        dob: form.dob || null
      }
    }) as { success?: boolean; message?: string }

    if (res?.success) {
      profileMessage.value = 'Profile updated successfully'
      // Update local user data and persist to localStorage
      if (user.value) {
        user.value.name = form.full_name
        user.value.full_name = form.full_name
        user.value.contact = form.contact
        user.value.gender = form.gender
        user.value.dob = form.dob
        localStorage.setItem('user', JSON.stringify(user.value))
      }
    } else {
      throw new Error(res?.message || 'Failed to update profile')
    }
  } catch (e: any) {
    profileError.value = true
    profileMessage.value = e?.data?.statusMessage || e?.statusMessage || e?.message || 'Failed to update profile'
  } finally {
    profileProcessing.value = false
  }
}

async function changePassword() {
  passMessage.value = ''
  passError.value = false

  if (passwordForm.newPass !== passwordForm.confirm) {
    passError.value = true
    passMessage.value = 'New passwords do not match'
    return
  }

  if (passwordForm.newPass.length < 6) {
    passError.value = true
    passMessage.value = 'New password must be at least 6 characters'
    return
  }

  passProcessing.value = true

  const authUserId = user.value?.user_id || user.value?.userId || user.value?.id
  if (!authUserId) {
    passError.value = true
    passMessage.value = 'User ID not available'
    passProcessing.value = false
    return
  }

  try {
    const res = await $fetch('/api/admin/profile/password', {
      method: 'POST',
      body: {
        user_id: authUserId,
        current_password: passwordForm.current,
        new_password: passwordForm.newPass
      }
    }) as { success?: boolean; message?: string }

    if (res?.success) {
      passMessage.value = 'Password changed successfully'
      passwordForm.current = ''
      passwordForm.newPass = ''
      passwordForm.confirm = ''
    } else {
      throw new Error(res?.message || 'Failed to change password')
    }
  } catch (e: any) {
    passError.value = true
    passMessage.value = e?.data?.statusMessage || e?.statusMessage || e?.message || 'Failed to change password'
  } finally {
    passProcessing.value = false
  }
}
</script>
