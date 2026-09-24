<script setup lang="ts">
import confetti from 'canvas-confetti'
import * as XLSX from 'xlsx'
import {
  useSoulsTracking,
  type SoulRecord,
  type SoulInput,
  type SoulStatus
} from '~/composables/useSoulsTracking'

useHead({
  title: "Chairman's 800,000 Souls Project"
})

const {
  souls,
  teams,
  winners,
  summary,
  loading,
  error,
  allTimeProgressPercent,
  clampedAllTimeProgressPercent,
  monthlyProgressPercent,
  clampedMonthlyProgressPercent,
  fetchSummary,
  fetchSouls,
  addSoul,
  updateSoul,
  updateSoulStatus,
  deleteSoul,
  fetchTeams,
  fetchWinners,
  addWinner
} = useSoulsTracking()

// Filters
const search = ref('')
const filterTeamId = ref('all')
const filterWinnerId = ref('all')
const filterStatus = ref('all')
const filterDateFrom = ref('')
const filterDateTo = ref('')

// Analytics collapsible toggle
const showAnalytics = ref(false)

// Mobile leaderboard tab toggle inside analytics
const mobileLeaderboardTab = ref<'teams' | 'winners'>('teams')

// Modal state
const showSoulModal = ref(false)
const editingSoulId = ref<string | null>(null)
const modalSaving = ref(false)
const modalError = ref<string | null>(null)

// Inline quick add winner in soul modal
const showQuickAddWinner = ref(false)
const quickWinnerName = ref('')
const quickWinnerPhone = ref('')
const quickWinnerSaving = ref(false)
const quickWinnerError = ref<string | null>(null)

// Export menu
const showExportMenu = ref(false)
const exportingFormat = ref<string | null>(null)

// Soul form
const soulForm = ref<SoulInput>({
  full_name: '',
  phone: '',
  location: '',
  date_won: new Date().toISOString().slice(0, 10),
  status: 'new',
  won_by: '',
  notes: ''
})
const selectedFormTeamId = ref<string>('')

// 5 Statuses
const statusOptions: { value: SoulStatus; label: string }[] = [
  { value: 'new', label: 'New Souls' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_discipleship', label: 'In discipleship' },
  { value: 'baptized', label: 'Baptized' },
  { value: 'integrated', label: 'Integrated' }
]

const statusStyles: Record<SoulStatus, { badge: string; dot: string; text: string; bg: string }> = {
  new: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    bg: 'bg-amber-500'
  },
  contacted: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    text: 'text-blue-700',
    bg: 'bg-blue-500'
  },
  in_discipleship: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    text: 'text-purple-700',
    bg: 'bg-purple-500'
  },
  baptized: {
    badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    dot: 'bg-cyan-500',
    text: 'text-cyan-700',
    bg: 'bg-cyan-500'
  },
  integrated: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    bg: 'bg-emerald-500'
  }
}

// Available winners in form filtered by selected form team
const formWinners = computed(() => {
  if (!selectedFormTeamId.value) return winners.value
  return winners.value.filter((w) => w.team_id === selectedFormTeamId.value)
})

// Filter winners for filter dropdown
const filterWinnersList = computed(() => {
  if (!filterTeamId.value || filterTeamId.value === 'all') return winners.value
  return winners.value.filter((w) => w.team_id === filterTeamId.value)
})

const maxTeamSoulCount = computed(() => {
  if (!summary.value?.team_leaderboard?.length) return 1
  return Math.max(1, ...summary.value.team_leaderboard.map((t) => t.count))
})

const monthlyRemaining = computed(() => {
  const target = summary.value?.monthly_target || 75
  const count = summary.value?.monthly_souls || 0
  return Math.max(0, target - count)
})

const selectedMonth = ref<string>('')

const displayMonthName = computed(() => {
  const m = selectedMonth.value || summary.value?.selected_month || new Date().toISOString().slice(0, 7)
  const [year, month] = m.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return isNaN(date.getTime()) ? m : date.toLocaleString('default', { month: 'long', year: 'numeric' })
})

async function onMonthSelectChange() {
  await fetchSummary(selectedMonth.value || undefined)
}

function formatMonthOption(m: string): string {
  const [year, month] = m.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return isNaN(date.getTime()) ? m : date.toLocaleString('default', { month: 'short', year: 'numeric' })
}

// Form handling
function openAddModal() {
  editingSoulId.value = null
  modalError.value = null
  showQuickAddWinner.value = false
  quickWinnerName.value = ''
  quickWinnerPhone.value = ''
  quickWinnerError.value = null
  soulForm.value = {
    full_name: '',
    phone: '',
    location: '',
    date_won: new Date().toISOString().slice(0, 10),
    status: 'new',
    won_by: '',
    notes: ''
  }
  selectedFormTeamId.value = teams.value.length > 0 ? teams.value[0].id : ''
  if (formWinners.value.length > 0) {
    soulForm.value.won_by = formWinners.value[0].id
  }
  showSoulModal.value = true
}

