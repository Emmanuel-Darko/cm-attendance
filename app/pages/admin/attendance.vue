<script setup lang="ts">
  import type { Database } from '#build/types/supabase-database'
  import { ref, computed, onMounted } from 'vue'

  const { records, getAttendance, getRecords } = await useAttendance()
  const { sessions, fetchSessions } = await useSessions()
  const loading = ref(true)
  const error = ref<any>(null)
  const attendance = ref<Database[] | any[]>([])
  const search = ref('')

  // Filter the kids (records), not the attendance
  // Filter attendance by kid name or kid id
  const filteredAttendance = computed(() => {
    if (!search.value.trim()) return attendance.value
    return attendance.value.filter(item => {
      const kid = records.value.find(k => k.id === item.kid_id)
      const name = kid?.full_name?.toLowerCase() || ''
      const age = String(kid?.age)?.toLowerCase() || ''
      const id = kid.id?.toLowerCase() || ''
      const searchTerm = search.value.toLowerCase()
      return name.includes(searchTerm) || age.includes(searchTerm) || id.includes(searchTerm.toLowerCase())
    })
  })

  function groupBySession(data: any[]) {
    const grouped: Record<string, any[]> = {}

    for (const item of data) {
      const session = item.session_id || 'Unknown Session'
      if (!grouped[session]) grouped[session] = []
      grouped[session].push(item)
      // Sort attendance in this session by ascending checkin_time
      grouped[session].sort((a, b) => new Date(a.checkin_time).getTime() - new Date(b.checkin_time).getTime());
    }

    // Sort sessions by date (most recent first)
    return Object.entries(grouped)
      .map(([session_id, attendance]) => ({
        session_id,
        attendance,
        // Attach session date for sorting
        sessionDate: findSession(session_id)?.created_at || ''
      }))
      .sort((a, b) => {
        // Sort descending by date
        return new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime();
      })
  }

  const findSession = (sessionId: string) => {
    return sessions.value.find((session) => session.id == sessionId)
  }

  const findKid = (kid_id: string) => {
    return records.value.find((kid) => kid.id == kid_id)
  }
 
  function exportToCSV() {
    const rows = [
      ['Session', 'Name', 'Kid ID', 'Time'],
    ];
    groupBySession(filteredAttendance.value).forEach(session => {
      const sessionInfo = findSession(session.session_id);
      session.attendance.forEach(item => {
        rows.push([
          sessionInfo?.title || session.session_id,
          item.name,
          item.kid_id,
          new Date(item.checkin_time).toLocaleString(),
        ]);
      });
    });
    const csvContent = rows.map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'attendance.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  onMounted(async () => {
    try {
      attendance.value = await getAttendance()
      await fetchSessions()
      await getRecords()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  })
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <NuxtLink to="/" class="inline-flex items-center mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
      Back
    </NuxtLink>
    <h1 class="text-3xl font-bold mb-6 text-center text-indigo-700">Attendance Records</h1>

    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search by name, age or ID"
        class="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
      <button @click="exportToCSV" class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition">Export CSV</button>
    </div>

    <div v-if="loading" class="text-center text-gray-600">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center">Error: {{ error.message }}</div>

    <div v-else>
      <div v-if="groupBySession(filteredAttendance).length === 0" class="text-center text-gray-500 py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-4 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-2a4 4 0 00-4-4h-1a4 4 0 00-4 4v2m6-6V7a4 4 0 10-8 0v4" /></svg>
        <div class="text-lg">No attendance records found.</div>
        <div class="text-sm text-gray-400">Try adjusting your search or check back later.</div>
      </div>
      <div v-else>
        <div
          v-for="session in groupBySession(filteredAttendance)"
          :key="session.session_id"
          class="mb-8"
        >
          <h2 class="text-xl font-semibold text-indigo-600 mb-3">
            {{ findSession(session.session_id)?.title }} ({{ findSession(session.session_id)?.date }})
            <span
              v-if="findSession(session.session_id)?.is_open"
              class="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded"
            >
              Open
            </span>
            <span
              v-else
              class="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded"
            >
              Closed
            </span>
          </h2>
          <div class="overflow-x-auto w-full">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100 sticky-header">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">No.</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Age</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-gray-600">Time</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item,index in session.attendance" :key="item.id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ findKid(item.kid_id)?.full_name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ findKid(item.kid_id)?.age }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ new Date(item.checkin_time).toLocaleString() }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  background: #f3f4f6;
  z-index: 2;
}

.overflow-x-auto {
  overflow-x: auto;
}

@media (max-width: 640px) {
  table.min-w-full {
    font-size: 13px;
  }
  th, td {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
    white-space: normal !important;
    word-break: break-word;
  }
  .mb-8 {
    margin-bottom: 1.5rem !important;
  }
}
</style>
