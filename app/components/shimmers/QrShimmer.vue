<template>
  <div class="w-[250px] h-[250px] rounded-md bg-gray-200 animate-pulse mx-auto relative overflow-hidden">
    <!-- Main scanner frame -->
    <div class="absolute inset-4 border-2 border-gray-400 rounded-sm"></div>
    
    <!-- Corner finder patterns (top-left, top-right, bottom-left) -->
    <div class="absolute top-6 left-6 w-8 h-8 border-2 border-gray-500 rounded-sm"></div>
    <div class="absolute top-6 left-6 w-4 h-4 bg-gray-600 rounded-sm m-1"></div>
    <div class="absolute top-6 left-6 w-2 h-2 bg-gray-200 rounded-sm m-2"></div>
    
    <div class="absolute top-6 right-6 w-8 h-8 border-2 border-gray-500 rounded-sm"></div>
    <div class="absolute top-6 right-6 w-4 h-4 bg-gray-600 rounded-sm m-1"></div>
    <div class="absolute top-6 right-6 w-2 h-2 bg-gray-200 rounded-sm m-2"></div>
    
    <div class="absolute bottom-6 left-6 w-8 h-8 border-2 border-gray-500 rounded-sm"></div>
    <div class="absolute bottom-6 left-6 w-4 h-4 bg-gray-600 rounded-sm m-1"></div>
    <div class="absolute bottom-6 left-6 w-2 h-2 bg-gray-200 rounded-sm m-2"></div>
    
    <!-- Timing patterns (horizontal and vertical) -->
    <div class="absolute top-14 left-6 w-20 h-1 bg-gray-400 animate-pulse opacity-70"></div>
    <div class="absolute top-14 right-6 w-20 h-1 bg-gray-400 animate-pulse opacity-70"></div>
    <div class="absolute top-6 left-14 w-1 h-20 bg-gray-400 animate-pulse opacity-70"></div>
    <div class="absolute bottom-6 left-14 w-1 h-20 bg-gray-400 animate-pulse opacity-70"></div>
    
    <!-- Alignment pattern (center) -->
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-gray-500 rounded-sm"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-600 rounded-sm"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-200 rounded-sm"></div>
    
    <!-- Data modules in organized grid pattern -->
    <!-- Top section -->
    <div class="absolute top-16 left-16 w-2 h-2 bg-gray-400 animate-pulse opacity-60"></div>
    <div class="absolute top-16 left-20 w-2 h-2 bg-gray-300 animate-pulse opacity-70"></div>
    <div class="absolute top-16 left-24 w-2 h-2 bg-gray-400 animate-pulse opacity-80"></div>
    <div class="absolute top-16 left-28 w-2 h-2 bg-gray-300 animate-pulse opacity-65"></div>
    <div class="absolute top-16 left-32 w-2 h-2 bg-gray-400 animate-pulse opacity-75"></div>
    
    <div class="absolute top-20 left-16 w-2 h-2 bg-gray-300 animate-pulse opacity-70"></div>
    <div class="absolute top-20 left-20 w-2 h-2 bg-gray-400 animate-pulse opacity-60"></div>
    <div class="absolute top-20 left-24 w-2 h-2 bg-gray-300 animate-pulse opacity-80"></div>
    <div class="absolute top-20 left-28 w-2 h-2 bg-gray-400 animate-pulse opacity-65"></div>
    <div class="absolute top-20 left-32 w-2 h-2 bg-gray-300 animate-pulse opacity-75"></div>
    
    <div class="absolute top-24 left-16 w-2 h-2 bg-gray-400 animate-pulse opacity-80"></div>
    <div class="absolute top-24 left-20 w-2 h-2 bg-gray-300 animate-pulse opacity-60"></div>
    <div class="absolute top-24 left-24 w-2 h-2 bg-gray-400 animate-pulse opacity-70"></div>
    <div class="absolute top-24 left-28 w-2 h-2 bg-gray-300 animate-pulse opacity-75"></div>
    <div class="absolute top-24 left-32 w-2 h-2 bg-gray-400 animate-pulse opacity-65"></div>
    
    <!-- Right section -->
    <div class="absolute top-16 right-16 w-2 h-2 bg-gray-300 animate-pulse opacity-70"></div>
    <div class="absolute top-16 right-20 w-2 h-2 bg-gray-400 animate-pulse opacity-60"></div>
    <div class="absolute top-16 right-24 w-2 h-2 bg-gray-300 animate-pulse opacity-80"></div>
    <div class="absolute top-16 right-28 w-2 h-2 bg-gray-400 animate-pulse opacity-65"></div>
    <div class="absolute top-16 right-32 w-2 h-2 bg-gray-300 animate-pulse opacity-75"></div>
    
    <div class="absolute top-20 right-16 w-2 h-2 bg-gray-400 animate-pulse opacity-60"></div>
    <div class="absolute top-20 right-20 w-2 h-2 bg-gray-300 animate-pulse opacity-70"></div>
    <div class="absolute top-20 right-24 w-2 h-2 bg-gray-400 animate-pulse opacity-80"></div>
    <div class="absolute top-20 right-28 w-2 h-2 bg-gray-300 animate-pulse opacity-65"></div>
    <div class="absolute top-20 right-32 w-2 h-2 bg-gray-400 animate-pulse opacity-75"></div>
    
    <div class="absolute top-24 right-16 w-2 h-2 bg-gray-300 animate-pulse opacity-80"></div>
    <div class="absolute top-24 right-20 w-2 h-2 bg-gray-400 animate-pulse opacity-60"></div>
    <div class="absolute top-24 right-24 w-2 h-2 bg-gray-300 animate-pulse opacity-70"></div>
    <div class="absolute top-24 right-28 w-2 h-2 bg-gray-400 animate-pulse opacity-75"></div>
    <div class="absolute top-24 right-32 w-2 h-2 bg-gray-300 animate-pulse opacity-65"></div>
    
    <!-- Bottom section -->
    <div class="absolute bottom-16 left-16 w-2 h-2 bg-gray-400 animate-pulse opacity-60"></div>
    <div class="absolute bottom-16 left-20 w-2 h-2 bg-gray-300 animate-pulse opacity-70"></div>
    <div class="absolute bottom-16 left-24 w-2 h-2 bg-gray-400 animate-pulse opacity-80"></div>
    <div class="absolute bottom-16 left-28 w-2 h-2 bg-gray-300 animate-pulse opacity-65"></div>
    <div class="absolute bottom-16 left-32 w-2 h-2 bg-gray-400 animate-pulse opacity-75"></div>
    
    <div class="absolute bottom-20 left-16 w-2 h-2 bg-gray-300 animate-pulse opacity-70"></div>
    <div class="absolute bottom-20 left-20 w-2 h-2 bg-gray-400 animate-pulse opacity-60"></div>
    <div class="absolute bottom-20 left-24 w-2 h-2 bg-gray-300 animate-pulse opacity-80"></div>
    <div class="absolute bottom-20 left-28 w-2 h-2 bg-gray-400 animate-pulse opacity-65"></div>
    <div class="absolute bottom-20 left-32 w-2 h-2 bg-gray-300 animate-pulse opacity-75"></div>
    
    <div class="absolute bottom-24 left-16 w-2 h-2 bg-gray-400 animate-pulse opacity-80"></div>
    <div class="absolute bottom-24 left-20 w-2 h-2 bg-gray-300 animate-pulse opacity-60"></div>
    <div class="absolute bottom-24 left-24 w-2 h-2 bg-gray-400 animate-pulse opacity-70"></div>
    <div class="absolute bottom-24 left-28 w-2 h-2 bg-gray-300 animate-pulse opacity-75"></div>
    <div class="absolute bottom-24 left-32 w-2 h-2 bg-gray-400 animate-pulse opacity-65"></div>
    
    <!-- Right bottom section -->
    <div class="absolute bottom-16 right-16 w-2 h-2 bg-gray-300 animate-pulse opacity-70"></div>
    <div class="absolute bottom-16 right-20 w-2 h-2 bg-gray-400 animate-pulse opacity-60"></div>
    <div class="absolute bottom-16 right-24 w-2 h-2 bg-gray-300 animate-pulse opacity-80"></div>
    <div class="absolute bottom-16 right-28 w-2 h-2 bg-gray-400 animate-pulse opacity-65"></div>
    <div class="absolute bottom-16 right-32 w-2 h-2 bg-gray-300 animate-pulse opacity-75"></div>
    
    <div class="absolute bottom-20 right-16 w-2 h-2 bg-gray-400 animate-pulse opacity-60"></div>
    <div class="absolute bottom-20 right-20 w-2 h-2 bg-gray-300 animate-pulse opacity-70"></div>
    <div class="absolute bottom-20 right-24 w-2 h-2 bg-gray-400 animate-pulse opacity-80"></div>
    <div class="absolute bottom-20 right-28 w-2 h-2 bg-gray-300 animate-pulse opacity-65"></div>
    <div class="absolute bottom-20 right-32 w-2 h-2 bg-gray-400 animate-pulse opacity-75"></div>
    
    <div class="absolute bottom-24 right-16 w-2 h-2 bg-gray-300 animate-pulse opacity-80"></div>
    <div class="absolute bottom-24 right-20 w-2 h-2 bg-gray-400 animate-pulse opacity-60"></div>
    <div class="absolute bottom-24 right-24 w-2 h-2 bg-gray-300 animate-pulse opacity-70"></div>
    <div class="absolute bottom-24 right-28 w-2 h-2 bg-gray-400 animate-pulse opacity-75"></div>
    <div class="absolute bottom-24 right-32 w-2 h-2 bg-gray-300 animate-pulse opacity-65"></div>
    
    <!-- Center area data modules -->
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-4 translate-y-2 w-2 h-2 bg-gray-400 animate-pulse opacity-70"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-8 translate-y-2 w-2 h-2 bg-gray-300 animate-pulse opacity-60"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-12 translate-y-2 w-2 h-2 bg-gray-400 animate-pulse opacity-80"></div>
    
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-x-4 translate-y-2 w-2 h-2 bg-gray-300 animate-pulse opacity-65"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-x-8 translate-y-2 w-2 h-2 bg-gray-400 animate-pulse opacity-75"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-x-12 translate-y-2 w-2 h-2 bg-gray-300 animate-pulse opacity-70"></div>
    
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-4 translate-y-6 w-2 h-2 bg-gray-300 animate-pulse opacity-80"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-8 translate-y-6 w-2 h-2 bg-gray-400 animate-pulse opacity-65"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-12 translate-y-6 w-2 h-2 bg-gray-300 animate-pulse opacity-70"></div>
    
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-x-4 translate-y-6 w-2 h-2 bg-gray-400 animate-pulse opacity-75"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-x-8 translate-y-6 w-2 h-2 bg-gray-300 animate-pulse opacity-60"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-x-12 translate-y-6 w-2 h-2 bg-gray-400 animate-pulse opacity-80"></div>
    
    <!-- Scan line overlay -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="w-full h-1 bg-blue-400/30 animate-scanline"></div>
    </div>
    
    <!-- Corner indicators -->
    <div class="absolute top-2 left-2 w-2 h-2 bg-green-400/50 rounded-full animate-pulse"></div>
    <div class="absolute top-2 right-2 w-2 h-2 bg-green-400/50 rounded-full animate-pulse"></div>
    <div class="absolute bottom-2 left-2 w-2 h-2 bg-green-400/50 rounded-full animate-pulse"></div>
    <div class="absolute bottom-2 right-2 w-2 h-2 bg-green-400/50 rounded-full animate-pulse"></div>
  </div>
</template>

<script setup>
// No complex logic needed - just visual elements
</script>

<style scoped>
@keyframes scanline {
  0% { transform: translateY(-100%); opacity: 0.3; }
  50% { opacity: 0.7; }
  100% { transform: translateY(100%); opacity: 0.3; }
}
.animate-scanline {
  animation: scanline 2s linear infinite;
}
</style>
  