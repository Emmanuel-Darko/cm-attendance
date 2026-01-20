<script setup lang="ts">
import type { Database } from '~/types/database'

const { records, getAttendance, getRecords } = await useAttendance()
const { sessions, fetchSessions } = useSessions()

const loading = ref(true)
const error = ref<any>(null)

const attendance = ref<any[]>([])
const sessionKids = ref<Database['public']['Tables']['session_kids']['Row'][]>([])

const searchTerm = ref('')
const showExportMenu = ref(false)
const exportingFormat = ref<string | null>(null)

const localId = computed(() => useAuth().user?.value?.local_id)

/**
* --------------------------------------------
* Kid lookup (fast + safe)
* --------------------------------------------
*/
const kidMap = computed(() => {
  const map = new Map<string, Database['public']['Tables']['kids']['Row']>()
  records.value.forEach(kid => map.set(kid.id, kid))
  return map
})

/**
 * --------------------------------------------
 * GROUP BY SESSION (SNAPSHOT SAFE)
 * --------------------------------------------
 */
function groupBySession(data: any[]) {
  const grouped: Record<string, any> = {}

  // 1️⃣ Group present attendance
  for (const item of data) {
    if (!grouped[item.session_id]) {
      grouped[item.session_id] = {
        present: [],
        presentIds: new Set<string>()
      }
    }

    grouped[item.session_id].present.push(item)
    grouped[item.session_id].presentIds.add(item.kid_id)
  }

  // 2️⃣ Build final session objects
  return Object.entries(grouped).map(([session_id, info]) => {
    const snapshotKids = sessionKids.value.filter(
      sk => sk.session_id === session_id
    )
    console.log(info)

    const absentKids = snapshotKids
      .filter(sk => !info.presentIds.has(sk.kid_id))
      .map(sk => kidMap.value.get(sk.kid_id))
      .filter(Boolean)

    return {
      session_id,
      attendance: info.present.sort(
        (a, b) =>
          new Date(a.checkin_time).getTime() -
          new Date(b.checkin_time).getTime()
      ),
      absentKids,
      total: snapshotKids.length,
      sessionDate: findSession(session_id)?.created_at || ''
    }
  }).sort(
    (a, b) =>
      new Date(b.sessionDate).getTime() -
      new Date(a.sessionDate).getTime()
  )
}

/**
 * --------------------------------------------
 * SEARCH (unchanged behavior)
 * --------------------------------------------
 */
const filteredAttendance = computed(() => {
  if (!searchTerm.value.trim()) return attendance.value

  const key = searchTerm.value.toLowerCase()
  return attendance.value.filter(item => {
    const kid = kidMap.value.get(item.kid_id)
    return (
      kid?.full_name?.toLowerCase().includes(key) ||
      kid?.id?.toLowerCase().includes(key)
    )
  })
})

/**
 * --------------------------------------------
 * HELPERS (unchanged)
 * --------------------------------------------
 */
const findSession = (id: string) =>
  sessions.value.find(s => s.id === id)

const findKid = (id: string) =>
  kidMap.value.get(id)

/**
 * --------------------------------------------
 * INIT
 * --------------------------------------------
 */
