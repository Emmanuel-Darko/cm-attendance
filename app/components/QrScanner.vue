<template>
  <div class="max-w-4xl mx-auto rounded-xl p-6 text-center transition" :class="dragClasses" @drop.prevent="dropHandler"
    @dragover.prevent="dragClasses = 'bg-blue-100 shadow-xl'" @dragleave.prevent="dragClasses = ''">

```
<div class="rounded-2xl shadow-2xl overflow-hidden bg-white">
  <!-- Camera Controls Shimmer -->
  <div v-if="isInitializing" class="flex justify-between items-center p-2 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
    <div class="flex items-center gap-3">
      <ShimmerLoader className="w-9 h-9 rounded-lg" />
      <ShimmerLoader className="w-40 h-10 rounded-lg" />
    </div>
    <ShimmerLoader className="w-10 h-10 rounded-lg" />
  </div>

  <!-- Camera Controls (Actual) -->
  <div v-else-if="cams && cams.length > 1" class="flex justify-between items-center p-2 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
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

  <!-- Camera Feed Shimmer (Initial Loading) -->
  <div v-if="isInitializing" class="relative bg-black flex justify-center items-center">
    <div class="w-full max-w-[400px] aspect-square mx-auto relative">
      <ShimmerLoader className="w-full h-full rounded-md" />
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div class="p-4 bg-white/10 backdrop-blur-sm rounded-full">
          <svg class="w-12 h-12 text-white animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p class="text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
          Initializing camera...
        </p>
      </div>
    </div>
  </div>

  <!-- Camera Feed (Active) -->
  <div v-else-if="hasCamera && !initializationError" class="relative bg-black flex justify-center items-center">
    <div class="w-full max-w-[400px] aspect-square mx-auto relative">
      <video ref="videoElement" class="w-full h-full object-cover rounded-md" :class="{ 'opacity-50': isSwitchingCamera }" autoplay playsinline muted></video>
      
      <!-- Camera Switching Overlay -->
      <div v-if="isSwitchingCamera" class="absolute inset-0 flex items-center justify-center">
        <div class="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-3">
          <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-white text-sm font-medium">Switching camera...</span>
        </div>
      </div>

      <!-- Normal Overlay -->
      <div v-else class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
        Position QR code within the frame
      </div>
    </div>
  </div>

  <!-- No Camera State -->
  <div v-else class="relative bg-gray-100 flex justify-center items-center">
    <div class="w-full max-w-[400px] aspect-square mx-auto relative flex flex-col items-center justify-center p-8">
      <svg class="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <p class="text-gray-500 font-medium">No camera available</p>
      <p class="text-gray-400 text-sm mt-2">Upload an image instead</p>
    </div>
  </div>

  <!-- Upload Section -->
  <div class="p-4 border-t border-gray-200 bg-white">
    <label for="image" class="flex items-center gap-2 cursor-pointer rounded-lg border-2 border-dashed border-indigo-300 px-4 py-2 hover:border-indigo-500 transition"
      :class="{ 'opacity-50 cursor-not-allowed': isProcessingUpload }">
      <UploadIcon class="w-5 h-5 text-indigo-600" />
      <span class="text-xs text-gray-600">
        {{ isProcessingUpload ? 'Processing...' : 'Upload QR image' }}
      </span>
      <svg v-if="isProcessingUpload" class="animate-spin h-4 w-4 text-indigo-600 ml-auto" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </label>
    <input
      id="image"
      type="file"
      accept="image/*"
      class="hidden"
      :disabled="isProcessingUpload"
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

<!-- Success Message -->
<transition
  enter-active-class="transition ease-out duration-300"
  enter-from-class="opacity-0 translate-y-2"
  enter-to-class="opacity-100 translate-y-0"
  leave-active-class="transition ease-in duration-200"
  leave-from-class="opacity-100 translate-y-0"
  leave-to-class="opacity-0 translate-y-2"
>
  <div v-if="text && !errorText" class="mt-6 flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p class="text-sm font-medium text-green-700">QR Code detected successfully!</p>
  </div>
</transition>
```

  </div>
</template>

<script setup lang="ts">
import QrScanner from "qr-scanner";

const emit = defineEmits(["scan"]);

const 
  videoElement = ref<HTMLVideoElement>(), 
  text = ref(""), 
  errorText = ref(""), 
  hasCamera = ref(false), 
  hasFlash = ref(false), 
  dragClasses = ref(""), 
  cams = ref<QrScanner.Camera[]>(), 
  activeCamId = ref<any>(""),
  isInitializing = ref(true),
  isSwitchingCamera = ref(false),
  isProcessingUpload = ref(false),
  initializationError = ref(false);

let qrScanner: QrScanner | null = null;
let lastScanEmitted = "";

