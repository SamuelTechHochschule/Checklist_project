// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: [
    '~/plugins/db.js'
  ],
  devtools: { enabled: true }
})