onMounted(async () => {
  try {
    attendance.value = await getAttendance()
    await fetchSessions()
    await getRecords()
    sessionKids.value = await $fetch('/api/admin/kids/session', {
      method: 'POST',
      body: { local_id: localId.value }
    })
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.export-dropdown-container')) {
    showExportMenu.value = false
  }
}

/**
 * 📤 EXPORT HELPERS
 */
function downloadFile(blob: Blob, filename: string) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * CSV EXPORT
 */
function exportToCSV() {
  exportingFormat.value = 'csv'

  const rows = [
    ['Session', 'Date', 'Status', 'Name', 'Age', 'Kid ID', 'Check-in Time'],
  ]

  groupBySession(filteredAttendance.value).forEach(session => {
    const s = findSession(session.session_id)

    session.attendance.forEach(item => {
      const kid = findKid(item.kid_id)
      rows.push([
        s?.title ?? 'Unknown',
        s?.date ?? '',
        'Present',
        kid?.full_name ?? '',
        getAge(kid?.dob) ?? '',
        item.kid_id,
        new Date(item.checkin_time).toLocaleString(),
      ])
    })

    session.absentKids.forEach(kid => {
      rows.push([
        s?.title ?? 'Unknown',
        s?.date ?? '',
        'Absent',
        kid.full_name,
        getAge(kid.dob) ?? '',
        kid.id,
        '-',
      ])
    })
  })

  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  downloadFile(new Blob([csv]), `attendance_${Date.now()}.csv`)

  exportingFormat.value = null
  showExportMenu.value = false
}

/**
 * EXCEL EXPORT
 */
function exportToExcel() {
  exportingFormat.value = 'excel'
  let html = '<table>'

  groupBySession(filteredAttendance.value).forEach(session => {
    const s = findSession(session.session_id)
    html += `<tr><th colspan="4">${s?.title} (${s?.date})</th></tr>`

    session.attendance.forEach(item => {
      const kid = findKid(item.kid_id)
      html += `<tr>
          <td>Present</td>
          <td>${kid?.full_name}</td>
          <td>${getAge(kid?.dob)}</td>
          <td>${new Date(item.checkin_time).toLocaleTimeString()}</td>
        </tr>`
    })

    session.absentKids.forEach(kid => {
      html += `<tr>
          <td>Absent</td>
          <td>${kid.full_name}</td>
          <td>${getAge(kid.dob)}</td>
          <td>-</td>
        </tr>`
    })
  })

  html += '</table>'
  downloadFile(new Blob([html]), `attendance_${Date.now()}.xls`)
  exportingFormat.value = null
  showExportMenu.value = false
}

/**
 * PDF EXPORT
 */
function exportToPDF() {
  exportingFormat.value = 'pdf'
  let html = `<h1>Attendance Report</h1>`

  groupBySession(filteredAttendance.value).forEach(session => {
    const s = findSession(session.session_id)
    html += `<h2>${s?.title} (${s?.date})</h2>`
    html += `<p>Present: ${session.attendance.length} / ${session.totalKids}</p>`
  })

  const win = window.open('', '_blank')
  win?.document.write(html)
  win?.print()

  exportingFormat.value = null
  showExportMenu.value = false
}
</script>


<template>
  <div class="max-w-4xl mx-auto p-4">
    <NuxtLink to="/"
      class="inline-flex items-center mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </NuxtLink>
    <h1 class="text-3xl font-bold mb-6 text-center text-indigo-700">Attendance Records</h1>

    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <input v-model="searchTerm" type="text" placeholder="Search by name, age or ID"
        class="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />

      <!-- Export Dropdown -->
      <div class="relative export-dropdown-container">
        <button @click="showExportMenu = !showExportMenu"
          class="px-6 py-3 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'rotate-180': showExportMenu }" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" style="transition: transform 0.2s">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div v-if="showExportMenu"
          class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden">
          <div>
            <button @click="exportToCSV" :disabled="exportingFormat !== null"
              class="w-full px-4 py-3 text-left hover:bg-indigo-50 transition flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
              <div class="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="font-semibold text-gray-800">CSV File</div>
                <div class="text-xs text-gray-500">Best for spreadsheets & data analysis</div>
              </div>
              <span v-if="exportingFormat === 'csv'" class="text-indigo-600">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
              </span>
            </button>

            <button @click="exportToExcel" :disabled="exportingFormat !== null"
              class="w-full px-4 py-3 text-left hover:bg-indigo-50 transition flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
              <div class="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="font-semibold text-gray-800">Excel File</div>
                <div class="text-xs text-gray-500">Opens directly in Microsoft Excel</div>
              </div>
              <span v-if="exportingFormat === 'excel'" class="text-indigo-600">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
              </span>
            </button>

            <button @click="exportToPDF" :disabled="exportingFormat !== null"
              class="w-full px-4 py-3 text-left hover:bg-indigo-50 transition flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
              <div class="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="font-semibold text-gray-800">PDF Document</div>
                <div class="text-xs text-gray-500">Print-ready formatted report download</div>
              </div>
              <span v-if="exportingFormat === 'pdf'" class="text-indigo-600">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center text-gray-600">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center">Error: {{ error.message }}</div>

    <div v-else>
      <div v-if="groupBySession(filteredAttendance).length === 0" class="text-center text-gray-500 py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-4 h-12 w-12 text-gray-300" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-2a4 4 0 00-4-4h-1a4 4 0 00-4 4v2m6-6V7a4 4 0 10-8 0v4" />
        </svg>
        <div class="text-lg">No attendance records found.</div>
        <div class="text-sm text-gray-400">Try adjusting your search or check back later.</div>
      </div>
      <div v-else>
        <div v-for="session in groupBySession(filteredAttendance)" :key="session.session_id" class="mb-10">
          <!-- Session Header -->
          <div class="bg-gray-100 rounded-lg shadow-md p-6 mb-4">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">
                  {{ findSession(session.session_id)?.title }}
                </h2>
                <p class="text-gray-500 text-sm mt-1">{{ findSession(session.session_id)?.date }}</p>
              </div>
              <div class="flex gap-4 items-center">
                <span v-if="findSession(session.session_id)?.is_open"
                  class="inline-block px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
                  🟢 Open
                </span>
                <span v-else class="inline-block px-3 py-1 text-sm font-semibold text-red-700 bg-red-100 rounded-full">
                  🔴 Closed
                </span>
                <div class="text-sm text-gray-600">
                  <span class="font-semibold">{{ session.attendance.length }}</span> / {{ session.total }} present
                </div>
              </div>
            </div>
          </div>

          <!-- Present and Absent Cards Side by Side -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Present Students -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <div class="bg-green-50 border-b border-green-100 px-6 py-4">
                <h3 class="text-lg font-semibold text-green-800 flex items-center gap-2">
                  <span class="text-2xl">✓</span>
                  Present ({{ session.attendance.length }})
                </h3>
              </div>
              <div class="max-h-96 overflow-y-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 sticky top-0">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Age</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="item, index in session.attendance" :key="item.id" class="hover:bg-green-50 transition">
                      <td class="px-4 py-3 text-sm text-gray-600">{{ Number(index) + 1 }}</td>
                      <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ findKid(item.kid_id)?.full_name }}</td>
                      <td class="px-4 py-3 text-sm text-gray-600">
                        {{
                          (() => {
                            const dob = findKid(item.kid_id)?.dob;
                            return dob ? getAge(new Date(dob)) : "";
                          })()
                        }}
                      </td>
                      <td class="px-4 py-3 text-xs text-gray-500">
                        {{
                          item.checkin_time
                            ? new Date(item.checkin_time).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : ''
                        }}
                      </td>
                    </tr>
                    <tr v-if="session.attendance.length === 0">
                      <td colspan="4" class="px-4 py-8 text-center text-gray-400 italic">
                        No students present
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Absent Students -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <div class="bg-red-50 border-b border-red-100 px-6 py-4">
                <h3 class="text-lg font-semibold text-red-800 flex items-center gap-2">
                  <span class="text-2xl">✗</span>
                  Absent ({{ session.absentKids.length }})
                </h3>
              </div>
              <div class="max-h-96 overflow-y-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 sticky top-0">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Age</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr
                      v-for="(kid, index) in session.absentKids"
                      :key="kid?.id ?? index"
                      class="hover:bg-red-50 transition"
                    >
                      <td class="px-4 py-3 text-sm text-gray-600">{{ Number(index) + 1 }}</td>
                      <td class="px-4 py-3 text-sm font-medium text-gray-800">
                        {{ kid?.full_name ?? "" }}
                      </td>
                      <td class="px-4 py-3 text-sm text-gray-600">
                        {{
                          (() => {
                            const dob = kid?.dob;
                            return dob ? getAge(new Date(dob)) : "";
                          })()
                        }}
                      </td>
                    </tr>
                    <tr v-if="session.absentKids.length === 0">
                      <td colspan="3" class="px-4 py-8 text-center text-gray-400 italic">
                        All students present! 🎉
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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

  th,
  td {
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