watch(activeCamId, async (id, oldId) => {
  if (oldId && id !== oldId && qrScanner) {
    isSwitchingCamera.value = true;
    try {
      await qrScanner.setCamera(id);
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error switching camera:', error);
    } finally {
      isSwitchingCamera.value = false;
    }
  }
});

watch(text, (newValue) => {
  if (newValue && newValue !== lastScanEmitted) {
    if (navigator.vibrate) {
      navigator.vibrate(150);
    }
    emit('scan', newValue);
    lastScanEmitted = newValue;
  }
});

async function initializeCamera() {
  try {
    // First, wait for the DOM to be ready
    await nextTick();
    
    // Check if video element is in the DOM
    if (!videoElement.value) {
      console.error('Video element ref not available');
      throw new Error("Video element not mounted");
    }

    // Check for camera availability
    const cameraAvailable = await QrScanner.hasCamera();
    
    if (!cameraAvailable) {
      hasCamera.value = false;
      decodeError("No camera found");
      return;
    }

    // Set hasCamera to true so UI shows the video element
    hasCamera.value = true;

    // Get available cameras
    cams.value = await QrScanner.listCameras(true);

    // Initialize QR Scanner
    qrScanner = new QrScanner(
      videoElement.value,
      (r) => {
        text.value = r.data;
        errorText.value = ""; // Clear any previous errors on successful scan
      },
      {
        onDecodeError: (error: any) => {
          // Only log significant errors
          if (error?.message && !error.message.includes('No QR code found')) {
            console.warn('QR decode error:', error);
          }
        },
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 5,
      }
    );

    // Start the scanner
    await qrScanner.start();

    // Check for flash support
    hasFlash.value = await qrScanner.hasFlash();

    // Set default camera (prefer back camera)
    if (cams.value && cams.value.length > 0) {
      const backCamera = cams.value.find(cam => 
        cam.label.toLowerCase().includes('back') || 
        cam.label.toLowerCase().includes('rear')
      );
      activeCamId.value = backCamera?.id || cams.value[cams.value.length - 1]?.id;
    }

  } catch (error: any) {
    console.error('Camera initialization error:', error);
    hasCamera.value = false;
    initializationError.value = true;
    
    // Provide user-friendly error messages
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      decodeError("Camera access denied. Please allow camera permissions.");
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      decodeError("No camera found on this device.");
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      decodeError("Camera is being used by another application.");
    } else if (error.name === 'NotSupportedError') {
      decodeError("Camera not supported on this browser.");
    } else {
      decodeError(error.message || "Failed to initialize camera");
    }
  } finally {
    isInitializing.value = false;
  }
}

onMounted(async () => {
  // Ensure we're in a browser environment
  if (typeof window === 'undefined') {
    isInitializing.value = false;
    hasCamera.value = false;
    return;
  }

  // Set hasCamera to true initially so video element renders
  hasCamera.value = true;
  
  // Wait for next tick to ensure DOM is ready
  await nextTick();
  
  // Small delay to ensure video element is fully mounted
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Initialize camera
  await initializeCamera();
});

function decodeError(error: Error | string) {
  const errorMessage = error instanceof Error ? error.message : error;
  errorText.value = errorMessage;
  console.error('QR Scanner Error:', error);
}

function toggleFlash(state: boolean) {
  if (!qrScanner) return;
  try {
    state ? qrScanner.turnFlashOn() : qrScanner.turnFlashOff();
  } catch (error) {
    console.error('Flash toggle error:', error);
  }
}

async function upload(file: File | null) {
  if (!file || isProcessingUpload.value) return;

  isProcessingUpload.value = true;
  text.value = "";
  lastScanEmitted = "";
  errorText.value = "";

  try {
    const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
    if (result.data) {
      text.value = result.data;
      emit("scan", result.data);
      lastScanEmitted = result.data;
    }
  } catch (error: any) {
    decodeError(error instanceof Error ? error : new Error("Failed to scan QR code from image"));
  } finally {
    await new Promise(resolve => setTimeout(resolve, 300));
    isProcessingUpload.value = false;
  }
}

function dropHandler(e: DragEvent) {
  dragClasses.value = "";

  const file = e.dataTransfer?.items[0]?.kind === "file"
    ? e.dataTransfer.items[0].getAsFile()
    : null;

  upload(file);
}

onUnmounted(() => {
  if (qrScanner) {
    try {
      qrScanner.destroy();
    } catch (error) {
      console.error('Error destroying scanner:', error);
    }
    qrScanner = null;
  }
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.qr-scanner-region-highlight {
  border: 3px solid #4f46e5 !important;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
}

.qr-scanner-code-outline {
  stroke: #4f46e5 !important;
  stroke-width: 3 !important;
}
</style>