<script setup lang="ts">
import {
  useSoulsTracking,
  type SoulTeamItem,
  type SoulWinnerItem
} from '~/composables/useSoulsTracking'

useHead({
  title: "Teams & Winners Directory — Chairman's 800,000 Souls Project"
})

const {
  teams,
  winners,
  fetchTeams,
  addTeam,
  updateTeam,
  deleteTeam,
  fetchWinners,
  addWinner,
  updateWinner,
  deleteWinner
} = useSoulsTracking()

const selectedTeamId = ref<string>('')
const loadingTeams = ref(false)
const loadingWinners = ref(false)
const generalError = ref<string | null>(null)

// Team Modals
const showTeamModal = ref(false)
const editingTeamId = ref<string | null>(null)
const teamFormName = ref('')
const teamFormColor = ref('amber')
const teamSaving = ref(false)
const teamModalError = ref<string | null>(null)

// Winner Modals
const showWinnerModal = ref(false)
const editingWinnerId = ref<string | null>(null)
const winnerFormName = ref('')
const winnerFormPhone = ref('')
const winnerFormTeamId = ref('')
const winnerSaving = ref(false)
const winnerModalError = ref<string | null>(null)

const colorOptions = [
  { value: 'amber', label: 'Amber / Gold', bg: 'bg-amber-400' },
  { value: 'teal', label: 'Teal / Cyan', bg: 'bg-teal-400' },
  { value: 'indigo', label: 'Indigo / Navy', bg: 'bg-indigo-500' },
  { value: 'rose', label: 'Rose / Pink', bg: 'bg-rose-400' },
  { value: 'emerald', label: 'Emerald / Green', bg: 'bg-emerald-400' },
  { value: 'purple', label: 'Purple / Violet', bg: 'bg-purple-500' },
  { value: 'sky', label: 'Sky / Light Blue', bg: 'bg-sky-400' },
  { value: 'orange', label: 'Orange / Flame', bg: 'bg-orange-400' }
]

const selectedTeam = computed(() => {
  return teams.value.find((t) => t.id === selectedTeamId.value) || teams.value[0] || null
})

const selectedTeamWinners = computed(() => {
  if (!selectedTeam.value) return []
  return winners.value.filter((w) => w.team_id === selectedTeam.value.id)
})

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

// Team handlers
function openAddTeamModal() {
  editingTeamId.value = null
  teamFormName.value = ''
  teamFormColor.value = 'amber'
  teamModalError.value = null
  showTeamModal.value = true
}

function openEditTeamModal(team: SoulTeamItem) {
  editingTeamId.value = team.id
  teamFormName.value = team.name
  teamFormColor.value = team.color_tag || 'amber'
  teamModalError.value = null
  showTeamModal.value = true
}

async function saveTeam() {
  teamModalError.value = null
  if (!teamFormName.value.trim()) {
    teamModalError.value = 'Team name is required.'
    return
  }

  teamSaving.value = true
  try {
    if (editingTeamId.value) {
      await updateTeam(editingTeamId.value, {
        name: teamFormName.value.trim(),
        color_tag: teamFormColor.value
      })
    } else {
      const created = await addTeam({
        name: teamFormName.value.trim(),
        color_tag: teamFormColor.value
      })
      selectedTeamId.value = created.id
    }
    showTeamModal.value = false
    await refreshData()
  } catch (err: any) {
    teamModalError.value = err?.data?.statusMessage || 'Could not save team.'
  } finally {
    teamSaving.value = false
  }
}

async function handleRemoveTeam(team: SoulTeamItem) {
  if (confirm(`Are you sure you want to delete team "${team.name}"?`)) {
    generalError.value = null
    try {
      await deleteTeam(team.id)
      if (selectedTeamId.value === team.id) {
        selectedTeamId.value = teams.value.length > 0 ? teams.value[0].id : ''
      }
      await refreshData()
    } catch (err: any) {
      generalError.value = err?.data?.statusMessage || 'Could not delete team.'
    }
  }
}

// Winner handlers
function openAddWinnerModal() {
  editingWinnerId.value = null
  winnerFormName.value = ''
  winnerFormPhone.value = ''
  winnerFormTeamId.value = selectedTeam.value ? selectedTeam.value.id : teams.value[0]?.id || ''
  winnerModalError.value = null
  showWinnerModal.value = true
}

