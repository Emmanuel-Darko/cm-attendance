<script setup lang="ts">
import { useAdultVisitors, type AdultVisitorInput, type FollowUpStatus } from '~/composables/useAdultVisitors'

useHead({ title: 'Adult Visitors' })

const { visitors, pending, error, fetchVisitors, addVisitor, updateVisitor, removeVisitor } =
  useAdultVisitors()

const search = ref('')
const statusFilter = ref<'all' | FollowUpStatus>('all')
const showForm = ref(false)

const statusOptions: { value: FollowUpStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'scheduled', label: 'Meeting scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'no_response', label: 'No response' }
]

const howHeardOptions = [
  'Friend or family',
  'Website',
  'Social media',
  'Drove by / saw the building',
  'Community event',
  'Other'
]

const interestOptions = [
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'evangelism', label: 'Evangelism' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'prayer', label: 'Prayer' },
  { value: 'singing', label: 'Singing' },
  { value: 'tambourine', label: 'Tambourine' },
  { value: 'instruments', label: 'Instruments' }
]

const emptyForm = (): AdultVisitorInput => ({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  visit_date: new Date().toISOString().slice(0, 10),
  address: '',
  how_heard: '',
  interested_in: [],
  assigned_to: '',
  notes: ''
})

const form = ref<AdultVisitorInput>(emptyForm())
const saving = ref(false)
const formError = ref<string | null>(null)

const totalNew = computed(() => visitors.value.filter((visitor) => visitor.follow_up_status === 'new').length)
const totalCompleted = computed(() => visitors.value.filter((visitor) => visitor.follow_up_status === 'completed').length)

async function refresh() {
  await fetchVisitors({
    status: statusFilter.value,
    search: search.value || undefined
  })
}

let searchTimeout: ReturnType<typeof setTimeout>
watch(search, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(refresh, 300)
})
watch(statusFilter, refresh)

onMounted(refresh)

function toggleInterest(value: string) {
  const list = form.value.interested_in || []
  form.value.interested_in = list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]
}

async function submitForm() {
  formError.value = null
  if (!form.value.first_name?.trim() || !form.value.last_name?.trim()) {
    formError.value = 'First and last name are required.'
    return
  }

  saving.value = true
  try {
    await addVisitor(form.value)
    form.value = emptyForm()
    showForm.value = false
  } catch {
    formError.value = error.value
  } finally {
    saving.value = false
  }
}

async function onStatusChange(id: string, status: FollowUpStatus) {
  await updateVisitor(id, { follow_up_status: status })
}

async function onRemove(id: string) {
  if (confirm('Remove this visitor record? This cannot be undone.')) {
    await removeVisitor(id)
  }
}

function initials(first: string, last: string) {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase()
}

function statusLabel(status: FollowUpStatus) {
  return statusOptions.find((option) => option.value === status)?.label || status
}

