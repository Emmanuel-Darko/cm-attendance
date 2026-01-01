<template>
  <!-- Modal Overlay -->
  <transition name="fade">
    <BaseModal @close="closeModal" :clickOutside="true">
      <template #header>
        <h2 class="text-xl font-semibold mb-6 text-gray-700">Add New Local</h2>
      </template>
      <!-- Modal Content -->
      <div class="rounded-lg w-full max-w-lg relative z-50">
          <form @submit.prevent="addLocal" class="grid grid-cols-1 gap-4">
            <div class="flex flex-col gap-1">
              <input
                v-model="name"
                type="text"
                placeholder="Local name"
                class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
            <div class="flex flex-col gap-1">
              <input
                v-model="location"
                type="text"
                placeholder="Location"
                class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <button
                type="button"
                class="btn-secondary"
                @click="$emit('close')"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                :class="[
                  'rounded px-4 py-2 font-semibold transition',
                  !name
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                ]"
                :disabled="!name || processing"
              >
                <loaderIcon v-if="processing" />
                <span v-else>Add Local</span>
              </button>
            </div>
          </form>
      </div>
    </BaseModal>
  </transition>
</template>

<script lang="ts" setup>
  import SuccessModal from "../../components/modals/SuccessModal.vue";
  const client = useSupabaseClient();
  const name = ref("");
  const location = ref("");
  const processing = ref(false)
  const { showModal, hideModal } = useCommon();
  const message = ref('')

  const addLocal = async () => {
    processing.value = true
    try {
      const { error } = await client
        .from("locals")
        .insert([{ name: name.value, location: location.value }]);
      if (error) throw(error);
      else {
        message.value = 'Local added successfully'
        showModal(SuccessModal, {message})
      }
    } catch (error: any) {
      message.value = error?.message
    } finally {
      processing.value = false
    }

  };

  const closeModal = () => {
    hideModal();
  };
</script>

<style scoped>
  .input {
    @apply w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500;
  }
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700;
  }
  .btn-secondary {
    @apply bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300;
  }
</style>