function openEditWinnerModal(w: SoulWinnerItem) {
  editingWinnerId.value = w.id
  winnerFormName.value = w.full_name
  winnerFormPhone.value = w.phone || ''
  winnerFormTeamId.value = w.team_id
  winnerModalError.value = null
  showWinnerModal.value = true
}

async function saveWinner() {
  winnerModalError.value = null
  if (!winnerFormName.value.trim()) {
    winnerModalError.value = 'Full name is required.'
    return
  }
  if (!winnerFormTeamId.value) {
    winnerModalError.value = 'Please select a team.'
    return
  }

  winnerSaving.value = true
  try {
    if (editingWinnerId.value) {
      await updateWinner(editingWinnerId.value, {
        full_name: winnerFormName.value.trim(),
        phone: winnerFormPhone.value.trim() || null,
        team_id: winnerFormTeamId.value
      })
    } else {
      await addWinner({
        full_name: winnerFormName.value.trim(),
        phone: winnerFormPhone.value.trim() || null,
        team_id: winnerFormTeamId.value
      })
    }
    showWinnerModal.value = false
    await refreshData()
  } catch (err: any) {
    winnerModalError.value = err?.data?.statusMessage || 'Could not save soul winner.'
  } finally {
    winnerSaving.value = false
  }
}

async function handleRemoveWinner(w: SoulWinnerItem) {
  if (confirm(`Remove soul winner "${w.full_name}"?`)) {
    generalError.value = null
    try {
      await deleteWinner(w.id)
      await refreshData()
    } catch (err: any) {
      generalError.value = err?.data?.statusMessage || 'Could not delete soul winner.'
    }
  }
}

async function refreshData() {
  loadingTeams.value = true
  loadingWinners.value = true
  try {
    await Promise.all([fetchTeams(), fetchWinners()])
    if (!selectedTeamId.value && teams.value.length > 0) {
      selectedTeamId.value = teams.value[0].id
    }
  } catch (err: any) {
    generalError.value = err?.data?.statusMessage || 'Could not load data.'
  } finally {
    loadingTeams.value = false
    loadingWinners.value = false
  }
}

