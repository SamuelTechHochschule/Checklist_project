// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],

  build: {
    transpile: ['vue-toastification']    
  },

})



