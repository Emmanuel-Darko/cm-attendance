<script setup>
import { ref } from 'vue'
const { login, error, loading } = useAuth()
const email = ref('')
const password = ref('')

const submitting = ref(false)
const errMsg = ref('')

// Optionally handle login and errors gracefully
const handleLogin = async () => {
  submitting.value = true
  errMsg.value = ''
  const res = await login(email.value, password.value)
  if (!res && error.value) {
    errMsg.value = error.value
  }
  submitting.value = false
}

definePageMeta({
  layout: 'auth'
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 to-purple-100">
    <div class="bg-white/90 rounded-lg shadow-xl px-8 py-10 w-full max-w-sm">
      <h2 class="text-3xl font-bold text-center text-indigo-700 mb-6">Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="login-email">Email</label>
          <input
            id="login-email"
            v-model="email"
            placeholder="you@email.com"
            type="email"
            autocomplete="username"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="login-password">Password</label>
          <input
            id="login-password"
            v-model="password"
            placeholder="Password"
            type="password"
            autocomplete="current-password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
        </div>
        <div>
          <button
            type="submit"
            :disabled="submitting || loading"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2 px-4 transition disabled:opacity-60 flex justify-center items-center"
          >
            <loaderIcon v-if="submitting || loading" />
            <span>Login</span>
          </button>
        </div>
        <div v-if="errMsg" class="text-red-600 text-center font-medium mt-2">
          {{ errMsg }}
        </div>
      </form>
    </div>
  </div>
</template>
