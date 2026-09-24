<script setup lang="ts">
import confetti from 'canvas-confetti'
import {
  useSoulsTracking,
  type SoulInput,
  type SoulStatus,
  type SoulRecord
} from '~/composables/useSoulsTracking'

definePageMeta({
  layout: 'auth'
})

useHead({
  title: "Field Soul Logging — Chairman's 800,000 Souls Project"
})

const {
  teams,
  winners,
  fetchTeams,
  fetchWinners,
  addWinner,
  addSoul
} = useSoulsTracking()

// Form state
const form = ref<SoulInput>({
  full_name: '',
  phone: '',
  location: '',
  date_won: new Date().toISOString().slice(0, 10),
  status: 'new',
  won_by: '',
  notes: ''
})

const selectedTeamId = ref<string>('')
const submitting = ref(false)
const error = ref<string | null>(null)
const submittedSoul = ref<SoulRecord | null>(null)

// Quick add winner sub-form
const showQuickAddWinner = ref(false)
const quickWinnerName = ref('')
const quickWinnerPhone = ref('')
const quickWinnerSaving = ref(false)
const quickWinnerError = ref<string | null>(null)

const statusOptions: { value: SoulStatus; label: string }[] = [
  { value: 'new', label: 'New Souls' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_discipleship', label: 'In discipleship' },
  { value: 'baptized', label: 'Baptized' },
  { value: 'integrated', label: 'Integrated' }
]

const formWinners = computed(() => {
  if (!selectedTeamId.value) return winners.value
  return winners.value.filter((w) => w.team_id === selectedTeamId.value)
})

const selectedWinner = computed(() => {
  return winners.value.find((w) => w.id === form.value.won_by) || null
})

const selectedTeam = computed(() => {
  return teams.value.find((t) => t.id === selectedTeamId.value) || null
})

function onTeamChange() {
  localStorage.setItem('field_soul_team_id', selectedTeamId.value)
  const currentWinner = winners.value.find((w) => w.id === form.value.won_by)
  if (!currentWinner || currentWinner.team_id !== selectedTeamId.value) {
    const firstMatchingWinner = formWinners.value[0]
    form.value.won_by = firstMatchingWinner ? firstMatchingWinner.id : ''
    if (form.value.won_by) {
      localStorage.setItem('field_soul_winner_id', form.value.won_by)
    }
  }
}

function onWinnerChange() {
  if (form.value.won_by) {
    localStorage.setItem('field_soul_winner_id', form.value.won_by)
  }
}

async function handleQuickAddWinner() {
  quickWinnerError.value = null
  if (!quickWinnerName.value.trim()) {
    quickWinnerError.value = 'Winner full name is required.'
    return
  }
  if (!selectedTeamId.value) {
    quickWinnerError.value = 'Please select a team first.'
    return
  }

  quickWinnerSaving.value = true
  try {
    const created = await addWinner({
      full_name: quickWinnerName.value.trim(),
      team_id: selectedTeamId.value,
      phone: quickWinnerPhone.value.trim() || null
    })
    form.value.won_by = created.id
    localStorage.setItem('field_soul_winner_id', created.id)
    quickWinnerName.value = ''
    quickWinnerPhone.value = ''
    showQuickAddWinner.value = false
  } catch (err: any) {
    quickWinnerError.value = err?.data?.statusMessage || 'Could not add soul winner.'
  } finally {
    quickWinnerSaving.value = false
  }
}

async function submitSoul() {
  error.value = null

  if (!form.value.full_name.trim()) {
    error.value = 'Soul full name is required.'
    return
  }

  if (!form.value.won_by) {
    error.value = 'Please select the soul winner who won this soul.'
    return
  }

  submitting.value = true
  try {
    const created = await addSoul(form.value)
    submittedSoul.value = created

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      })
    } catch {}
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Could not record soul. Please try again.'
  } finally {
    submitting.value = false
  }
}

function logAnother() {
  // Keep saved team and winner, reset new soul details
  form.value.full_name = ''
  form.value.phone = ''
  form.value.location = ''
  form.value.date_won = new Date().toISOString().slice(0, 10)
  form.value.status = 'new'
  form.value.notes = ''
  submittedSoul.value = null
  error.value = null

  nextTick(() => {
    document.getElementById('soul-name-input')?.focus()
  })
}

