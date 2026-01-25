<script setup lang="ts">
  import type { Database } from '~/types/database'
  import { useRoute } from 'vue-router'

  const { localKids, getAttendance, getLocalKids } = await useAttendance()
  const { sessions, fetchSessions } = useSessions()
  
  const loading = ref(true)
  const error = ref<any>(null)
  
  const attendance = ref<any[]>([])
  const sessionKids = ref<Database['public']['Tables']['session_kids']['Row'][]>([])
  
  const searchTerm = ref('')
  const showExportMenu = ref(false)
  const exportingFormat = ref<string | null>(null)
  
  const localId = computed(() => useAuth().user?.value?.local_id)
  
  const kidMap = computed(() => {
    const map = new Map<string, Database['public']['Tables']['kids']['Row']>()
    localKids.value.forEach(kid => map.set(kid.id, kid))
    return map
  })
  
  function groupBySession(data: any[]) {
    const grouped: Record<string, any> = {}

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

    return Object.entries(grouped).map(([session_id, info]) => {
      const session = findSession(session_id)
      const isSessionOpen = session?.is_open

      let snapshotKids = sessionKids.value.filter(
        sk => sk.session_id === session_id
      )

      // If the session is open, filter out inactive kids (soft deleted)
      if (isSessionOpen) {
        snapshotKids = snapshotKids.filter(sk => {
          const kid = kidMap.value.get(sk.kid_id)
          // Only include kids that are not soft deleted (assume 'active' or 'deleted_at' field)
          // Adjust the property name as per your DB model, 'deleted_at' or 'active'
          if (kid && ('is_active' in kid)) {
            return kid.is_active !== false
          }
          // If using 'deleted_at'
          if (kid && ('deleted_at' in kid)) {
            return kid.deleted_at == null
          }
          // Default to included if property does not exist
          return true
        })
      }

      const absentKids = snapshotKids
        .filter(sk => !info.presentIds.has(sk.kid_id))
        .map(sk => kidMap.value.get(sk.kid_id))
        .filter(Boolean)

      return {
        session_id,
        attendance: info.present.sort(
          (a: { checkin_time: string | number | Date }, b: { checkin_time: string | number | Date }) =>
            new Date(a.checkin_time).getTime() -
            new Date(b.checkin_time).getTime()
        ),
        absentKids,
        total: snapshotKids.length,
        sessionDate: session?.created_at || ''
      }
    }).sort(
      (a, b) =>
        new Date(b.sessionDate).getTime() -
        new Date(a.sessionDate).getTime()
    )
  }
  
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
  
  const findSession = (id: string) =>
    sessions.value.find(s => s.id === id)
  
  const findKid = (id: string) =>
    kidMap.value.get(id)
  
  const route = useRoute()

  /**
   * After loading, if ?session=paramsessionid, scroll page to anchor with id="session-{sessionid}"
   */
  onMounted(async () => {
    try {
      attendance.value = await getAttendance()
      await fetchSessions()
      await getLocalKids({allHistorical: true})
      sessionKids.value = await $fetch('/api/admin/kids/session', {
        method: 'POST',
        body: { local_id: localId.value }
      })
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }

    // Wait until DOM is ready, then scroll to anchor if session param is given
    if (route?.query?.session) {
      // Allow Vue to finish rendering
      nextTick(() => {
        const anchorId = `session-${route.query.session}`
        const el = document.getElementById(anchorId)
        if (el) {
          location.hash = `#${anchorId}` // Actually update href for anchor
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      })
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
  
  function downloadFile(blob: Blob, filename: string) {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  function exportToCSV() {
    exportingFormat.value = 'csv'
  
    const rows = [
      ['Session', 'Date', 'Status', 'Name', 'Age', 'Kid ID', 'Check-in Time'],
    ]
  
    groupBySession(filteredAttendance.value).forEach(session => {
      const s = findSession(session.session_id)
  
      session.attendance.forEach((item:any) => {
        const kid = findKid(item.kid_id)
        rows.push([
          s?.title ?? 'Unknown',
          s?.date ?? '',
          'Present',
          kid?.full_name ?? '',
          getAge(kid?.dob ? new Date(kid.dob) : undefined as unknown as Date) ?? '',
          item.kid_id,
          item.checkin_time ? new Date(item.checkin_time).toLocaleString() : '',
        ])
      })
  
      session.absentKids.forEach(kid => {
        rows.push([
          s?.title ?? 'Unknown',
          s?.date ?? '',
          'Absent',
          kid?.full_name ?? '',
          (getAge(kid?.dob ? new Date(kid.dob) : undefined as unknown as Date) ?? '').toString(),
          kid?.id ?? '',
          '-',
        ])
      })
    })
  
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    downloadFile(new Blob([csv]), `attendance_${Date.now()}.csv`)
  
    exportingFormat.value = null
    showExportMenu.value = false
  }
  
  function exportToExcel() {
    exportingFormat.value = 'excel'
    let html = '<table>'
  
    groupBySession(filteredAttendance.value).forEach(session => {
      const s = findSession(session.session_id)
      html += `<tr><th colspan="4">${s?.title} (${s?.date})</th></tr>`
  
      session.attendance.forEach((item: any) => {
        const kid = findKid(item.kid_id)
        html += `<tr>
            <td>Present</td>
            <td>${kid?.full_name ?? ''}</td>
            <td>${kid?.dob ? getAge(new Date(kid.dob)) : ''}</td>
            <td>${item.checkin_time ? new Date(item.checkin_time).toLocaleTimeString() : ''}</td>
          </tr>`
      })
  
      session.absentKids.forEach(kid => {
        html += `<tr>
            <td>Absent</td>
            <td>${kid?.full_name ?? ''}</td>
            <td>${kid?.dob ? getAge(new Date(kid.dob)) : ''}</td>
            <td>-</td>
          </tr>`
      })
    })
  
    html += '</table>'
    downloadFile(new Blob([html]), `attendance_${Date.now()}.xls`)
    exportingFormat.value = null
    showExportMenu.value = false
  }
  
  function exportToPDF() {
    exportingFormat.value = 'pdf'
    let html = `<h1>Attendance Report</h1>`
  
    groupBySession(filteredAttendance.value).forEach(session => {
      const s = findSession(session.session_id)
      html += `<h2>${s?.title} (${s?.date})</h2>`
      html += `<p>Present: ${session.attendance.length} / ${session.total}</p>`
    })
  
    const win = window.open('', '_blank')
    win?.document.write(html)
    win?.print()
  
    exportingFormat.value = null
    showExportMenu.value = false
  }
  </script>
  
  <template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <!-- Header -->
        <div class="mb-4 sm:mb-6 md:mb-8">
          <NuxtLink to="/" class="group inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-gray-700 hover:text-indigo-600 border border-gray-100">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="font-medium text-sm sm:text-base">Back</span>
          </NuxtLink>
        </div>
  
        <!-- Page Title -->
        <div class="text-center mb-6 sm:mb-8">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Attendance Records
          </h1>
          <p class="text-sm sm:text-base text-gray-600">View and export attendance reports</p>
        </div>
  
        <!-- Search and Export Bar -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-indigo-100/50 p-4 sm:p-6 mb-6 sm:mb-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <!-- Search Bar -->
            <div class="relative flex-1 max-w-md">
              <svg class="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Search by child name"
                class="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>
  
            <!-- Export Dropdown -->
            <div class="relative export-dropdown-container">
              <button
                @click="showExportMenu = !showExportMenu"
                class="w-full md:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold text-sm sm:text-base hover:scale-105"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export</span>
                <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showExportMenu }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
  
              <!-- Dropdown Menu -->
              <div
                v-if="showExportMenu"
                class="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
              >
                <button
                  @click="exportToCSV"
                  :disabled="exportingFormat !== null"
                  class="w-full px-4 py-3 text-left hover:bg-indigo-50 transition flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div class="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg flex-shrink-0">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-gray-800 text-sm">CSV File</div>
                    <div class="text-xs text-gray-500 truncate">Spreadsheets & data analysis</div>
                  </div>
                  <span v-if="exportingFormat === 'csv'" class="text-indigo-600">
                    <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                </button>
  
                <button
                  @click="exportToExcel"
                  :disabled="exportingFormat !== null"
                  class="w-full px-4 py-3 text-left hover:bg-indigo-50 transition flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border-t border-gray-100"
                >
                  <div class="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg flex-shrink-0">
                    <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-gray-800 text-sm">Excel File</div>
                    <div class="text-xs text-gray-500 truncate">Opens in Microsoft Excel</div>
                  </div>
                  <span v-if="exportingFormat === 'excel'" class="text-indigo-600">
                    <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                </button>
  
                <button
                  @click="exportToPDF"
                  :disabled="exportingFormat !== null"
                  class="w-full px-4 py-3 text-left hover:bg-indigo-50 transition flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border-t border-gray-100"
                >
                  <div class="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg flex-shrink-0">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-gray-800 text-sm">PDF Document</div>
                    <div class="text-xs text-gray-500 truncate">Print-ready report</div>
                  </div>
                  <span v-if="exportingFormat === 'pdf'" class="text-indigo-600">
                    <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-16 sm:py-20">
          <div class="inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600 text-base sm:text-lg">Loading reports...</p>
        </div>
  
        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
          <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-600 font-semibold">Error: {{ error.message }}</p>
        </div>
  
        <!-- Empty State -->
        <div v-else-if="groupBySession(filteredAttendance).length === 0" class="bg-white rounded-2xl shadow-xl border border-indigo-100/50 p-12 text-center">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-2a4 4 0 00-4-4h-1a4 4 0 00-4 4v2m6-6V7a4 4 0 10-8 0v4" />
          </svg>
          <p class="text-lg font-semibold text-gray-700 mb-1">No attendance records found</p>
          <p class="text-sm text-gray-400">Try adjusting your search or check back later</p>
        </div>
  
        <!-- Sessions List -->
        <div v-else class="space-y-6 sm:space-y-8">
          <div
            v-for="session in groupBySession(filteredAttendance)"
            :key="session.session_id"
            :id="`session-${session.session_id}`"
            class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-indigo-100/50 overflow-hidden"
          >
            <!-- Session Header -->
            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 p-4 sm:p-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                    {{ findSession(session.session_id)?.title }}
                  </h2>
                  <p class="text-sm text-gray-600 flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ findSession(session.session_id)?.date }}
                  </p>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold"
                    :class="[
                      findSession(session.session_id)?.is_open
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    ]"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path v-if="findSession(session.session_id)?.is_open" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ findSession(session.session_id)?.is_open ? 'Open' : 'Closed' }}
                  </span>
                  <div class="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-bold">
                    {{ session.attendance.length }} / {{ session.total }} present
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Present and Absent Tables -->
            <div class="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
              <!-- Present Students -->
              <div class="p-4 sm:p-6">
                <h3 class="flex items-center gap-2 text-base sm:text-lg font-bold text-green-700 mb-4">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Present ({{ session.attendance.length }})
                </h3>
                <div class="max-h-96 overflow-y-auto custom-scrollbar">
                  <div v-if="session.attendance.length === 0" class="text-center py-8 text-gray-400 italic text-sm">
                    No students present
                  </div>
                  <div v-else class="space-y-2">
                    <div
                      v-for="(item, index) in session.attendance"
                      :key="item.id"
                      class="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors border border-gray-100"
                    >
                      <div class="flex items-center gap-3">
                        <span class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm flex-shrink-0">
                          {{ Number(index) + 1 }}
                        </span>
                        <div class="min-w-0">
                          <p class="font-semibold text-gray-800 text-sm truncate">{{ findKid(item.kid_id)?.full_name }}</p>
                          <p class="text-xs text-gray-500">
                            Age: {{ (() => { const dob = findKid(item.kid_id)?.dob; return dob ? getAge(new Date(dob)) : ""; })() }}
                          </p>
                        </div>
                      </div>
                      <span class="text-xs text-gray-600 flex-shrink-0 ml-2">
                        {{ item.checkin_time ? new Date(item.checkin_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Absent Students -->
              <div class="p-4 sm:p-6">
                <h3 class="flex items-center gap-2 text-base sm:text-lg font-bold text-red-700 mb-4">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Absent ({{ session.absentKids.length }})
                </h3>
                <div class="max-h-96 overflow-y-auto custom-scrollbar">
                  <div v-if="session.absentKids.length === 0" class="text-center py-8 text-green-600 font-semibold text-sm">
                    🎉 All students present!
                  </div>
                  <div v-else class="space-y-2">
                    <div
                      v-for="(kid, index) in session.absentKids"
                      :key="kid?.id ?? index"
                      class="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors border border-gray-100"
                    >
                      <span class="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold text-sm flex-shrink-0">
                        {{ index + 1 }}
                      </span>
                      <div class="min-w-0 flex-1">
                        <p class="font-semibold text-gray-800 text-sm truncate">{{ kid?.full_name ?? "" }}</p>
                        <p class="text-xs text-gray-500">
                          Age: {{ (() => { const dob = kid?.dob; return dob ? getAge(new Date(dob)) : ""; })() }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #6366f1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #4f46e5;
  }
  </style>