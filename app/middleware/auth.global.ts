export default defineNuxtRouteMiddleware((to) => {
  // Allow access to all routes without authentication for now
  // This prevents the automatic redirect to /login
  return
}) 