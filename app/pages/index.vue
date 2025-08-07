<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
    <div class="max-w-4xl mx-auto p-4">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-indigo-700 mb-2 drop-shadow"> CM Attendance System 📊</h1>
        <p class="text-lg text-gray-600">Effortless attendance management for Children's Ministry</p>
      </div>
      <div class="grid md:grid-cols-2 gap-8">
        <NuxtLink to="/checkin" class="group">
          <div class="p-8 bg-white rounded-2xl shadow-lg border-t-4 hover:border-indigo-400 hover:scale-105 transition-transform">
            <div class="flex justify-center mb-4">
              <span class="text-5xl">📷</span>
            </div>
            <h2 class="text-xl font-bold text-indigo-700 mb-2">QR Check-In</h2>
            <p class="text-gray-500">Scan QR codes to mark attendance</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/admin/kids" class="group">
          <div class="p-8 bg-white rounded-2xl shadow-lg border-t-4 hover:border-indigo-400 hover:scale-105 transition-transform">
            <div class="flex justify-center mb-4">
              <span class="text-5xl">🔗</span>
            </div>
            <h2 class="text-xl font-bold text-indigo-700 mb-2">Generate QR Code</h2>
            <p class="text-gray-500">Create QR codes for attendance</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/admin/sessions" class="group">
          <div class="p-8 bg-white rounded-2xl shadow-lg border-t-4 hover:border-indigo-400 hover:scale-105 transition-transform">
            <div class="flex justify-center mb-4">
              <span class="text-5xl">📅</span>
            </div>
            <h2 class="text-xl font-bold text-indigo-700 mb-2">Manage Sessions</h2>
            <p class="text-gray-500">Create and close attendance sessions</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/admin/attendance" class="group">
          <div class="p-8 bg-white rounded-2xl shadow-lg border-t-4 hover:border-indigo-400 hover:scale-105 transition-transform">
            <div class="flex justify-center mb-4">
              <span class="text-5xl">📝</span>
            </div>
            <h2 class="text-xl font-bold text-indigo-700 mb-2">Attendance Records</h2>
            <p class="text-gray-500">View and export attendance data</p>
          </div>
        </NuxtLink>
      </div>
      <div class="mt-14 flex flex-col items-center">
        <span class="mb-2 text-gray-600 font-medium">Quick Access QR</span>
        <div class="bg-white p-4 rounded-xl shadow-lg border-2 border-indigo-200">
          <img :src="qrUrl" alt="QR Code" class="w-40 h-40 object-contain" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const qrUrl = ref<string>('')

  onMounted(async () => qrUrl.value = await useQrGenerator(location.href as string))
</script> 