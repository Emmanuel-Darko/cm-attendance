<script setup lang="ts">
  import type { Database } from '#build/types/supabase-database'
  import { ref, computed, onMounted, onUnmounted } from 'vue'

  const { records, getAttendance, getRecords } = await useAttendance()
  const { sessions, fetchSessions } = await useSessions()
  const { getAge } = useCommon()
  const loading = ref(true)
  const error = ref<any>(null)
  const attendance = ref<Database[] | any[]>([])
  const search = ref('')
  const showExportMenu = ref(false)
  const exportingFormat = ref<string | null>(null)

  // Filter the kids (records), not the attendance
  // Filter attendance by kid name or kid id
  const filteredAttendance = computed(() => {
    if (!search.value.trim()) return attendance.value
    return attendance.value.filter(item => {
      const kid = records.value.find(k => k.id === item.kid_id)
      const name = kid?.full_name?.toLowerCase() || ''
      const dob = String(kid?.dob)?.toLowerCase() || ''
      const id = kid.id?.toLowerCase() || ''
      const searchTerm = search.value.toLowerCase()
      return name.includes(searchTerm) || dob.includes(searchTerm) || id.includes(searchTerm.toLowerCase())
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
      .map(([session_id, attendance]) => {
        const presentKidIds = attendance.map(a => a.kid_id)
        const absentKids = records.value.filter(kid => !presentKidIds.includes(kid.id))
        
        return {
          session_id,
          attendance,
          absentKids,
          sessionDate: findSession(session_id)?.created_at || ''
        }
      })
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
    exportingFormat.value = 'csv'
    const rows = [
      ['Session', 'Date', 'Status', 'Name', 'Age', 'Kid ID', 'Check-in Time'],
    ];
    
    groupBySession(filteredAttendance.value).forEach(session => {
      const sessionInfo = findSession(session.session_id);
      const sessionTitle = sessionInfo?.title || 'Unknown Session'
      const sessionDate = sessionInfo?.date || 'N/A'
      const sessionStatus = sessionInfo?.is_open ? 'Open' : 'Closed'
      
      // Add present students
      session.attendance.forEach(item => {
        const kid = findKid(item.kid_id)
        rows.push([
          sessionTitle,
          sessionDate,
          'Present',
          kid?.full_name || 'Unknown',
          getAge(kid?.dob) || 'N/A',
          item.kid_id,
          new Date(item.checkin_time).toLocaleString(),
        ]);
      });
      
      // Add absent students
      session.absentKids.forEach(kid => {
        rows.push([
          sessionTitle,
          sessionDate,
          'Absent',
          kid.full_name,
          getAge(kid.dob) || 'N/A',
          kid.id,
          '-',
        ]);
      });
    });
    
    const csvContent = rows.map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `attendance_${Date.now()}.csv`);
    exportingFormat.value = null
    showExportMenu.value = false
  }

  function exportToExcel() {
    exportingFormat.value = 'excel'
    const rows: any[][] = []
    
    groupBySession(filteredAttendance.value).forEach(session => {
      const sessionInfo = findSession(session.session_id);
      const sessionTitle = sessionInfo?.title || 'Unknown Session'
      const sessionDate = sessionInfo?.date || 'N/A'
      
      // Session header
      rows.push([sessionTitle + ' (' + sessionDate + ')'])
      rows.push(['Status', 'Name', 'Age', 'Check-in Time'])
      
      // Present students
      session.attendance.forEach(item => {
        const kid = findKid(item.kid_id)
        rows.push([
          'Present',
          kid?.full_name || 'Unknown',
          getAge(kid?.dob) || 'N/A',
          new Date(item.checkin_time).toLocaleString(),
        ]);
      });
      
      // Absent students
      session.absentKids.forEach(kid => {
        rows.push([
          'Absent',
          kid.full_name,
          getAge(kid.dob) || 'N/A',
          '-',
        ]);
      });
      
      rows.push([]) // Empty row between sessions
    });
    
    // Create simple HTML table for Excel
    let html = '<html><head><meta charset="utf-8"><style>table { border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; }</style></head><body><table>'
    rows.forEach(row => {
      html += '<tr>'
      row.forEach(cell => {
        html += `<td>${cell}</td>`
      })
      html += '</tr>'
    })
    html += '</table></body></html>'
    
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    downloadFile(blob, `attendance_${Date.now()}.xls`);
    exportingFormat.value = null
    showExportMenu.value = false
  }

  function exportToPDF() {
    exportingFormat.value = 'pdf'
    
    // Create a printable HTML view
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Attendance Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #4f46e5; text-align: center; margin-bottom: 30px; }
          .session { margin-bottom: 40px; page-break-inside: avoid; }
          .session-header { background: #4f46e5; color: white; padding: 10px; margin-bottom: 10px; }
          .stats { margin-bottom: 15px; font-size: 14px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #f3f4f6; padding: 8px; text-align: left; border: 1px solid #ddd; font-size: 12px; }
          td { padding: 8px; border: 1px solid #ddd; font-size: 12px; }
          .present { background: #f0fdf4; }
          .absent { background: #fef2f2; }
          .status-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
          .status-present { background: #86efac; color: #166534; }
          .status-absent { background: #fca5a5; color: #991b1b; }
          @media print {
            body { padding: 10px; }
            .session { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <h1>📊 Attendance Report</h1>
    `
    
    groupBySession(filteredAttendance.value).forEach(session => {
      const sessionInfo = findSession(session.session_id);
      const sessionTitle = sessionInfo?.title || 'Unknown Session'
      const sessionDate = sessionInfo?.date || 'N/A'
      const sessionStatus = sessionInfo?.is_open ? 'Open' : 'Closed'
      
      html += `
        <div class="session">
          <div class="session-header">
            <strong>${sessionTitle}</strong> - ${sessionDate} <span style="float: right;">${sessionStatus}</span>
          </div>
          <div class="stats">
            <strong>Present:</strong> ${session.attendance.length} | <strong>Absent:</strong> ${session.absentKids.length} | <strong>Total:</strong> ${records.value.length}
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 10%">#</th>
                <th style="width: 40%">Name</th>
                <th style="width: 15%">Age</th>
                <th style="width: 20%">Status</th>
                <th style="width: 15%">Time</th>
              </tr>
            </thead>
            <tbody>
      `
      
      // Present students
      session.attendance.forEach((item, index) => {
        const kid = findKid(item.kid_id)
        html += `
          <tr class="present">
            <td>${index + 1}</td>
            <td>${kid?.full_name || 'Unknown'}</td>
            <td>${getAge(kid?.dob) || 'N/A'}</td>
            <td><span class="status-badge status-present">✓ Present</span></td>
            <td>${new Date(item.checkin_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</td>
          </tr>
        `
      })
      
      // Absent students
      session.absentKids.forEach((kid, index) => {
        html += `
          <tr class="absent">
            <td>${session.attendance.length + index + 1}</td>
            <td>${kid.full_name}</td>
            <td>${getAge(kid.dob) || 'N/A'}</td>
            <td><span class="status-badge status-absent">✗ Absent</span></td>
            <td>-</td>
          </tr>
        `
      })
      
      html += `
            </tbody>
          </table>
        </div>
      `
    })
    
    html += `
        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
      </html>
    `
    
    // Open print dialog
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
    
    exportingFormat.value = null
    showExportMenu.value = false
  }

  function downloadFile(blob: Blob, filename: string) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement
    const dropdown = document.querySelector('.export-dropdown-container')
    if (dropdown && !dropdown.contains(target)) {
      showExportMenu.value = false
    }
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
    
    // Add click outside listener
    document.addEventListener('click', handleClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
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
      
      <!-- Export Dropdown -->
      <div class="relative export-dropdown-container">
        <button 
          @click="showExportMenu = !showExportMenu"
          class="px-6 py-3 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'rotate-180': showExportMenu }" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="transition: transform 0.2s">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <!-- Dropdown Menu -->
        <div 
          v-if="showExportMenu"
          class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden"
        >
          <div class="py-1">
            <button
              @click="exportToCSV"
              :disabled="exportingFormat !== null"
              class="w-full px-4 py-3 text-left hover:bg-indigo-50 transition flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="font-semibold text-gray-800">CSV File</div>
                <div class="text-xs text-gray-500">Best for spreadsheets & data analysis</div>
              </div>
              <span v-if="exportingFormat === 'csv'" class="text-indigo-600">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            </button>
            
            <button
              @click="exportToExcel"
              :disabled="exportingFormat !== null"
              class="w-full px-4 py-3 text-left hover:bg-indigo-50 transition flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="font-semibold text-gray-800">Excel File</div>
                <div class="text-xs text-gray-500">Opens directly in Microsoft Excel</div>
              </div>
              <span v-if="exportingFormat === 'excel'" class="text-indigo-600">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            </button>
            
            <button
              @click="exportToPDF"
              :disabled="exportingFormat !== null"
              class="w-full px-4 py-3 text-left hover:bg-indigo-50 transition flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="font-semibold text-gray-800">PDF Document</div>
                <div class="text-xs text-gray-500">Print-ready formatted report</div>
              </div>
              <span v-if="exportingFormat === 'pdf'" class="text-indigo-600">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-4 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-2a4 4 0 00-4-4h-1a4 4 0 00-4 4v2m6-6V7a4 4 0 10-8 0v4" /></svg>
        <div class="text-lg">No attendance records found.</div>
        <div class="text-sm text-gray-400">Try adjusting your search or check back later.</div>
      </div>
      <div v-else>
        <div
          v-for="session in groupBySession(filteredAttendance)"
          :key="session.session_id"
          class="mb-10"
        >
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
                <span
                  v-if="findSession(session.session_id)?.is_open"
                  class="inline-block px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full"
                >
                  🟢 Open
                </span>
                <span
                  v-else
                  class="inline-block px-3 py-1 text-sm font-semibold text-red-700 bg-red-100 rounded-full"
                >
                  🔴 Closed
                </span>
                <div class="text-sm text-gray-600">
                  <span class="font-semibold">{{ session.attendance.length }}</span> / {{ records.length }} present
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
                      <td class="px-4 py-3 text-sm text-gray-600">{{ index + 1 }}</td>
                      <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ findKid(item.kid_id)?.full_name }}</td>
                      <td class="px-4 py-3 text-sm text-gray-600">{{ getAge(findKid(item.kid_id)?.dob) }}</td>
                      <td class="px-4 py-3 text-xs text-gray-500">
                        {{ new Date(item.checkin_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
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
                    <tr v-for="kid, index in session.absentKids" :key="kid.id" class="hover:bg-red-50 transition">
                      <td class="px-4 py-3 text-sm text-gray-600">{{ index + 1 }}</td>
                      <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ kid.full_name }}</td>
                      <td class="px-4 py-3 text-sm text-gray-600">{{ getAge(kid.dob) }}</td>
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
