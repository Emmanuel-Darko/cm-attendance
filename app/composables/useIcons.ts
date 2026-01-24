// composables/useIcons.ts
export const useIcons = () => {
  const icons: Record<string, string> = {
    qr: `
      <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6 sm:w-7 sm:h-7">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2" fill="none"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2" fill="none"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2" fill="none"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2" fill="none"/>
        <circle cx="6.5" cy="6.5" r="1" fill="currentColor"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
        <circle cx="6.5" cy="17.5" r="1" fill="currentColor"/>
        <circle cx="17.5" cy="17.5" r="1" fill="currentColor"/>
      </svg>
    `,
    calendar: `
      <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6 sm:w-7 sm:h-7">
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
        <path d="M16 3v4M8 3v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="8" cy="14" r="1" fill="currentColor"/>
        <circle cx="12" cy="14" r="1" fill="currentColor"/>
        <circle cx="16" cy="14" r="1" fill="currentColor"/>
      </svg>
    `,
    users: `
      <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6 sm:w-7 sm:h-7">
        <circle cx="9" cy="7" r="3" stroke="currentColor" stroke-width="2"/>
        <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="16" cy="8" r="2" stroke="currentColor" stroke-width="2"/>
        <path d="M19 21v-1.5a3 3 0 00-2.5-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,
    chart: `
      <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6 sm:w-7 sm:h-7">
        <path d="M3 3v18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <rect x="7" y="11" width="3" height="7" rx="1" fill="currentColor"/>
        <rect x="12" y="7" width="3" height="11" rx="1" fill="currentColor"/>
        <rect x="17" y="4" width="3" height="14" rx="1" fill="currentColor"/>
      </svg>
    `,
    megaphone: `
      <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6 sm:w-7 sm:h-7">
        <path d="M20 7l-12 5v4l12 5V7z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M8 16l-3 1.5v-5L8 14" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="17" cy="12" r="1.5" fill="currentColor"/>
      </svg>
    `,
    settings: `
      <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6 sm:w-7 sm:h-7">
        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1.51-1 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="1.2"/>
      </svg>
    `,
    arrowRight: `
      <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor"/>
      </svg>
    `,
    checkCircle: `
      <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor"/>
      </svg>
    `,
    close: `
      <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" stroke="currentColor"/>
      </svg>
    `,
  }

  const getIcon = (name: string, fallback: string = 'qr'): string => {
    if (name && Object.prototype.hasOwnProperty.call(icons, name)) {
      return icons[name]
    }
    return icons[fallback]
  }

  return {
    icons,
    getIcon
  }
}