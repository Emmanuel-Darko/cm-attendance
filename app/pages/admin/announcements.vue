<script setup lang="ts">
import type { Announcement } from '~/types/database'
import ConfirmModal from '~/components/modals/ConfirmModal.vue'

const { showModal } = useCommon()
const { user } = useAuth()
const announcements = ref<Announcement[]>([])

const fetchAnnouncements = async () => {
  const { data } = await useFetch('/api/admin/announcements', { key: 'announcements-' + Date.now() })
  announcements.value = (data.value || []) as any
}

await fetchAnnouncements()

const formOpen = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({
  title: '',
  content: '',
  published: false
})

function openCreate() {
  editingId.value = null
  form.title = ''
  form.content = ''
  form.published = false
  formOpen.value = true
}

function openEdit(a: any) {
  editingId.value = a.id
  form.title = a.title
  form.content = a.content
  form.published = a.published
  formOpen.value = true
}

async function submitForm() {
  try {
    if (editingId.value) {
      await $fetch(`/api/admin/announcements/${editingId.value}`, {
        method: 'PATCH',
        body: { title: form.title, content: form.content, published: form.published }
      })
    } else {
      // Only set author_id if user has a valid teacher record (has local_id)
      const authorId = user.value?.local_id ? user.value?.id : null
      await $fetch('/api/admin/announcements', {
        method: 'POST',
        body: {
          title: form.title,
          content: form.content,
          published: form.published,
          author_id: authorId
        }
      })
    }
    formOpen.value = false
    await fetchAnnouncements()
  } catch (e: any) {
    alert(e?.data?.statusMessage || e?.message || 'Operation failed')
  }
}

function confirmDelete(a: any) {
  showModal(ConfirmModal, {
    message: `Delete announcement "${a.title}"?`,
    onConfirm: async () => {
      try {
        await $fetch(`/api/admin/announcements/${a.id}`, { method: 'DELETE' })
        await fetchAnnouncements()
      } catch (e: any) {
        alert(e?.data?.statusMessage || e?.message || 'Failed to delete')
      }
    }
  })
}

function togglePublished(a: any) {
  $fetch(`/api/admin/announcements/${a.id}`, {
    method: 'PATCH',
    body: { published: !a.published }
  }).then(() => fetchAnnouncements())
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div class="mb-6 sm:mb-8">
        <NuxtLink to="/admin" class="group inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white/50 hover:bg-white">
          <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="font-semibold text-gray-700">Back to Admin</span>
        </NuxtLink>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
            Announcements
          </h1>
          <p class="text-sm text-gray-600 mt-1">Manage church news and announcements</p>
        </div>
        <button
          class="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-5 py-2.5 sm:py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
          @click="openCreate"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Announcement
        </button>
      </div>

      <!-- Create/Edit Form -->
      <div v-if="formOpen" class="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 mb-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ editingId ? 'Edit Announcement' : 'New Announcement' }}</h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <input
            v-model="form.title"
            type="text"
            placeholder="Announcement title"
            class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all text-sm font-medium"
            required
          />
          <textarea
            v-model="form.content"
            rows="5"
            placeholder="Write your announcement content..."
            class="w-full px-4 py-2.5 bg-white/70 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all text-sm font-medium resize-y"
            required
          ></textarea>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="form.published"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
            />
            <span class="text-sm font-medium text-gray-700">Published</span>
          </label>
          <div class="flex items-center gap-3">
            <button
              type="submit"
              class="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm"
            >
              {{ editingId ? 'Save Changes' : 'Create Announcement' }}
            </button>
            <button
              type="button"
              class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all text-sm"
              @click="formOpen = false"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Announcements List -->
      <div v-if="announcements.length === 0" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <p class="font-medium text-lg text-gray-500">No announcements yet</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="a in announcements"
          :key="a.id"
          class="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md border border-white/50 hover:shadow-xl transition-all group"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-bold text-gray-900">{{ a.title }}</h3>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
                  :class="a.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                >
                  {{ a.published ? 'Published' : 'Draft' }}
                </span>
              </div>
              <p class="text-sm text-gray-600 line-clamp-2 whitespace-pre-line">{{ a.content }}</p>
              <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
                <span>{{ formatDate(a.created_at) }}</span>
                <span v-if="a.teachers?.name">by {{ a.teachers.name }}</span>
              </div>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                @click="togglePublished(a)"
                class="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                :title="a.published ? 'Unpublish' : 'Publish'"
              >
                <svg v-if="a.published" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </button>
              <button
                @click="openEdit(a)"
                class="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors"
                title="Edit"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="confirmDelete(a)"
                class="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                title="Delete"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
