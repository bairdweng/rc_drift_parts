// https://nuxtjs.org/docs/configuration-glossary/configuration-modules
export default {
  // Target for static generation: https://nuxtjs.org/docs/configuration-glossary/configuration-target
  target: 'static',
  
  // Static site generation configuration: https://nuxtjs.org/docs/configuration-glossary/configuration-generate
  generate: {
    dir: 'dist'
  },

  // Global page headers: https://nuxtjs.org/docs/configuration-glossary/configuration-head
  head: {
    title: 'RC Drift Parts',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'RC Drift Parts Store' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      // Google Analytics (gtag.js)
      {
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=G-KGTL7ESMEK'
      },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KGTL7ESMEK');
        `
      }
    ]
  },

  // Global CSS: https://nuxtjs.org/docs/configuration-glossary/configuration-css
  css: [
  ],

  // Plugins to run before rendering page: https://nuxtjs.org/docs/configuration-glossary/configuration-plugins
  plugins: [
  ],

  // Auto import components: https://nuxtjs.org/docs/configuration-glossary/configuration-components
  components: true,

  // Modules for dev and build (recommended): https://nuxtjs.org/docs/configuration-glossary/configuration-modules
  modules: [
  ],

  // Build Configuration: https://nuxtjs.org/docs/configuration-glossary/configuration-build
  build: {
  }
}
