<!-- <template>
    <div class="max-w-4xl mx-auto py-10 px-4">
      <h1 class="text-3xl font-bold text-center mb-8 text-slate-800">
        Admin Dashboard ⚙️
      </h1>
  
      <div class="grid md:grid-cols-2 gap-6">
        <AdminCard title="Add Local" description="Register a new local branch" @click="showModal(AddLocalModal)" />
        <AdminCard title="Add Teacher" description="Register a teacher under a local" @click="showModal(AddTeacherModal)" />
        <AdminCard 
          title="View Locals" 
          description="Manage existing locals"
          @click="navigateTo('/admin/locals')" 
        />
        <AdminCard 
          title="View Teachers" 
          description="Manage all teachers" 
          @click="navigateTo('/admin/teachers')" 
        />
      </div>
    </div>
</template>

<script setup lang="ts">
  import AdminCard from '../../components/AdminCard.vue'
  import AddLocalModal from '../../components/modals/AddLocalModal.vue'
  import AddTeacherModal from '../../components/modals/AddTeacherModal.vue'

  const  { showModal } = useCommon()
</script> -->


<script setup lang="ts">
const { data: locals } = await useFetch('/api/admin/locals')
const { data: teachers } = await useFetch('/api/admin/teachers')
const { data: kids } = await useFetch('/api/admin/kids')
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">Admin Dashboard</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink
        v-for="card in [
          { title: 'Locals', count: locals?.length, to: '/admin/locals', color: 'bg-blue-100 text-blue-700' },
          { title: 'Teachers', count: teachers?.length, to: '/admin/teachers', color: 'bg-green-100 text-green-700' },
          { title: 'Kids', count: kids?.length, to: '/admin/kids', color: 'bg-yellow-100 text-yellow-700' }
        ]"
        :key="card.title"
        :to="card.to"
        class="p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100 flex flex-col items-center justify-center gap-2"
        :class="card.color"
      >
        <div class="text-4xl font-bold">{{ card.count ?? 0 }}</div>
        <div class="text-lg font-semibold">{{ card.title }}</div>
      </NuxtLink>
    </div>
  </div>
</template>
