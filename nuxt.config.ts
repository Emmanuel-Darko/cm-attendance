// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  ssr: true,

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@vite-pwa/nuxt'
  ],

  nitro: {
    preset: 'netlify'
  },

  supabase: {
    redirect: false
  },

  runtimeConfig: {
    supabase: {
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
    },
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_KEY
    }
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  },
  css: ['~/assets/css/global.css'],
  pwa: {
    strategies: 'generateSW',
    injectRegister: 'auto',
    registerType: 'autoUpdate',

    manifest: {
      name: 'Kids Check-in',
      short_name: 'Checkin',
      description: 'Church attendance tracking system',
      theme_color: '#2563eb',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    }
  },
  devServer: {
    port: 4000,
    host: '0.0.0.0'
  }
})
