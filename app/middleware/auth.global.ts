export default defineNuxtRouteMiddleware(async (to) => {
  const { user, getUser } = useAuth()
  
  const publicPages = ['/login', '/adult/register', '/cm-launch']
  const isPublicPage = publicPages.includes(to.path)
  const authRequired = !isPublicPage

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
  if (to.path.startsWith('/admin') || (to.path.startsWith('/adult') && !isPublicPage)) {
    if (!user.value || user.value.role !== 'admin') {
      return navigateTo('/')
    }
  }
})
