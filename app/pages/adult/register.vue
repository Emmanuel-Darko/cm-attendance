<script setup lang="ts">
type PublicAdultVisitor = {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  visit_date: string
  first_time_guest: boolean
  address: string | null
  occupation: string | null
  how_heard: string | null
  interested_in: string[]
  notes: string | null
  created_at: string
}

definePageMeta({
  layout: 'auth'
})

useHead({ title: 'Visitor Registration' })

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

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  visit_date: new Date().toISOString().slice(0, 10),
  first_time_guest: true,
  address: '',
  occupation: '',
  how_heard: '',
  interested_in: [] as string[],
  notes: ''
})

const submitted = ref<PublicAdultVisitor | null>(null)
const submitting = ref(false)
const error = ref<string | null>(null)

function toggleInterest(value: string) {
  form.value.interested_in = form.value.interested_in.includes(value)
    ? form.value.interested_in.filter((item) => item !== value)
    : [...form.value.interested_in, value]
}

function interestLabel(value: string) {
  return interestOptions.find((option) => option.value === value)?.label || value
}

async function submitVisitor() {
  error.value = null

  if (!form.value.first_name.trim() || !form.value.last_name.trim()) {
    error.value = 'First and last name are required.'
    return
  }
  
  submitting.value = true
  try {
    submitted.value = await $fetch<PublicAdultVisitor>('/api/adult-visitors/public', {
      method: 'POST',
      body: form.value
    })
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Could not submit your details.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-3 py-6 sm:px-6 sm:py-10">
    <div class="mx-auto w-full max-w-3xl">
      <div class="text-center mb-6 sm:mb-8">
        <div class="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3M9 7a3 3 0 110 6 3 3 0 010-6zM4 20a5 5 0 0110 0" />
          </svg>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Visitor Registration
        </h1>
        <p class="mt-2 text-sm sm:text-base text-gray-600 font-medium">
          Share your details so our team can welcome and follow up with you.
        </p>
      </div>

      <div v-if="submitted" class="bg-white/85 backdrop-blur-2xl border border-white/60 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8">
        <div class="flex flex-col items-center text-center mb-6">
          <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <svg class="w-9 h-9 text-green-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Submitted</h2>
          <p class="text-sm text-gray-500 mt-1">Here is a preview of what you entered.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div class="rounded-xl bg-gray-50 border border-gray-100 p-3">
            <p class="text-xs font-bold uppercase text-gray-400">Name</p>
            <p class="mt-1 font-semibold text-gray-900">{{ submitted.first_name }} {{ submitted.last_name }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 border border-gray-100 p-3">
            <p class="text-xs font-bold uppercase text-gray-400">Visit date</p>
            <p class="mt-1 font-semibold text-gray-900">{{ submitted.visit_date }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 border border-gray-100 p-3">
            <p class="text-xs font-bold uppercase text-gray-400">Email</p>
            <p class="mt-1 font-semibold text-gray-900">{{ submitted.email || '-' }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 border border-gray-100 p-3">
            <p class="text-xs font-bold uppercase text-gray-400">Phone</p>
            <p class="mt-1 font-semibold text-gray-900">{{ submitted.phone || '-' }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 border border-gray-100 p-3">
            <p class="text-xs font-bold uppercase text-gray-400">First time guest</p>
            <p class="mt-1 font-semibold text-gray-900">{{ submitted.first_time_guest ? 'Yes' : 'No' }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 border border-gray-100 p-3">
            <p class="text-xs font-bold uppercase text-gray-400">How you heard</p>
            <p class="mt-1 font-semibold text-gray-900">{{ submitted.how_heard || '-' }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 border border-gray-100 p-3 sm:col-span-2">
            <p class="text-xs font-bold uppercase text-gray-400">Interested in</p>
            <p class="mt-1 font-semibold text-gray-900">
              {{ submitted.interested_in.length ? submitted.interested_in.map(interestLabel).join(', ') : '-' }}
            </p>
          </div>
          <div class="rounded-xl bg-gray-50 border border-gray-100 p-3 sm:col-span-2">
            <p class="text-xs font-bold uppercase text-gray-400">Notes</p>
            <p class="mt-1 font-semibold text-gray-900 whitespace-pre-wrap">{{ submitted.notes || '-' }}</p>
          </div>
        </div>
      </div>

      <form v-else class="bg-white/85 backdrop-blur-2xl border border-white/60 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8" @submit.prevent="submitVisitor">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div class="space-y-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">First name <span class="text-red-500">*</span></label>
            <input v-model="form.first_name" required type="text" class="w-full px-4 py-2.5 sm:py-3 bg-white/80 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm sm:text-base font-medium" />
          </div>
          <div class="space-y-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Last name <span class="text-red-500">*</span></label>
            <input v-model="form.last_name" required type="text" class="w-full px-4 py-2.5 sm:py-3 bg-white/80 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm sm:text-base font-medium" />
          </div>
          <div class="space-y-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Email</label>
            <input v-model="form.email" type="email" class="w-full px-4 py-2.5 sm:py-3 bg-white/80 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm sm:text-base font-medium" />
          </div>
          <div class="space-y-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Phone <span class="text-red-500">*</span></label>
            <input v-model="form.phone" required type="tel" class="w-full px-4 py-2.5 sm:py-3 bg-white/80 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm sm:text-base font-medium" />
          </div>
          <div class="space-y-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Visit date</label>
            <input v-model="form.visit_date" type="date" class="w-full px-4 py-2.5 sm:py-3 bg-white/80 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm sm:text-base font-medium" />
          </div>
          <div class="space-y-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">How did you hear about us? <span class="text-red-500">*</span></label>
            <select v-model="form.how_heard" required class="w-full px-4 py-2.5 sm:py-3 bg-white/80 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm sm:text-base font-medium">
              <option value="">Select one</option>
              <option v-for="option in howHeardOptions" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
          <div class="space-y-2 sm:col-span-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Address/Location <span class="text-red-500">*</span></label>
            <input v-model="form.address" required type="text" class="w-full px-4 py-2.5 sm:py-3 bg-white/80 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm sm:text-base font-medium" />
          </div>
          <div class="space-y-2 sm:col-span-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Occupation</label>
            <input v-model="form.occupation" type="text" class="w-full px-4 py-2.5 sm:py-3 bg-white/80 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm sm:text-base font-medium" />
          </div>
          <div class="space-y-2 sm:col-span-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Interested in</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in interestOptions"
                :key="option.value"
                type="button"
                class="rounded-full border-2 px-3 py-1.5 text-xs font-bold transition"
                :class="form.interested_in.includes(option.value)
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600'"
                @click="toggleInterest(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
          <div class="space-y-2 sm:col-span-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Assigned to</label>
            <input disabled value="Assigned by our team after submission" class="w-full px-4 py-2.5 sm:py-3 bg-gray-100 border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-500 text-sm sm:text-base font-medium cursor-not-allowed" />
          </div>
          <div class="space-y-2 sm:col-span-2">
            <label class="text-xs sm:text-sm text-gray-700 font-semibold">Notes</label>
            <textarea v-model="form.notes" rows="3" class="w-full px-4 py-2.5 sm:py-3 bg-white/80 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-sm sm:text-base font-medium" />
          </div>
        </div>

        <div v-if="error" class="mt-5 bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 text-sm font-medium text-red-700">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="submitting"
          class="mt-6 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-lg sm:rounded-xl py-3 sm:py-3.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center shadow-xl hover:shadow-2xl hover:scale-[1.01] text-base sm:text-lg gap-2 border border-white/20"
        >
          <svg v-if="submitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ submitting ? 'Submitting...' : 'Submit Details' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>