onMounted(() => {
  refreshData()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900 pb-16">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 md:pt-8">
      
      <!-- Top Navigation -->
      <div class="flex items-center justify-between gap-3 mb-6 pr-16 sm:pr-0">
        <NuxtLink
          to="/souls"
          class="group inline-flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-gray-700 hover:text-indigo-600 border border-gray-100"
        >
          <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="font-medium text-sm">Back to Souls Dashboard</span>
        </NuxtLink>
      </div>

      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Teams & Soul Winners Directory
        </h1>
        <p class="text-sm text-gray-600 mt-1">
          Manage the teams participating in the Chairman's 800,000 Souls Project and the soul winners assigned to each.
        </p>
      </div>

      <!-- Global Alert -->
      <div v-if="generalError" class="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-sm font-medium text-red-700 flex items-center justify-between">
        <span>{{ generalError }}</span>
        <button type="button" @click="generalError = null" class="text-red-500 hover:text-red-800 font-bold">✕</button>
      </div>

      <!-- TWO-PANEL RESPONSIVE LAYOUT -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- LEFT PANEL: Teams List (5 Cols) -->
        <div class="lg:col-span-5 bg-white border border-indigo-100/50 rounded-2xl sm:rounded-3xl p-5 shadow-xl flex flex-col h-full">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div>
              <h2 class="font-bold text-lg text-gray-900">Teams ({{ teams.length }})</h2>
              <p class="text-xs text-gray-500">Select a team to view its soul winners</p>
            </div>
            <button
              type="button"
              @click="openAddTeamModal"
              class="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              + New Team
            </button>
          </div>

          <div v-if="loadingTeams" class="text-center py-12 text-gray-500 text-sm">
            Loading teams...
          </div>

          <div v-else-if="!teams.length" class="text-center py-12 text-gray-500 text-sm">
            <p class="font-bold text-gray-700">No teams created yet</p>
            <p class="text-xs text-gray-400 mt-1">Create your first team to start assigning soul winners.</p>
            <button
              type="button"
              @click="openAddTeamModal"
              class="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
            >
              Create Team
            </button>
          </div>

          <div v-else class="space-y-2.5 overflow-y-auto max-h-[550px] pr-1">
            <div
              v-for="team in teams"
              :key="team.id"
              @click="selectedTeamId = team.id"
              class="p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3"
              :class="[
                selectedTeam?.id === team.id
                  ? 'bg-indigo-50/70 border-indigo-500 shadow-md ring-2 ring-indigo-200'
                  : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
              ]"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span
                  class="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                  :class="[
                    team.color_tag === 'amber' ? 'bg-amber-400' :
                    team.color_tag === 'teal' ? 'bg-teal-400' :
                    team.color_tag === 'indigo' ? 'bg-indigo-500' :
                    team.color_tag === 'rose' ? 'bg-rose-400' :
                    team.color_tag === 'emerald' ? 'bg-emerald-400' :
                    team.color_tag === 'purple' ? 'bg-purple-500' :
                    team.color_tag === 'sky' ? 'bg-sky-400' :
                    'bg-orange-400'
                  ]"
                ></span>
                <div class="min-w-0">
                  <h3 class="font-bold text-gray-900 text-sm truncate">{{ team.name }}</h3>
                  <div class="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>{{ team.member_count || 0 }} members</span>
                    <span>•</span>
                    <span class="text-indigo-600 font-bold">{{ (team.soul_count || 0).toLocaleString() }} souls</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1 shrink-0" @click.stop>
                <button
                  type="button"
                  @click="openEditTeamModal(team)"
                  class="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition"
                  title="Edit team"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  @click="handleRemoveTeam(team)"
                  class="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition"
                  title="Delete team"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT PANEL: Soul Winners in Selected Team (7 Cols) -->
        <div class="lg:col-span-7 bg-white border border-indigo-100/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col h-full">
          
          <div v-if="!selectedTeam" class="text-center py-16 text-gray-400 text-sm">
            Select or create a team on the left to manage its soul winners.
          </div>

          <template v-else>
            <!-- Team Active Banner -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-5">
              <div class="flex items-center gap-3">
                <div class="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <span
                    class="block w-4 h-4 rounded-full"
                    :class="[
                      selectedTeam.color_tag === 'amber' ? 'bg-amber-400' :
                      selectedTeam.color_tag === 'teal' ? 'bg-teal-400' :
                      selectedTeam.color_tag === 'indigo' ? 'bg-indigo-500' :
                      selectedTeam.color_tag === 'rose' ? 'bg-rose-400' :
                      selectedTeam.color_tag === 'emerald' ? 'bg-emerald-400' :
                      selectedTeam.color_tag === 'purple' ? 'bg-purple-500' :
                      selectedTeam.color_tag === 'sky' ? 'bg-sky-400' :
                      'bg-orange-400'
                    ]"
                  ></span>
                </div>
                <div>
                  <h2 class="text-xl font-extrabold text-gray-900">{{ selectedTeam.name }}</h2>
                  <p class="text-xs text-gray-500">
                    {{ selectedTeamWinners.length }} soul winners assigned • {{ (selectedTeam.soul_count || 0).toLocaleString() }} souls recorded
                  </p>
                </div>
              </div>

              <button
                type="button"
                @click="openAddWinnerModal"
                class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Winner to {{ selectedTeam.name }}</span>
              </button>
            </div>

            <!-- Winners List -->
            <div v-if="!selectedTeamWinners.length" class="text-center py-12 bg-gray-50 rounded-2xl border-2 border-gray-200">
              <p class="font-bold text-gray-700">No soul winners in this team yet</p>
              <p class="text-xs text-gray-400 mt-1">Add individuals to this team so they can be credited with won souls.</p>
              <button
                type="button"
                @click="openAddWinnerModal"
                class="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
              >
                Add Person
              </button>
            </div>

            <div v-else class="space-y-2.5 overflow-y-auto max-h-[500px] pr-1">
              <div
                v-for="winner in selectedTeamWinners"
                :key="winner.id"
                class="p-3.5 rounded-2xl bg-gray-50 border-2 border-gray-200 hover:border-indigo-300 transition flex items-center justify-between gap-3"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                    {{ winner.full_name.slice(0, 2).toUpperCase() }}
                  </div>
                  <div class="min-w-0">
                    <h3 class="font-bold text-gray-900 text-sm truncate">{{ winner.full_name }}</h3>
                    <p class="text-xs text-gray-500">{{ winner.phone || 'No phone number' }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-4 shrink-0">
                  <div class="text-right">
                    <span class="font-extrabold text-indigo-600 text-sm sm:text-base">
                      {{ (winner.soul_count || 0).toLocaleString() }}
                    </span>
                    <span class="text-[11px] text-gray-500 ml-1">souls</span>
                  </div>

                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      @click="openEditWinnerModal(winner)"
                      class="p-2 text-indigo-600 hover:bg-indigo-100 rounded-xl transition"
                      title="Edit winner"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      @click="handleRemoveWinner(winner)"
                      class="p-2 text-red-600 hover:bg-red-100 rounded-xl transition"
                      title="Delete winner"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>

        </div>

      </div>

    </div>

    <!-- TEAM MODAL (ADD / EDIT) -->
    <div
      v-if="showTeamModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-950/60 backdrop-blur-sm overflow-hidden"
      @click.self="showTeamModal = false"
    >
      <div class="relative w-full max-w-md bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-2xl text-gray-900 flex flex-col max-h-[90vh] overflow-hidden my-auto">
        <div class="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 shrink-0">
          <h3 class="font-bold text-base sm:text-lg text-gray-900">
            {{ editingTeamId ? 'Edit Team' : 'Create New Team' }}
          </h3>
          <button type="button" @click="showTeamModal = false" class="p-1 text-gray-400 hover:text-gray-700 rounded-lg">✕</button>
        </div>

        <form @submit.prevent="saveTeam" class="flex flex-col flex-1 overflow-hidden min-h-0">
          <div class="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 overscroll-contain">
            <div v-if="teamModalError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-700">
              {{ teamModalError }}
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                Team Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="teamFormName"
                type="text"
                required
                placeholder="e.g. Evangelism Team Alpha"
                class="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-gray-700 mb-2">
                Team Color Tag
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="opt in colorOptions"
                  :key="opt.value"
                  type="button"
                  @click="teamFormColor = opt.value"
                  class="flex items-center gap-2 p-2.5 rounded-xl border-2 text-xs font-bold transition text-left"
                  :class="[
                    teamFormColor === opt.value
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  ]"
                >
                  <span class="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" :class="opt.bg"></span>
                  <span>{{ opt.label }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50/70 shrink-0">
            <button
              type="button"
              @click="showTeamModal = false"
              class="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="teamSaving"
              class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-xs sm:text-sm transition disabled:opacity-60 shadow-md"
            >
              {{ teamSaving ? 'Saving...' : editingTeamId ? 'Update Team' : 'Create Team' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- WINNER MODAL (ADD / EDIT) -->
    <div
      v-if="showWinnerModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-950/60 backdrop-blur-sm overflow-hidden"
      @click.self="showWinnerModal = false"
    >
      <div class="relative w-full max-w-md bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-2xl text-gray-900 flex flex-col max-h-[90vh] overflow-hidden my-auto">
        <div class="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 shrink-0">
          <h3 class="font-bold text-base sm:text-lg text-gray-900">
            {{ editingWinnerId ? 'Edit Soul Winner' : 'Add Soul Winner / Person' }}
          </h3>
          <button type="button" @click="showWinnerModal = false" class="p-1 text-gray-400 hover:text-gray-700 rounded-lg">✕</button>
        </div>

        <form @submit.prevent="saveWinner" class="flex flex-col flex-1 overflow-hidden min-h-0">
          <div class="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 overscroll-contain">
            <div v-if="winnerModalError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-700">
              {{ winnerModalError }}
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="winnerFormName"
                type="text"
                required
                placeholder="e.g. Brother Samuel Mensah"
                class="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                v-model="winnerFormPhone"
                type="tel"
                placeholder="e.g. +233 24 000 0000"
                class="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-gray-700 mb-1">
                Assign to Team <span class="text-red-500">*</span>
              </label>
              <select
                v-model="winnerFormTeamId"
                required
                class="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="" disabled>Select team</option>
                <option v-for="t in teams" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50/70 shrink-0">
            <button
              type="button"
              @click="showWinnerModal = false"
              class="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="winnerSaving"
              class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-xs sm:text-sm transition disabled:opacity-60 shadow-md"
            >
              {{ winnerSaving ? 'Saving...' : editingWinnerId ? 'Update Winner' : 'Add Winner' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>
