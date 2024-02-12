// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],

  routeRules: {
    '/login' : { proxy: process.env.URL + '/login' },
    '/logout' : { proxy: process.env.URL + '/logout' },
    //'/checklist' : { proxy: process.env.URL + '/api/checklist' },
    '/addTask' : { proxy: process.env.URL + '/api/checklist/addTask' },
    '/editTask/*' : { proxy: process.env.URL + '/api/checklist/edit/{taskId}' },
   // '/deleteTask/*' : { proxy: process.env.URL + '/api/checklist/delete/{taskId}' },
   // '/version' : { proxy: process.env.URL + '/api/versions' },
  },

  build: {
    transpile: ['vue-toastification']    
  },

})