function openEditModal(soul: SoulRecord) {
  editingSoulId.value = soul.id
  modalError.value = null
  showQuickAddWinner.value = false
  quickWinnerName.value = ''
  quickWinnerPhone.value = ''
  quickWinnerError.value = null

  const winner = winners.value.find((w) => w.id === soul.won_by)
  selectedFormTeamId.value = winner?.team_id || soul.team_id || ''

  soulForm.value = {
    full_name: soul.full_name,
    phone: soul.phone || '',
    location: soul.location || '',
    date_won: soul.date_won || new Date().toISOString().slice(0, 10),
    status: soul.status || 'new',
    won_by: soul.won_by,
    notes: soul.notes || ''
  }
  showSoulModal.value = true
}

function onFormTeamChange() {
  const currentWinner = winners.value.find((w) => w.id === soulForm.value.won_by)
  if (!currentWinner || currentWinner.team_id !== selectedFormTeamId.value) {
    const firstMatchingWinner = formWinners.value[0]
    soulForm.value.won_by = firstMatchingWinner ? firstMatchingWinner.id : ''
  }
}

async function handleQuickAddWinner() {
  quickWinnerError.value = null
  if (!quickWinnerName.value.trim()) {
    quickWinnerError.value = 'Winner name is required.'
    return
  }
  if (!selectedFormTeamId.value) {
    quickWinnerError.value = 'Please select a team first.'
    return
  }

  quickWinnerSaving.value = true
  try {
    const created = await addWinner({
      full_name: quickWinnerName.value.trim(),
      team_id: selectedFormTeamId.value,
      phone: quickWinnerPhone.value.trim() || null
    })
    soulForm.value.won_by = created.id
    quickWinnerName.value = ''
    quickWinnerPhone.value = ''
    showQuickAddWinner.value = false
  } catch (err: any) {
    quickWinnerError.value = err?.data?.statusMessage || 'Could not add winner.'
  } finally {
    quickWinnerSaving.value = false
  }
}

async function submitSoulForm() {
  modalError.value = null
  if (!soulForm.value.full_name.trim()) {
    modalError.value = 'Soul full name is required.'
    return
  }
  if (!soulForm.value.won_by) {
    modalError.value = 'Please select the soul winner.'
    return
  }

  modalSaving.value = true
  try {
    if (editingSoulId.value) {
      await updateSoul(editingSoulId.value, soulForm.value)
    } else {
      await addSoul(soulForm.value)
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        })
      } catch {}
    }
    showSoulModal.value = false
    await refresh()
  } catch (err: any) {
    modalError.value = err?.data?.statusMessage || 'Could not save soul record.'
  } finally {
    modalSaving.value = false
  }
}

async function onStatusChange(id: string, newStatus: SoulStatus) {
  try {
    await updateSoulStatus(id, newStatus)
  } catch (err: any) {
    alert(err?.data?.statusMessage || 'Could not update status.')
  }
}

async function onRemoveSoul(id: string) {
  if (confirm('Are you sure you want to remove this soul record? This cannot be undone.')) {
    try {
      await deleteSoul(id)
    } catch (err: any) {
      alert(err?.data?.statusMessage || 'Could not remove soul record.')
    }
  }
}

// Filters & Refresh
async function refresh() {
  await Promise.all([
    fetchSummary(),
    fetchSouls({
      search: search.value.trim() || undefined,
      team_id: filterTeamId.value !== 'all' ? filterTeamId.value : undefined,
      won_by: filterWinnerId.value !== 'all' ? filterWinnerId.value : undefined,
      status: filterStatus.value !== 'all' ? filterStatus.value : undefined,
      date_from: filterDateFrom.value || undefined,
      date_to: filterDateTo.value || undefined
    })
  ])
}

function resetFilters() {
  search.value = ''
  filterTeamId.value = 'all'
  filterWinnerId.value = 'all'
  filterStatus.value = 'all'
  filterDateFrom.value = ''
  filterDateTo.value = ''
  refresh()
}

let searchTimer: ReturnType<typeof setTimeout>
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(refresh, 300)
})
watch([filterTeamId, filterWinnerId, filterStatus, filterDateFrom, filterDateTo], () => {
  refresh()
})

// Helpers
function formatNumber(num: number): string {
  return (num || 0).toLocaleString('en-US')
}

function initials(name: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function colorBadgeClass(color: string = 'amber'): string {
  const map: Record<string, string> = {
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    teal: 'bg-teal-100 text-teal-800 border-teal-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    rose: 'bg-rose-100 text-rose-800 border-rose-200',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    sky: 'bg-sky-100 text-sky-800 border-sky-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200'
  }
  return map[color] || 'bg-amber-100 text-amber-800 border-amber-200'
}

// Exports
function downloadBlob(blob: Blob, filename: string) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function exportCSV() {
  exportingFormat.value = 'csv'
  const headers = ['Full Name', 'Phone', 'Location', 'Date Won', 'Soul Winner', 'Team', 'Status', 'Notes']
  const rows = souls.value.map((s) => [
    s.full_name,
    s.phone ? `\t${s.phone}` : '',
    s.location || '',
    s.date_won,
    s.won_by_name || '',
    s.team_name || '',
    s.status,
    s.notes || ''
  ])
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `souls_project_${Date.now()}.csv`)
  exportingFormat.value = null
  showExportMenu.value = false
}