const statusStyles: Record<FollowUpStatus, string> = {
  new: 'bg-yellow-100 text-yellow-700',
  contacted: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  no_response: 'bg-gray-100 text-gray-700'
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div class="mb-4 sm:mb-6 md:mb-8">
        <NuxtLink
          to="/"
          class="group inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-gray-700 hover:text-indigo-600 border border-gray-100"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="font-medium text-sm sm:text-base">Back</span>
        </NuxtLink>
      </div>

      <div class="text-center mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Adult Visitors
        </h1>
        <p class="text-sm sm:text-base text-gray-600">Track guest details, follow-up status, and assignments.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-indigo-100/50 p-4 sm:p-5">
          <p class="text-xs font-semibold uppercase text-gray-500">Records</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ visitors.length }}</p>
        </div>
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-yellow-100 p-4 sm:p-5">
          <p class="text-xs font-semibold uppercase text-gray-500">New</p>
          <p class="mt-2 text-3xl font-bold text-yellow-600">{{ totalNew }}</p>
        </div>
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-green-100 p-4 sm:p-5">
          <p class="text-xs font-semibold uppercase text-gray-500">Completed</p>
          <p class="mt-2 text-3xl font-bold text-green-600">{{ totalCompleted }}</p>
        </div>
      </div>

      <section class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-indigo-100/50 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3M9 7a3 3 0 110 6 3 3 0 010-6zM4 20a5 5 0 0110 0" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Visitor Management</h2>
              <p class="text-xs sm:text-sm text-gray-500">Add visitors or update follow-up progress.</p>
            </div>
          </div>

          <button
            type="button"
            class="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
            @click="showForm = !showForm"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path v-if="!showForm" stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ showForm ? 'Close Form' : 'Log Visitor' }}
          </button>
        </div>

        <form v-if="showForm" class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6 rounded-xl border-2 border-indigo-100 bg-indigo-50/40 p-4 sm:p-5" @submit.prevent="submitForm">
          <div class="space-y-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">First name <span class="text-red-500">*</span></label>
            <input v-model="form.first_name" type="text" required class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base bg-white" />
          </div>
          <div class="space-y-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Last name <span class="text-red-500">*</span></label>
            <input v-model="form.last_name" type="text" required class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base bg-white" />
          </div>
          <div class="space-y-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Email</label>
            <input v-model="form.email" type="email" class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base bg-white" />
          </div>
          <div class="space-y-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Phone</label>
            <input v-model="form.phone" type="tel" class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base bg-white" />
          </div>
          <div class="space-y-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Visit date</label>
            <input v-model="form.visit_date" type="date" class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base bg-white" />
          </div>
          <div class="space-y-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Address / Location</label>
            <input v-model="form.address" type="text" placeholder="City, neighborhood, or address" class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base bg-white" />
          </div>
          <div class="space-y-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">How they heard</label>
            <select v-model="form.how_heard" class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base bg-white">
              <option value="">Select one</option>
              <option v-for="option in howHeardOptions" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Assigned to</label>
            <input v-model="form.assigned_to" type="text" placeholder="Greeter or staff member" class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base bg-white" />
          </div>
          <div class="space-y-2 sm:col-span-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Interested in</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in interestOptions"
                :key="option.value"
                type="button"
                class="rounded-full border-2 px-3 py-1.5 text-xs font-bold transition"
                :class="(form.interested_in || []).includes(option.value)
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600'"
                @click="toggleInterest(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
          <div class="space-y-2 sm:col-span-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Notes</label>
            <textarea v-model="form.notes" rows="3" class="w-full border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base bg-white" />
          </div>

          <div v-if="formError" class="sm:col-span-2 bg-red-50 border-2 border-red-200 rounded-xl p-3 text-sm font-medium text-red-700">
            {{ formError }}
          </div>

          <div class="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button type="button" class="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-white transition" @click="showForm = false">
              Cancel
            </button>
            <button type="submit" :disabled="saving" class="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition disabled:opacity-60">
              {{ saving ? 'Saving...' : 'Save Visitor' }}
            </button>
          </div>
        </form>

        <div class="flex flex-col md:flex-row gap-3 mb-5">
          <div class="relative flex-1">
            <svg class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="search" type="search" placeholder="Search by name or email..." class="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white text-sm sm:text-base" />
          </div>
          <select v-model="statusFilter" class="w-full md:w-60 border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white text-sm sm:text-base font-medium">
            <option value="all">All statuses</option>
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </div>

        <div v-if="error" class="mb-5 bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 text-sm font-medium text-red-700">
          {{ error }}
        </div>

        <div class="hidden md:block overflow-x-auto rounded-xl border-2 border-gray-200">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
                <th class="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Guest</th>
                <th class="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact</th>
                <th class="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Visit</th>
                <th class="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Assigned</th>
                <th class="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th class="py-4 px-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pending">
                <td colspan="6" class="p-12 text-center font-medium text-gray-500">Loading visitors...</td>
              </tr>
              <tr v-else-if="!visitors.length">
                <td colspan="6" class="p-12 text-center">
                  <p class="font-semibold text-lg text-gray-600">No visitors found</p>
                  <p class="text-sm text-gray-400 mt-1">Log a visitor or share the public registration page.</p>
                </td>
              </tr>
              <tr v-for="visitor in visitors" :key="visitor.id" class="border-b border-gray-100 hover:bg-gray-50 transition">
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                      {{ initials(visitor.first_name, visitor.last_name) }}
                    </div>
                    <div>
                      <p class="font-bold text-gray-900">{{ visitor.first_name }} {{ visitor.last_name }}</p>
                      <p class="text-xs text-gray-500">{{ visitor.how_heard || 'No source recorded' }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-4 text-gray-600">
                  <p>{{ visitor.email || '-' }}</p>
                  <p class="text-xs text-gray-400">{{ visitor.phone || '' }}</p>
                </td>
                <td class="py-4 px-4 text-gray-600">{{ visitor.visit_date }}</td>
                <td class="py-4 px-4 text-gray-600">{{ visitor.assigned_to || '-' }}</td>
                <td class="py-4 px-4">
                  <select
                    :value="visitor.follow_up_status"
                    class="rounded-full border-0 px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :class="statusStyles[visitor.follow_up_status]"
                    @change="onStatusChange(visitor.id, ($event.target as HTMLSelectElement).value as FollowUpStatus)"
                  >
                    <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                  </select>
                </td>
                <td class="py-4 px-4 text-right">
                  <button type="button" class="p-2.5 text-red-600 hover:bg-red-100 rounded-xl transition-colors" @click="onRemove(visitor.id)">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden space-y-3">
          <div v-if="pending" class="p-8 text-center font-medium text-gray-500">Loading visitors...</div>
          <div v-else-if="!visitors.length" class="p-8 text-center rounded-xl border-2 border-gray-200 bg-gray-50">
            <p class="font-semibold text-gray-600">No visitors found</p>
          </div>
          <template v-else>
            <div v-for="visitor in visitors" :key="visitor.id" class="rounded-xl border-2 border-gray-200 bg-white p-4 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                  {{ initials(visitor.first_name, visitor.last_name) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <h3 class="font-bold text-gray-900">{{ visitor.first_name }} {{ visitor.last_name }}</h3>
                      <p class="text-xs text-gray-500">{{ visitor.visit_date }}</p>
                    </div>
                    <button type="button" class="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors" @click="onRemove(visitor.id)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div class="mt-3 space-y-1 text-sm text-gray-600">
                    <p>{{ visitor.email || '-' }}</p>
                    <p>{{ visitor.phone || '' }}</p>
                    <p>Assigned: {{ visitor.assigned_to || '-' }}</p>
                  </div>
                  <select
                    :value="visitor.follow_up_status"
                    class="mt-3 rounded-full border-0 px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :class="statusStyles[visitor.follow_up_status]"
                    @change="onStatusChange(visitor.id, ($event.target as HTMLSelectElement).value as FollowUpStatus)"
                  >
                    <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                  </select>
                </div>
              </div>
            </div>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>
