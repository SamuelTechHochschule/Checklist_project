// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@element-plus/nuxt',
    '@pinia/nuxt',
  ],

  routeRules: {
    '/login' : { proxy: process.env.URL + '/login' },
    '/logout' : { proxy: process.env.URL + '/logout' },
    '/checklist' : { proxy: process.env.URL + '/api/checklist' },
    '/addTask' : { proxy: process.env.URL + '/api/checklist/addTask' },
    '/editTask' : { proxy: 'http://localhost:5500/api/checklist/edit/{taskId}' },
    '/deleteTask' : { proxy: 'http://localhost:5500/api/checklist/delete/{taskId}' },
  },

})


