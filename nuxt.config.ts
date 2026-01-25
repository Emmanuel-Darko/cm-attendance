// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@nuxt/image'],
  nitro: {
    preset: 'netlify'
  },
  ssr: false,
  supabase: {
    redirect: false
  },
  runtimeConfig: {
    supabase: {
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_KEY,
    },
  },
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, maximum-scale=1'
        }
      ]
    }
  },
  css: ['~/assets/css/global.css'],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  devServer: {
    port: 4000,
    host: '0.0.0.0'
  }
})