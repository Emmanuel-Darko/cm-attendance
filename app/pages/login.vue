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
    <div class="relative flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 overflow-hidden" style="min-height: 100dvh;">
      <!-- Animated Background Blobs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl animate-blob"></div>
        <div class="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/15 to-indigo-400/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
  
      <!-- Login Card -->
      <div class="relative z-10 w-full max-w-md mx-4 sm:mx-6">
        <div class="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
          <!-- Logo/Brand Section -->
          <div class="text-center mb-6 sm:mb-8">
            <div class="inline-flex items-center justify-center mb-4 sm:mb-6">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-50"></div>
                <div class="relative p-3 sm:p-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
                  <svg class="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 28 28">
                    <ellipse cx="14" cy="11" rx="6.2" ry="6.5" fill="#fff" stroke="currentColor" stroke-width="2"/>
                    <ellipse cx="10.9" cy="12" rx="1.1" ry="1.1" fill="currentColor"/>
                    <ellipse cx="17.2" cy="12" rx="1.1" ry="1.1" fill="currentColor"/>
                    <ellipse cx="14" cy="15.2" rx="2.3" ry="0.8" fill="rgba(255,255,255,0.5)"/>
                    <path d="M8 21.2c1.3-3 9.8-3.2 11.1 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3">
              <span class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Kids Check-In
              </span>
            </h1>
            <p class="text-sm sm:text-base text-gray-600 font-medium px-2">
              Secure, joyful, and effortless church attendance for every family
            </p>
          </div>
  
          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-4 sm:space-y-5">
            <!-- Email Field -->
            <div class="space-y-2">
              <label for="login-email" class="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-semibold">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              <div class="relative">
                <input
                  id="login-email"
                  v-model="email"
                  placeholder="you@email.com"
                  type="email"
                  autocomplete="username"
                  required
                  class="w-full px-4 py-2.5 sm:py-3 bg-white/70 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all placeholder:text-gray-400 text-sm sm:text-base font-medium"
                />
              </div>
            </div>
  
            <!-- Password Field -->
            <div class="space-y-2">
              <label for="login-password" class="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-semibold">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <div class="relative">
                <input
                  id="login-password"
                  v-model="password"
                  placeholder="Enter your password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="w-full px-4 py-2.5 sm:py-3 bg-white/70 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all placeholder:text-gray-400 text-sm sm:text-base font-medium"
                />
              </div>
            </div>
  
            <!-- Error Message -->
            <div v-if="errMsg" class="bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-shake">
              <div class="flex items-center gap-2 text-red-700">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm sm:text-base font-medium">{{ errMsg }}</p>
              </div>
            </div>
  
            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="submitting || loading"
              class="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-lg sm:rounded-xl py-3 sm:py-3.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center shadow-xl hover:shadow-2xl hover:scale-105 text-base sm:text-lg gap-2 border border-white/20"
            >
              <loaderIcon v-if="submitting || loading" />
              <span v-else class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </span>
            </button>
          </form>
  
          <!-- Footer -->
          <div class="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
            <p class="text-center text-xs sm:text-sm text-gray-500">
              &copy; {{ new Date().getFullYear() }} 
              <span class="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Kids Check-In
              </span>
              <br class="sm:hidden">
              <span class="hidden sm:inline"> &mdash; </span>
              Made with 
              <span class="text-red-500">❤</span> by 
              <span class="font-semibold text-gray-700">&lt;Kode/&gt;</span>
            </p>
          </div>
        </div>
  
        <!-- Decorative Elements -->
        <div class="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-2xl opacity-50"></div>
        <div class="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-50"></div>
      </div>
    </div>
  </template>
  
  <style scoped>
  @keyframes blob {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }
  
  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    75% {
      transform: translateX(5px);
    }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  
  .animate-shake {
    animation: shake 0.3s ease-in-out;
  }
  </style>