// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: [
    '~/plugins/ldap-auth.js',
  ],
  devtools: { enabled: true }
})
