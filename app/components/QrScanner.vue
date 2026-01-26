<template>
  <div class="max-w-4xl mx-auto rounded-xl p-6 text-center transition" :class="dragClasses" @drop.prevent="dropHandler"
    @dragover.prevent="dragClasses = 'bg-blue-100 shadow-xl'" @dragleave.prevent="dragClasses = ''">

    <div class="rounded-2xl shadow-2xl overflow-hidden bg-white">
      <!-- Camera Controls -->
      <div v-if="cams && cams.length > 1" class="flex justify-between items-center p-2 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white rounded-lg shadow-sm">
            <CameraIcon class="w-5 h-5 text-indigo-600" />
          </div>
          <select class="px-4 py-2.5 rounded-lg bg-white border border-indigo-200 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer text-sm font-medium text-gray-700"
            v-model="activeCamId" name="cams" id="cams">
            <option v-for="c in cams" :key="c.id" :value="c.id">{{ c.label }}</option>
          </select>
        </div>
        <FlashButton v-if="hasFlash" @toggle="(state) => toggleFlash(state)" />
      </div>

      <!-- Camera Feed (Square) -->
      <div v-if="hasCamera" class="relative bg-black flex justify-center items-center">
        <div class="w-full max-w-[400px] aspect-square mx-auto relative">
          <video ref="videoElement" class="w-full h-full object-cover rounded-md"></video>
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
            Position QR code within the frame
          </div>
        </div>
      </div>

      <!-- Upload Section (Smaller) -->
      <div class="p-4 border-t border-gray-200 bg-white">
        <label for="image" class="flex items-center gap-2 cursor-pointer rounded-lg border-2 border-dashed border-indigo-300 px-4 py-2 hover:border-indigo-500 transition">
          <UploadIcon class="w-5 h-5 text-indigo-600" />
          <span class="text-xs text-gray-600">Upload QR image</span>
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          class="hidden"
          @change="e => upload((e.target as HTMLInputElement).files?.[0] || null)"
        />
      </div>
    </div>
    
    <!-- Error Message -->
    <div v-if="errorText && !text" class="mt-6 flex items-center justify-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
      <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-sm font-medium text-red-700">{{ errorText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import QrScanner from "qr-scanner";
const emit = defineEmits(["scan"]);

const 
  videoElement = ref<HTMLVideoElement>(), 
  text = ref(""), 
  errorText = ref(""), 
  hasCamera = ref(true), 
  hasFlash = ref(false), 
  dragClasses = ref(""), 
  cams = ref<QrScanner.Camera[]>(), 
  activeCamId = ref<any>("");
let qrScanner: QrScanner;

// Only emit 'scan' when a new, unique, *non-empty* result is detected; 
// Prevent emitting the same result multiple times in a row.
let lastScanEmitted = "";

watch(activeCamId, (id) => qrScanner.setCamera(id));
watch(text, (newValue) => {
  if (newValue && newValue !== lastScanEmitted) {
    navigator.vibrate(150);
    emit('scan', newValue);
    lastScanEmitted = newValue;
  }
});

onMounted(async () => {
  hasCamera.value = await QrScanner.hasCamera();

  if (hasCamera.value) {
    cams.value = await QrScanner.listCameras(true);

    try {
      qrScanner = new QrScanner(
        videoElement.value!,
        (r) => (text.value = r.data),
        {
          onDecodeError: (error) => decodeError(error),
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScanner.start();

      hasFlash.value = await qrScanner.hasFlash();
      if (cams.value && cams.value.length > 0) {
        activeCamId.value = cams.value[cams.value.length - 1]?.id;
      }
    } catch (error: any) {
      decodeError(error instanceof Error ? error : error);
    }
  } else {
    decodeError("No camera found");
  }
});

function decodeError(error: Error | string) {
  errorText.value = error instanceof Error ? error.message : error;
  if(errorText.value !== (error instanceof Error ? error.message : error))
    console.error(error);
}

function toggleFlash(state: boolean) {
  state ? qrScanner.turnFlashOn() : qrScanner.turnFlashOff();
}

async function upload(file: File | null) {
  text.value = "";
  lastScanEmitted = "";

  if (!file) return;

  try {
    const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
    if (result.data) {
      text.value = result.data;
      // Emit only once for image upload, since user action is explicit
      emit("scan", result.data);
      lastScanEmitted = result.data;
    }
  } catch (error: any) {
    decodeError(error instanceof Error ? error : error);
  }
}

function dropHandler(e: DragEvent) {
  dragClasses.value = "";

  const file = e.dataTransfer?.items[0]?.kind === "file"
    ? e.dataTransfer.items[0].getAsFile()
    : null;

  upload(file);
}

onUnmounted(() => qrScanner?.destroy());
</script>

<style scoped>
  .qr-scanner-region-highlight {
    border: 3px solid #4f46e5 !important;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
  }

  .qr-scanner-code-outline {
    stroke: #4f46e5 !important;
    stroke-width: 3 !important;
  }
</style>