export default defineNuxtRouteMiddleware(async (to) => {
  const { user, getUser } = useAuth()
  
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)

  if (!user.value) {
    await getUser()
  }

  if (to.path === '/login' && user.value) {
    return navigateTo('/')
  }

  if (authRequired && !user.value) {
    return navigateTo('/login')
  }

  // Restrict admin routes to only admin users
  if (to.path.startsWith('/admin')) {
    if (!user.value || user.value.role !== 'admin') {
      return navigateTo('/')
    }
  }
})