<template>
    <div
      class="min-h-screen py-10"
      style="
        background:
          url('https://raw.githubusercontent.com/Emmanuel-Darko/images/main/kids.webp') no-repeat center bottom,
          linear-gradient(to bottom right, #eff6ff, #c7d2fe);
        background-size: 400px, cover;
      "
    >
    <div class="max-w-4xl mx-auto p-10">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-indigo-700 mb-2 drop-shadow"> CM Attendance System 📊</h1>
        <p class="text-lg text-gray-600">Effortless attendance management for Children's Ministry</p>
      </div>
      <div class="grid md:grid-cols-2 gap-8">
        <AppHomeCard
          v-for="card in appCards"
          :to="card.to"
          :icon="card.icon"
          :title="card.title"
          :description="card.description"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const qrUrl = ref<string>('')

  const appCards = [
    {
      to:"/checkin",
      icon:"📷",
      title:"QR Check-In",
      description:"Scan QR codes to mark attendance"
    },
    {
      to:"/admin/kids",
      icon:"🔗",
      title:"Generate QR Code",
      description:"Create QR codes for attendance"
    },
    {
      to:"/admin/sessions",
      icon:"📅",
      title:"Manage Sessions",
      description:"Create and close attendance sessions"
    },
    {
      to:"/admin/attendance",
      icon:"📝",
      title:"Attendance Records",
      description:"View and export attendance data"
    },
  ]

  onMounted(async () => qrUrl.value = await useQrGenerator(location.href as string))
</script> 