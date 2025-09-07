<template>
    <div
      :class="['shimmer-bg', 'bg-gray-100', roundedClass]"
      :style="styleObject"
    />
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  type RoundedSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  
  const roundedMap: Record<RoundedSize, string> = {
    none: 'rounded-none',
    xs: 'rounded-xs',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }
  
  const props = withDefaults(defineProps<{
    width: number | string
    height: number | string
    rounded?: RoundedSize
  }>(), {
    rounded: 'none',
  })
  
  const roundedClass = computed(() => roundedMap[props.rounded])
  
  const styleObject = computed(() => ({
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  }))
  </script>
  
  <style>
  @keyframes shimmer {
    to {
      background-position-x: 0%;
    }
  }
  
  .shimmer-bg {
    background: linear-gradient(-45deg, #f5f6f7 40%, #e8e8e8 50%, #f5f6f7 60%);
    background-size: 400%;
    background-position-x: 100%;
    animation: shimmer 1.3s infinite linear;
  }
  </style>