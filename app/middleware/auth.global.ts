export default defineNuxtRouteMiddleware(async (to) => {
  const { user, getUser } = useAuth()
  
  const publicPages = ['/', '/login', '/adult/register', '/cm-launch']
  const isPublicPage = publicPages.includes(to.path) || to.path === '/souls' || to.path.startsWith('/souls/')
  const authRequired = !isPublicPage

  if (!user.value) {
    await getUser()
  }

  if (to.path === '/login' && user.value) {
    const redirectUrl = to.query.redirect ? String(to.query.redirect) : '/dashboard'
    return navigateTo(redirectUrl)
  }

  if (authRequired && !user.value) {
    const redirectParam = to.fullPath !== '/' && to.fullPath !== '/dashboard' 
      ? `?redirect=${encodeURIComponent(to.fullPath)}`
      : '?redirect=/dashboard'
    return navigateTo(`/login${redirectParam}`)
  }

  // Restrict admin routes to only admin users
  if (to.path.startsWith('/admin')) {
    if (!user.value || user.value.role !== 'admin') {
      return navigateTo('/dashboard')
    }
  }
})
