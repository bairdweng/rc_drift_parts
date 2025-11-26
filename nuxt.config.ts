// https://nuxtjs.org/docs/configuration-glossary/configuration-modules
export default {
  // Target for static generation: https://nuxtjs.org/docs/configuration-glossary/configuration-target
  target: 'static',
  
  // GitHub Pages deployment configuration - Remove base path to support custom domain
  // router: {
  //   base: process.env.NODE_ENV === 'production' ? '/rc_drift_parts/' : '/'
  // },
  
  // Static site generation configuration: https://nuxtjs.org/docs/configuration-glossary/configuration-generate
  generate: {
    dir: 'dist',
    routes: async () => {
      const fs = require('fs')
      const path = require('path')
      
      // 获取所有文章slug
      const articlesDir = path.join(__dirname, 'content', 'articles')
      const articleFiles: string[] = fs.readdirSync(articlesDir).filter((file: string) => file.endsWith('.md'))
      const articleSlugs = articleFiles.map(file => file.replace('.md', ''))
      
      // 获取所有模型ID
      const modelsDir = path.join(__dirname, 'data', 'models')
      const modelFiles: string[] = fs.readdirSync(modelsDir).filter((file: string) => file.endsWith('.json'))
      const modelIds = modelFiles.map(file => file.replace('.json', ''))
      
      // 生成所有静态路由
      const staticRoutes = [
        '/',
        '/models',
        '/parts/tamiya-tt-02',
        '/rc-drift-cars',
        '/tech-articles'
      ]
      
      // 添加所有技术文章详情页路由
      const articleRoutes = articleSlugs.map(slug => `/tech-articles/${slug}`)
      
      // 添加所有模型文章页面路由
      const modelRoutes = modelIds.map(modelId => `/tech-articles/model/${modelId}`)
      
      return [...staticRoutes, ...articleRoutes, ...modelRoutes]
    },
    fallback: true
  },

  // Global page headers: https://nuxtjs.org/docs/configuration-glossary/configuration-head
  head: {
    title: 'RC Drift Parts - Professional RC Drift Car Parts Search Platform',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'RC Drift Parts - Professional RC drift car parts search platform. Find Tamiya TT-02 parts, compare prices, and get buying guides. Quickly find the RC drift car accessories you need.' },
      { name: 'keywords', content: 'RC drift cars, RC parts, Tamiya, TT-02, drift car accessories, RC model cars' },
      { name: 'author', content: 'RC Drift Parts' },
      { name: 'robots', content: 'index, follow' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'canonical', href: 'https://rcdriftparts.com' }
    ],
    script: [
      {
        src: 'https://www.googletagmanager.com/gtag/js?id=G-KGTL7ESMEK',
        async: true
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
    '~/assets/css/main.css',
    '@mdi/font/css/materialdesignicons.min.css'
  ],

  // Plugins to run before rendering page: https://nuxtjs.org/docs/configuration-glossary/configuration-plugins
  plugins: [
    '~/plugins/sitemap.js'
  ],

  // Auto import components: https://nuxtjs.org/docs/configuration-glossary/configuration-components
  components: true,

  // Modules for dev and build (recommended): https://nuxtjs.org/docs/configuration-glossary/configuration-modules
  modules: [
    '@nuxt/content'
  ],
  
  // Vuetify module configuration
  buildModules: [
    '@nuxtjs/vuetify'
  ],
  
  // Vuetify configuration
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107'
        }
      }
    }
  },
  
  // Content module configuration
  content: {
    // Content directory
    dir: 'content',
    // Supported file extensions
    extensions: ['md', 'json', 'yaml', 'yml'],
    // Enable full-text search
    fullTextSearchFields: ['title', 'description', 'slug', 'text'],
    // Markdown configuration
    markdown: {
      remarkPlugins: [],
      rehypePlugins: []
    }
  },

  // Build Configuration: https://nuxtjs.org/docs/configuration-glossary/configuration-build
  build: {
    // Optimize CSS build performance
    optimizeCSS: true,
    // Enable code splitting
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true
    },
    // JavaScript compression
    terser: {
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production'
        }
      }
    }
  },
  
  // Development server configuration
  dev: process.env.NODE_ENV === 'development',
  
  // Render configuration
  render: {
    // HTML compression
    compressor: {
      threshold: 1024
    },
    // Static assets caching
    static: {
      maxAge: '1y'
    }
  }
}