onMounted(async () => {
  await Promise.all([fetchTeams(), fetchWinners()])

  // Restore saved team & winner from localStorage if available
  const savedTeamId = localStorage.getItem('field_soul_team_id')
  const savedWinnerId = localStorage.getItem('field_soul_winner_id')

  if (savedTeamId && teams.value.some((t) => t.id === savedTeamId)) {
    selectedTeamId.value = savedTeamId
  } else if (teams.value.length > 0) {
    selectedTeamId.value = teams.value[0].id
  }

  if (savedWinnerId && winners.value.some((w) => w.id === savedWinnerId && w.team_id === selectedTeamId.value)) {
    form.value.won_by = savedWinnerId
  } else if (formWinners.value.length > 0) {
    form.value.won_by = formWinners.value[0].id
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-3 py-6 sm:px-6 sm:py-10 text-gray-900">
    <div class="mx-auto w-full max-w-2xl">
      
      <!-- Top Navigation -->
      <div class="flex items-center justify-between gap-3 mb-6">
        <NuxtLink
          to="/souls"
          class="inline-flex items-center gap-2 px-3.5 py-2 bg-white/90 backdrop-blur-md rounded-xl text-gray-700 hover:text-indigo-600 border border-white/60 shadow-sm transition-all text-xs sm:text-sm font-semibold"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Souls Dashboard</span>
        </NuxtLink>

        <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-amber-800 text-[11px] font-bold uppercase tracking-wider">
          <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          Active Field Mode
        </span>
      </div>

      <!-- Header Title Banner -->
      <div class="text-center mb-6 sm:mb-8">
        <div class="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-3">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2C9.5 5.5 10 8 8 10.5C6.5 8.5 6.5 6 6.5 6C4.5 9 4 12 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14C20 9 16 5 12 2Z" />
          </svg>
        </div>
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Record Won Soul
        </h1>
        <p class="mt-1 text-xs sm:text-sm text-gray-600 font-medium">
          Quick field intake for active evangelism & soul winning
        </p>
      </div>

      <!-- SUCCESS CONFIRMATION SCREEN -->
      <div
        v-if="submittedSoul"
        class="bg-white/95 backdrop-blur-2xl border border-white/60 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center"
      >
        <div class="w-16 h-16 rounded-full bg-green-100 border-2 border-green-200 flex items-center justify-center mx-auto mb-4 text-green-600">
          <svg class="w-9 h-9" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 class="text-2xl font-black text-gray-900">Praise God! Soul Recorded</h2>
        <p class="text-sm text-gray-500 mt-1">Another precious soul added to the Kingdom and credited to your team.</p>

        <!-- Summary Card -->
        <div class="my-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-left space-y-2.5 text-xs sm:text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500 font-medium">Soul Name:</span>
            <span class="font-bold text-gray-900">{{ submittedSoul.full_name }}</span>
          </div>
          <div v-if="submittedSoul.phone" class="flex justify-between">
            <span class="text-gray-500 font-medium">Phone:</span>
            <span class="font-semibold text-gray-800">{{ submittedSoul.phone }}</span>
          </div>
          <div v-if="submittedSoul.location" class="flex justify-between">
            <span class="text-gray-500 font-medium">Location:</span>
            <span class="font-semibold text-gray-800">{{ submittedSoul.location }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 font-medium">Date Won:</span>
            <span class="font-semibold text-gray-800">{{ submittedSoul.date_won }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 font-medium">Soul Winner:</span>
            <span class="font-bold text-indigo-700">{{ submittedSoul.won_by_name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 font-medium">Team:</span>
            <span class="font-bold text-purple-700">{{ submittedSoul.team_name }}</span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-indigo-100/70">
            <span class="text-gray-500 font-medium">Status:</span>
            <span class="font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] border border-amber-200">
              {{ submittedSoul.status }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            @click="logAnother"
            class="flex-1 py-3.5 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Record Another Soul</span>
          </button>

          <NuxtLink
            to="/souls"
            class="py-3.5 px-6 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 hover:text-indigo-600 font-bold rounded-xl transition text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <span>View Dashboard</span>
          </NuxtLink>
        </div>
      </div>

      <!-- INTAKE FORM FOR ACTIVE SOUL WINNER -->
      <form
        v-else
        class="bg-white/95 backdrop-blur-2xl border border-white/60 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 space-y-4 sm:space-y-5"
        @submit.prevent="submitSoul"
      >
        <div v-if="error" class="p-3.5 bg-red-50 border-2 border-red-200 rounded-xl text-xs sm:text-sm font-medium text-red-700">
          {{ error }}
        </div>

        <!-- Soul Winner & Team Setup Card (Saved in state) -->
        <div class="p-4 bg-indigo-50/60 rounded-2xl border-2 border-indigo-100 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Evangelist / Winner Identity
            </span>
            <span class="text-[10px] text-gray-500">Auto-saved on device</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Team Selector -->
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">
                Your Team <span class="text-red-500">*</span>
              </label>
              <select
                v-model="selectedTeamId"
                @change="onTeamChange"
                required
                class="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="" disabled>Select your team</option>
                <option v-for="t in teams" :key="t.id" :value="t.id">
                  {{ t.name }}
                </option>
              </select>
            </div>

            <!-- Winner Selector -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-bold text-gray-700">
                  Your Name <span class="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  @click="showQuickAddWinner = !showQuickAddWinner"
                  class="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                >
                  {{ showQuickAddWinner ? 'Cancel' : '+ New Person' }}
                </button>
              </div>

              <!-- Inline Quick Add Winner Sub-form -->
              <div
                v-if="showQuickAddWinner"
                class="mb-2 p-3 bg-white border-2 border-indigo-200 rounded-xl space-y-2"
              >
                <p class="text-xs font-bold text-indigo-900">Add Yourself / Person to Team</p>
                <div v-if="quickWinnerError" class="text-xs text-red-600">{{ quickWinnerError }}</div>
                <input
                  v-model="quickWinnerName"
                  type="text"
                  placeholder="Full name"
                  class="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900"
                />
                <input
                  v-model="quickWinnerPhone"
                  type="tel"
                  placeholder="Phone (optional)"
                  class="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900"
                />
                <button
                  type="button"
                  :disabled="quickWinnerSaving"
                  @click="handleQuickAddWinner"
                  class="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition"
                >
                  {{ quickWinnerSaving ? 'Saving...' : 'Save & Select' }}
                </button>
              </div>

              <select
                v-model="form.won_by"
                @change="onWinnerChange"
                required
                class="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="" disabled>Select your name</option>
                <option v-for="w in formWinners" :key="w.id" :value="w.id">
                  {{ w.full_name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Soul Full Name (Autofocus) -->
        <div>
          <label class="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
            Soul's Full Name <span class="text-red-500">*</span>
          </label>
          <input
            id="soul-name-input"
            v-model="form.full_name"
            type="text"
            required
            placeholder="e.g. Mary Asantewaa"
            class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-base sm:text-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm"
          />
        </div>

        <!-- Phone & Location Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="e.g. 024 123 4567"
              class="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition font-medium"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Area / Community</label>
            <input
              v-model="form.location"
              type="text"
              placeholder="e.g. Madina Station, Market"
              class="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition font-medium"
            />
          </div>
        </div>

        <!-- Date Won -->
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Date Won</label>
          <input
            v-model="form.date_won"
            type="date"
            required
            class="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition font-medium"
          />
        </div>

        <!-- Notes / Follow-up notes -->
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Notes / Prayer Request (Optional)</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="e.g. Wants to join choir, accepted salvation prayer enthusiastically..."
            class="w-full px-3.5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          ></textarea>
        </div>

        <!-- Big Submit Button -->
        <button
          type="submit"
          :disabled="submitting"
          class="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-extrabold rounded-xl py-3.5 sm:py-4 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] text-base sm:text-lg flex justify-center items-center gap-2 border border-white/20 disabled:opacity-60"
        >
          <svg v-if="submitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="submitting">Recording Soul...</span>
          <span v-else>Record Soul Won</span>
        </button>
      </form>

    </div>
  </div>
</template>
