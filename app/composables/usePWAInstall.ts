export const usePWAInstall = () => {
  const deferredPrompt = ref<any>(null)
  const isIos = ref(false)
  const isInstallable = ref(false)

  onMounted(() => {
    isIos.value =
      /iphone|ipad|ipod/i.test(navigator.userAgent)

    globalThis.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault()
      deferredPrompt.value = e
      isInstallable.value = true
    })
  })

  const install = async () => {
    if (!deferredPrompt.value) return
    deferredPrompt.value.prompt()
    await deferredPrompt.value.userChoice
    deferredPrompt.value = null
    isInstallable.value = false
  }

  return {
    isIos,
    isInstallable,
    install
  }
}
