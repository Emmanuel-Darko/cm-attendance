export const getInitials = (name: string = ''): string => {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (!parts.length || !parts[0]) return ''
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  const first = parts[0]?.[0] ?? ''
  const last = parts.at(-1)?.[0] ?? ''
  return (first + last).toUpperCase()
}

// Format time for display
export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export const generateAvatar = ({ name, gender }: { name: string, gender: string }) => {
  if (gender == GENDER.male)
    return `https://avatar.iran.liara.run/public/boy?username=${name.replaceAll(/\s+/g, '')}`
  if (gender == GENDER.female)
    return `https://avatar.iran.liara.run/public/girl?username=${name.replaceAll(/\s+/g, '')}`
}

export const getAge = (dob: Date) => {
  const currentYear = new Date().getFullYear()
  const yearOfBirth = new Date(dob).getFullYear()
  return currentYear - yearOfBirth
}

export const leastYear = computed(() => {
  return new Date().getFullYear() - 13 - 1 //-1 safe range (for kids now turned 14)
})

export function isAdminRoute() {
  const route = useRoute();
  const { user } = useAuth();
  return route.path.includes('admin') && user.value?.role === USER_ROLES.admin;
}