function exportXLSX() {
  exportingFormat.value = 'excel'
  const data = souls.value.map((s) => ({
    'Full Name': s.full_name,
    Phone: s.phone || '',
    Location: s.location || '',
    'Date Won': s.date_won,
    'Soul Winner': s.won_by_name || '',
    Team: s.team_name || '',
    Status: s.status,
    Notes: s.notes || ''
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)
  XLSX.utils.book_append_sheet(wb, ws, 'Souls')
  XLSX.writeFile(wb, `souls_project_${Date.now()}.xlsx`)
  exportingFormat.value = null
  showExportMenu.value = false
}

function exportPDF() {
  exportingFormat.value = 'pdf'
  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Chairman's 800,000 Souls Project</title><style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #1e293b; }
    h1 { font-size: 20px; font-weight: 800; margin-bottom: 4px; color: #0f172a; }
    .subtitle { color: #64748b; font-size: 12px; margin-bottom: 16px; }
    .stat-box { display: flex; gap: 16px; margin-bottom: 20px; }
    .stat { padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; }
    .stat-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; }
    .stat-value { font-size: 18px; font-weight: 800; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th { background: #f1f5f9; text-align: left; padding: 8px; border: 1px solid #cbd5e1; font-weight: 700; }
    td { padding: 6px 8px; border: 1px solid #cbd5e1; }
    tr:nth-child(even) { background: #f8fafc; }
  </style></head><body>
  <h1>Chairman's 800,000 Souls Project Report</h1>
  <div class="subtitle">Generated on ${new Date().toLocaleDateString()} — District Monthly Goal: 75 souls — ${souls.value.length} total records listed</div>
  <div class="stat-box">
    <div class="stat"><div class="stat-label">This Month</div><div class="stat-value">${formatNumber(summary.value?.monthly_souls || 0)} / ${summary.value?.monthly_target || 75}</div></div>
    <div class="stat"><div class="stat-label">All-Time Souls</div><div class="stat-value">${formatNumber(summary.value?.total_souls || 0)}</div></div>
    <div class="stat"><div class="stat-label">National Goal</div><div class="stat-value">${formatNumber(summary.value?.target || 800000)}</div></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Full Name</th>
        <th>Phone</th>
        <th>Location</th>
        <th>Date Won</th>
        <th>Soul Winner</th>
        <th>Team</th>
        <th>Status</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>`
  souls.value.forEach((s) => {
    html += `<tr>
      <td><b>${s.full_name}</b></td>
      <td>${s.phone || '-'}</td>
      <td>${s.location || '-'}</td>
      <td>${s.date_won}</td>
      <td>${s.won_by_name || '-'}</td>
      <td>${s.team_name || '-'}</td>
      <td>${s.status}</td>
      <td>${s.notes || ''}</td>
    </tr>`
  })
  html += `</tbody></table></body></html>`
  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
    win.print()
  }
  exportingFormat.value = null
  showExportMenu.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (!(event.target as HTMLElement).closest('.export-menu-container')) {
    showExportMenu.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await Promise.all([
    fetchTeams(),
    fetchWinners(),
    refresh()
  ])
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50/40 via-slate-50/60 to-purple-50/30 text-gray-900 pb-12">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      
      <!-- Top Navigation Row -->
      <div class="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <NuxtLink
          to="/"
          class="group inline-flex items-center gap-2 px-3.5 py-2 bg-white/90 hover:bg-white rounded-xl shadow-xs hover:shadow transition-all text-gray-700 hover:text-indigo-600 border border-gray-200/80 text-xs sm:text-sm font-medium"
        >
          <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Home</span>
        </NuxtLink>

        <div class="flex items-center gap-2">
          <!-- Link to Field Recording Page -->
          <NuxtLink
            to="/souls/register"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xs hover:shadow rounded-xl text-xs sm:text-sm font-bold transition-all"
          >
            <span class="w-2 h-2 rounded-full bg-white/90 animate-pulse"></span>
            <span>Field Mode</span>
          </NuxtLink>

          <!-- Add Soul Button -->
          <button
            type="button"
            @click="openAddModal"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Soul</span>
          </button>
        </div>
      </div>

      <!-- Header Title with subtle gradient accent -->
      <div class="mb-5 sm:mb-6 text-center sm:text-left">
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
          <span class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Souls Tracking
          </span>
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-0.5">
          Chairman's 800,000 Souls Project & District Evangelism Campaign
        </p>
      </div>

      <!-- TOP STATS CARDS: 3 on Desktop (sm+), Only 1 on Mobile -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-3.5">
        
        <!-- Card 1: Monthly Target (Visible on ALL devices) -->
        <div class="relative bg-gradient-to-b from-white via-white to-indigo-50/20 rounded-2xl p-4 sm:p-5 border border-indigo-100/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
          <!-- Subtle Top Gradient Bar -->
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Monthly Target
              </span>
              
              <!-- Month Selector -->
              <select
                v-model="selectedMonth"
                @change="onMonthSelectChange"
                class="text-[11px] font-semibold bg-indigo-50/60 text-indigo-800 border border-indigo-200/80 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Current Month</option>
                <option v-for="m in summary?.available_months" :key="m" :value="m">
                  {{ formatMonthOption(m) }}
                </option>
              </select>
            </div>

            <div class="flex items-baseline justify-between mb-1.5">
              <div>
                <span class="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {{ formatNumber(summary?.monthly_souls || 0) }}
                </span>
                <span class="text-xs sm:text-sm font-semibold text-gray-400 ml-1">
                  / {{ summary?.monthly_target || 75 }}
                </span>
              </div>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {{ monthlyProgressPercent.toFixed(0) }}%
              </span>
            </div>

            <!-- Clean Slim Progress Bar with vibrant gradient -->
            <div class="w-full h-2 bg-indigo-50/80 rounded-full overflow-hidden my-1.5">
              <div
                class="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
                :style="{ width: `${Math.max(clampedMonthlyProgressPercent, summary?.monthly_souls ? 4 : 0)}%` }"
              ></div>
            </div>
          </div>

          <p class="text-[11px] text-gray-500 mt-1 font-medium">
            {{ monthlyRemaining > 0 ? `${monthlyRemaining} more souls needed this month` : '🎉 Monthly target achieved!' }}
          </p>
        </div>

        <!-- Card 2: Total Recorded (Desktop & Tablet only) -->
        <div class="hidden sm:flex relative bg-gradient-to-b from-white via-white to-amber-50/20 rounded-2xl p-4 sm:p-5 border border-amber-100/80 shadow-xs hover:shadow-md transition-all flex-col justify-between overflow-hidden">
          <!-- Subtle Top Gradient Bar -->
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"></div>

          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Total Recorded
              </span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">All-Time</span>
            </div>

            <div class="flex items-baseline gap-1.5 mb-1.5">
              <span class="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {{ formatNumber(summary?.total_souls || 0) }}
              </span>
              <span class="text-xs text-gray-500 font-medium">souls won</span>
            </div>

            <div class="w-full h-2 bg-amber-50/80 rounded-full overflow-hidden my-1.5">
              <div
                class="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                :style="{ width: `${Math.max(clampedAllTimeProgressPercent, summary?.total_souls ? 3 : 0)}%` }"
              ></div>
            </div>
          </div>

          <p class="text-[11px] text-gray-500 mt-1 font-medium">
            Contributing to national 800k mission
          </p>
        </div>

        <!-- Card 3: Active Teams & Winners (Desktop only) -->
        <div class="hidden lg:flex relative bg-gradient-to-b from-white via-white to-emerald-50/20 rounded-2xl p-4 sm:p-5 border border-emerald-100/80 shadow-xs hover:shadow-md transition-all flex-col justify-between overflow-hidden">
          <!-- Subtle Top Gradient Bar -->
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-cyan-500"></div>

          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Teams & Evangelists
              </span>
              <NuxtLink to="/souls/teams" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition">Manage Teams →</NuxtLink>
            </div>

            <div class="flex items-baseline gap-2 mb-1.5">
              <span class="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {{ teams.length }}
              </span>
              <span class="text-xs text-gray-500 font-medium">teams • {{ winners.length }} soul winners</span>
            </div>
          </div>

          <p class="text-[11px] text-gray-500 mt-1 font-medium">
            Active outreach members across district
          </p>
        </div>

      </div>

      <!-- COLLAPSIBLE ANALYTICS TRIGGER (Interactive, clearly actionable card banner) -->
      <div class="mb-4">
        <button
          type="button"
          @click="showAnalytics = !showAnalytics"
          class="group w-full p-3 sm:p-3.5 bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-pink-50/80 hover:from-indigo-100/90 hover:via-purple-100/70 hover:to-pink-100/90 border border-indigo-200/80 hover:border-indigo-300 rounded-2xl shadow-xs hover:shadow-md flex items-center justify-between transition-all duration-200 cursor-pointer"
        >
          <!-- Left: Gradient Icon & Descriptive Text -->
          <div class="flex items-center gap-3 text-left">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                  Analytics & Leaderboards
                </span>
                <span class="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-indigo-700 border border-indigo-200/70 shadow-2xs">
                  {{ teams.length }} Teams • 5 Statuses
                </span>
              </div>
              <p class="text-[11px] text-gray-500">
                {{ showAnalytics ? 'Tap to hide detailed analytics & rankings' : 'Tap to view status pipeline, team rankings & top soul winners' }}
              </p>
            </div>
          </div>

          <!-- Right: Interactive Action Pill -->
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-xs font-bold shadow-2xs group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
            <span>{{ showAnalytics ? 'Collapse' : 'Expand' }}</span>
            <svg class="w-3.5 h-3.5 transform transition-transform duration-200" :class="{ 'rotate-180': showAnalytics }" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <!-- Expanded Analytics Content with subtle background gradient -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="showAnalytics" class="mt-3.5 space-y-4 p-4 sm:p-5 bg-gradient-to-b from-indigo-50/40 via-purple-50/20 to-white rounded-2xl border border-indigo-100/80 shadow-sm">
            
            <!-- Mobile-only Stats Cards (Total Recorded & Active Teams) -->
            <div class="sm:hidden grid grid-cols-2 gap-2.5">
              <!-- Total Souls Card with soft amber gradient -->
              <div class="relative bg-gradient-to-b from-white to-amber-50/30 p-3.5 rounded-xl border border-amber-200/80 shadow-2xs overflow-hidden">
                <div class="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Total Souls</span>
                <span class="text-xl font-extrabold text-gray-900 mt-1 block">{{ formatNumber(summary?.total_souls || 0) }}</span>
                <span class="text-[10px] text-gray-400 block mt-0.5">District All-Time</span>
              </div>

              <!-- Active Teams Card with soft emerald gradient -->
              <div class="relative bg-gradient-to-b from-white to-emerald-50/30 p-3.5 rounded-xl border border-emerald-200/80 shadow-2xs overflow-hidden">
                <div class="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Teams</span>
                  <NuxtLink to="/souls/teams" class="text-[10px] font-bold text-indigo-600">Edit →</NuxtLink>
                </div>
                <span class="text-xl font-extrabold text-gray-900 mt-1 block">{{ teams.length }}</span>
                <span class="text-[10px] text-gray-400 block mt-0.5">{{ winners.length }} winners</span>
              </div>
            </div>

            <!-- Status Breakdown (5 clean informational cards with soft color gradients) -->
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-2 px-1">
                Souls Status Breakdown
              </span>
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                <!-- 1. New Souls (Amber wash) -->
                <div class="relative p-3 rounded-xl bg-gradient-to-b from-amber-50/60 to-white border border-amber-200/80 shadow-2xs overflow-hidden">
                  <div class="absolute top-0 inset-x-0 h-0.5 bg-amber-500"></div>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-amber-800">New Souls</span>
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                  </div>
                  <p class="text-xl font-black text-gray-900 mt-1">
                    {{ formatNumber(summary?.status_breakdown?.new || 0) }}
                  </p>
                </div>

                <!-- 2. Contacted (Blue wash) -->
                <div class="relative p-3 rounded-xl bg-gradient-to-b from-blue-50/60 to-white border border-blue-200/80 shadow-2xs overflow-hidden">
                  <div class="absolute top-0 inset-x-0 h-0.5 bg-blue-500"></div>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-blue-800">Contacted</span>
                    <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                  </div>
                  <p class="text-xl font-black text-gray-900 mt-1">
                    {{ formatNumber(summary?.status_breakdown?.contacted || 0) }}
                  </p>
                </div>

                <!-- 3. In Discipleship (Purple wash) -->
                <div class="relative p-3 rounded-xl bg-gradient-to-b from-purple-50/60 to-white border border-purple-200/80 shadow-2xs overflow-hidden">
                  <div class="absolute top-0 inset-x-0 h-0.5 bg-purple-500"></div>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-purple-800">In Discipleship</span>
                    <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                  </div>
                  <p class="text-xl font-black text-gray-900 mt-1">
                    {{ formatNumber(summary?.status_breakdown?.in_discipleship || 0) }}
                  </p>
                </div>

                <!-- 4. Baptized (Cyan wash) -->
                <div class="relative p-3 rounded-xl bg-gradient-to-b from-cyan-50/60 to-white border border-cyan-200/80 shadow-2xs overflow-hidden">
                  <div class="absolute top-0 inset-x-0 h-0.5 bg-cyan-500"></div>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-cyan-800">Baptized</span>
                    <span class="w-2 h-2 rounded-full bg-cyan-500"></span>
                  </div>
                  <p class="text-xl font-black text-gray-900 mt-1">
                    {{ formatNumber(summary?.status_breakdown?.baptized || 0) }}
                  </p>
                </div>

                <!-- 5. Integrated (Emerald wash) -->
                <div class="relative p-3 rounded-xl bg-gradient-to-b from-emerald-50/60 to-white border border-emerald-200/80 shadow-2xs overflow-hidden col-span-2 sm:col-span-1">
                  <div class="absolute top-0 inset-x-0 h-0.5 bg-emerald-500"></div>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-emerald-800">Integrated</span>
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <p class="text-xl font-black text-gray-900 mt-1">
                    {{ formatNumber(summary?.status_breakdown?.integrated || 0) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Leaderboards (Teams & Winners with subtle top gradient bars) -->
            <div>
              <!-- Mobile Tab Switcher with gradient styling -->
              <div class="sm:hidden flex bg-indigo-100/70 p-1 rounded-xl mb-3">
                <button
                  type="button"
                  @click="mobileLeaderboardTab = 'teams'"
                  class="flex-1 py-1.5 text-xs font-bold rounded-lg transition"
                  :class="mobileLeaderboardTab === 'teams' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600'"
                >
                  Team Rankings
                </button>
                <button
                  type="button"
                  @click="mobileLeaderboardTab = 'winners'"
                  class="flex-1 py-1.5 text-xs font-bold rounded-lg transition"
                  :class="mobileLeaderboardTab === 'winners' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600'"
                >
                  Top Winners
                </button>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                
                <!-- Team Leaderboard -->
                <div
                  class="relative bg-white rounded-xl p-4 border border-gray-200/80 shadow-xs overflow-hidden"
                  :class="mobileLeaderboardTab === 'teams' ? 'block' : 'hidden sm:block'"
                >
                  <div class="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-1.5">
                      <span class="text-xs">👥</span>
                      <span class="font-bold text-sm text-gray-900">Team Leaderboard</span>
                    </div>
                    <NuxtLink to="/souls/teams" class="text-xs font-bold text-indigo-600 hover:underline">
                      Manage Teams →
                    </NuxtLink>
                  </div>

                  <div v-if="!summary?.team_leaderboard?.length" class="text-center py-4 text-gray-400 text-xs">
                    No teams registered yet.
                  </div>

                  <div v-else class="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    <div
                      v-for="(team, idx) in summary.team_leaderboard"
                      :key="team.team_id"
                      class="p-2.5 rounded-lg bg-gray-50/90 border border-gray-100 flex items-center justify-between gap-2 text-xs hover:border-indigo-200 transition"
                    >
                      <div class="flex items-center gap-2 min-w-0">
                        <span
                          class="w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black shrink-0 shadow-2xs"
                          :class="[
                            idx === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950' :
                            idx === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-950' :
                            idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                            'bg-gray-200 text-gray-700'
                          ]"
                        >
                          {{ idx + 1 }}
                        </span>

                        <span class="font-bold text-gray-900 truncate">
                          {{ team.team_name }}
                        </span>

                        <span
                          class="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full border shrink-0"
                          :class="colorBadgeClass(team.color_tag)"
                        >
                          {{ team.color_tag }}
                        </span>
                      </div>

                      <div class="text-right shrink-0">
                        <span class="font-extrabold text-indigo-600 text-xs sm:text-sm">
                          {{ formatNumber(team.count) }}
                        </span>
                        <span class="text-[10px] text-gray-400 ml-1">souls</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Top Winners Leaderboard -->
                <div
                  class="relative bg-white rounded-xl p-4 border border-gray-200/80 shadow-xs overflow-hidden"
                  :class="mobileLeaderboardTab === 'winners' ? 'block' : 'hidden sm:block'"
                >
                  <div class="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-600"></div>

                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-1.5">
                      <span class="text-xs">🏆</span>
                      <span class="font-bold text-sm text-gray-900">Top Soul Winners</span>
                    </div>
                    <NuxtLink to="/souls/teams" class="text-xs font-bold text-indigo-600 hover:underline">
                      Manage Winners →
                    </NuxtLink>
                  </div>

                  <div v-if="!summary?.top_winners?.length" class="text-center py-4 text-gray-400 text-xs">
                    No soul winners registered yet.
                  </div>

                  <div v-else class="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    <div
                      v-for="(winner, idx) in summary.top_winners"
                      :key="winner.winner_id"
                      class="p-2.5 rounded-lg bg-gray-50/90 border border-gray-100 flex items-center justify-between gap-2 text-xs hover:border-purple-200 transition"
                    >
                      <div class="flex items-center gap-2 min-w-0">
                        <span
                          class="w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black shrink-0 shadow-2xs"
                          :class="[
                            idx === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950' :
                            idx === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-950' :
                            idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                            'bg-gray-200 text-gray-700'
                          ]"
                        >
                          {{ idx + 1 }}
                        </span>

                        <div class="min-w-0">
                          <p class="font-bold text-gray-900 truncate">{{ winner.full_name }}</p>
                          <p class="text-[10px] text-gray-400 truncate">{{ winner.team_name }}</p>
                        </div>
                      </div>

                      <div class="text-right shrink-0">
                        <span class="font-extrabold text-indigo-600 text-xs sm:text-sm">{{ formatNumber(winner.count) }}</span>
                        <span class="text-[10px] text-gray-400 ml-1">souls</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </transition>
      </div>

      <!-- SOULS DIRECTORY (Starts directly near top) -->
      <section class="relative bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-6 overflow-hidden">
        <!-- Subtle Top Gradient Bar -->
        <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"></div>

        <!-- Controls Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 class="text-base sm:text-lg font-bold text-gray-900">Souls Directory</h2>
            <p class="text-xs text-gray-500">Search, filter & manage individual soul records</p>
          </div>

          <div class="flex items-center gap-2">
            <!-- Export Dropdown -->
            <div class="relative export-menu-container">
              <button
                type="button"
                :disabled="!!exportingFormat"
                @click="showExportMenu = !showExportMenu"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition"
              >
                <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{{ exportingFormat ? 'Exporting...' : 'Export' }}</span>
              </button>

              <div
                v-if="showExportMenu"
                class="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
              >
                <button
                  type="button"
                  @click="exportCSV"
                  class="flex items-center gap-2 w-full px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 text-left transition"
                >
                  <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  CSV (.csv)
                </button>
                <button
                  type="button"
                  @click="exportXLSX"
                  class="flex items-center gap-2 w-full px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 text-left transition border-t border-gray-100"
                >
                  <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Excel (.xlsx)
                </button>
                <button
                  type="button"
                  @click="exportPDF"
                  class="flex items-center gap-2 w-full px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 text-left transition border-t border-gray-100"
                >
                  <svg class="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  PDF / Print
                </button>
              </div>
            </div>

            <!-- Quick Log Soul CTA with gradient -->
            <button
              type="button"
              @click="openAddModal"
              class="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition-all"
            >
              <span>+ Add Soul</span>
            </button>
          </div>
        </div>

        <!-- Filter Controls -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4">
          <!-- Search input -->
          <div class="relative sm:col-span-2 lg:col-span-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="search"
              type="search"
              placeholder="Search name, phone, area..."
              class="w-full pl-8 pr-3 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          <!-- Team select -->
          <div>
            <select
              v-model="filterTeamId"
              class="w-full px-3 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            >
              <option value="all">All Teams</option>
              <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
            </select>
          </div>

          <!-- Soul Winner select -->
          <div>
            <select
              v-model="filterWinnerId"
              class="w-full px-3 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            >
              <option value="all">All Soul Winners</option>
              <option v-for="w in filterWinnersList" :key="w.id" :value="w.id">{{ w.full_name }}</option>
            </select>
          </div>

          <!-- Status select -->
          <div>
            <select
              v-model="filterStatus"
              class="w-full px-3 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            >
              <option value="all">All Statuses</option>
              <option v-for="st in statusOptions" :key="st.value" :value="st.value">{{ st.label }}</option>
            </select>
          </div>
        </div>

        <!-- Global Error Alert -->
        <div v-if="error" class="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs font-medium text-red-700">
          {{ error }}
        </div>

        <!-- Desktop Table View with subtle gradient header -->
        <div class="hidden md:block overflow-x-auto rounded-xl border border-gray-200">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-pink-50/30 border-b border-gray-200 font-bold text-gray-600 uppercase tracking-wider text-[11px]">
                <th class="py-3 px-4">Soul Name</th>
                <th class="py-3 px-4">Contact</th>
                <th class="py-3 px-4">Date Won</th>
                <th class="py-3 px-4">Soul Winner & Team</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-if="loading">
                <td colspan="6" class="p-8 text-center text-gray-400 font-medium">Loading souls records...</td>
              </tr>
              <tr v-else-if="!souls.length">
                <td colspan="6" class="p-8 text-center text-gray-400">
                  <p class="font-bold text-sm text-gray-700">No souls found</p>
                  <p class="text-xs text-gray-400 mt-1">Try adjusting your filters or click "+ Add Soul".</p>
                </td>
              </tr>
              <tr
                v-for="soul in souls"
                :key="soul.id"
                class="hover:bg-indigo-50/20 transition"
              >
                <!-- Name & Area -->
                <td class="py-3 px-4">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-[11px] shrink-0 shadow-2xs">
                      {{ initials(soul.full_name) }}
                    </div>
                    <div>
                      <p class="font-bold text-gray-900 text-xs">{{ soul.full_name }}</p>
                      <p class="text-[11px] text-gray-400">{{ soul.location || 'No area' }}</p>
                    </div>
                  </div>
                </td>

                <!-- Contact -->
                <td class="py-3 px-4 text-gray-600">
                  {{ soul.phone || '-' }}
                </td>

                <!-- Date Won -->
                <td class="py-3 px-4 text-gray-600 font-medium">
                  {{ soul.date_won }}
                </td>

                <!-- Winner & Team -->
                <td class="py-3 px-4">
                  <p class="font-semibold text-gray-900">{{ soul.won_by_name }}</p>
                  <span
                    class="inline-block text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full border mt-0.5"
                    :class="colorBadgeClass(soul.team_color_tag)"
                  >
                    {{ soul.team_name }}
                  </span>
                </td>

                <!-- Inline Status Dropdown -->
                <td class="py-3 px-4">
                  <select
                    :value="soul.status"
                    @change="onStatusChange(soul.id, ($event.target as HTMLSelectElement).value as SoulStatus)"
                    class="rounded-full border px-2.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white cursor-pointer"
                    :class="statusStyles[soul.status]?.badge || 'text-gray-700'"
                  >
                    <option v-for="st in statusOptions" :key="st.value" :value="st.value">
                      {{ st.label }}
                    </option>
                  </select>
                </td>

                <!-- Actions -->
                <td class="py-3 px-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    @click="openEditModal(soul)"
                    class="p-1.5 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition"
                    title="Edit Soul"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="onRemoveSoul(soul.id)"
                    class="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition ml-1"
                    title="Delete Soul"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Clean Card View (Visible on mobile) -->
        <div class="md:hidden space-y-2.5">
          <div v-if="loading" class="p-6 text-center text-gray-400 text-xs font-medium">Loading souls...</div>
          <div v-else-if="!souls.length" class="p-6 text-center rounded-xl bg-gray-50 border border-gray-200">
            <p class="font-bold text-gray-700 text-sm">No souls found</p>
            <p class="text-xs text-gray-400 mt-1">Tap "+ Add Soul" to record a new soul.</p>
          </div>

          <div
            v-for="soul in souls"
            :key="soul.id"
            class="p-3.5 rounded-xl border border-gray-200 bg-white shadow-2xs hover:shadow-xs transition"
          >
            <!-- Top row: Avatar, Name, Location, Actions -->
            <div class="flex items-start justify-between gap-2 mb-1.5">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs">
                  {{ initials(soul.full_name) }}
                </div>
                <div class="min-w-0">
                  <h4 class="font-bold text-gray-900 text-xs sm:text-sm truncate">{{ soul.full_name }}</h4>
                  <p class="text-[11px] text-gray-400 truncate">
                    {{ soul.location || 'No area' }} • {{ soul.date_won }}
                  </p>
                </div>
              </div>

              <!-- Action icons -->
              <div class="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  @click="openEditModal(soul)"
                  class="p-1.5 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  @click="onRemoveSoul(soul.id)"
                  class="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Middle row: Won by & Phone link -->
            <div class="my-2 pt-1.5 border-t border-gray-100 text-xs text-gray-700 flex flex-wrap items-center justify-between gap-1.5">
              <div class="flex items-center gap-1">
                <span class="text-gray-400 text-[11px]">By:</span>
                <span class="font-semibold text-gray-800 text-[11px]">{{ soul.won_by_name }}</span>
                <span class="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full border" :class="colorBadgeClass(soul.team_color_tag)">
                  {{ soul.team_name }}
                </span>
              </div>
              <a
                v-if="soul.phone"
                :href="`tel:${soul.phone}`"
                class="text-indigo-600 hover:underline flex items-center gap-1 font-medium text-[11px]"
              >
                <span>📞</span>
                <span>{{ soul.phone }}</span>
              </a>
            </div>

            <!-- Bottom row: Status selector -->
            <div class="mt-2 flex items-center justify-between gap-2">
              <span class="text-[11px] text-gray-400 font-medium">Status:</span>
              <select
                :value="soul.status"
                @change="onStatusChange(soul.id, ($event.target as HTMLSelectElement).value as SoulStatus)"
                class="rounded-full border px-2.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                :class="statusStyles[soul.status]?.badge || 'text-gray-700'"
              >
                <option v-for="st in statusOptions" :key="st.value" :value="st.value">
                  {{ st.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

      </section>

    </div>

    <!-- ADD / EDIT SOUL MODAL (Mobile-Optimized Clean Bottom/Center Modal) -->
    <div
      v-if="showSoulModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-900/60 backdrop-blur-sm overflow-hidden"
      @click.self="showSoulModal = false"
    >
      <div class="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl text-gray-900 flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
        
        <!-- Modal Header with gradient bar -->
        <div class="relative flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 shrink-0">
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl sm:rounded-t-3xl"></div>
          <div>
            <h3 class="font-bold text-base sm:text-lg text-gray-900">
              {{ editingSoulId ? 'Edit Soul Record' : 'Record New Soul' }}
            </h3>
            <p class="text-xs text-gray-500">Chairman's 800,000 Souls Project Intake</p>
          </div>

          <button
            type="button"
            @click="showSoulModal = false"
            class="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Form Body -->
        <form @submit.prevent="submitSoulForm" class="flex flex-col flex-1 overflow-hidden min-h-0">
          <div class="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 overscroll-contain">
            <div v-if="modalError" class="bg-red-50 border border-red-200 rounded-xl p-3 text-xs font-medium text-red-700">
              {{ modalError }}
            </div>

            <!-- Full Name -->
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">
                Soul Full Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="soulForm.full_name"
                type="text"
                required
                placeholder="e.g. John Doe"
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            <!-- Phone & Location -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  v-model="soulForm.phone"
                  type="tel"
                  placeholder="e.g. 024 123 4567"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Area / Location</label>
                <input
                  v-model="soulForm.location"
                  type="text"
                  placeholder="e.g. Market Square"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            <!-- Date Won & Status -->
            <div :class="editingSoulId ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : ''">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Date Won</label>
                <input
                  v-model="soulForm.date_won"
                  type="date"
                  required
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
              <div v-if="editingSoulId">
                <label class="block text-xs font-bold text-gray-700 mb-1">Status</label>
                <select
                  v-model="soulForm.status"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                >
                  <option v-for="st in statusOptions" :key="st.value" :value="st.value">{{ st.label }}</option>
                </select>
              </div>
            </div>

            <!-- Team -->
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">
                Team <span class="text-red-500">*</span>
              </label>
              <select
                v-model="selectedFormTeamId"
                @change="onFormTeamChange"
                required
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              >
                <option value="" disabled>Select Team</option>
                <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
              </select>
            </div>

            <!-- Soul Winner -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-bold text-gray-700">
                  Soul Winner <span class="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  @click="showQuickAddWinner = !showQuickAddWinner"
                  class="text-[11px] text-indigo-600 font-bold hover:underline"
                >
                  {{ showQuickAddWinner ? 'Cancel' : '+ New Winner' }}
                </button>
              </div>

              <!-- Quick Add Winner Sub-form -->
              <div v-if="showQuickAddWinner" class="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2 mb-2">
                <div v-if="quickWinnerError" class="text-xs text-red-600 font-semibold">{{ quickWinnerError }}</div>
                <input
                  v-model="quickWinnerName"
                  type="text"
                  placeholder="Winner Full Name"
                  class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                />
                <input
                  v-model="quickWinnerPhone"
                  type="tel"
                  placeholder="Winner Phone (Optional)"
                  class="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                />
                <button
                  type="button"
                  :disabled="quickWinnerSaving"
                  @click="handleQuickAddWinner"
                  class="w-full py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-lg transition disabled:opacity-50 shadow-2xs"
                >
                  {{ quickWinnerSaving ? 'Saving...' : 'Save Winner' }}
                </button>
              </div>

              <select
                v-model="soulForm.won_by"
                required
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              >
                <option value="" disabled>Select Soul Winner</option>
                <option v-for="w in formWinners" :key="w.id" :value="w.id">{{ w.full_name }}</option>
              </select>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Notes / Prayer Requests</label>
              <textarea
                v-model="soulForm.notes"
                rows="2"
                placeholder="Any special remarks..."
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              ></textarea>
            </div>
          </div>

          <!-- Sticky Footer Actions -->
          <div class="p-4 border-t border-gray-100 flex items-center justify-end gap-2 shrink-0 bg-gray-50/50">
            <button
              type="button"
              @click="showSoulModal = false"
              class="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="modalSaving"
              class="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50"
            >
              {{ modalSaving ? 'Saving...' : (editingSoulId ? 'Update Soul' : 'Record Soul') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
