// https://nuxtjs.org/docs/configuration-glossary/configuration-modules
export default {
  // Target for static generation: https://nuxtjs.org/docs/configuration-glossary/configuration-target
  target: 'static',
  
  // GitHub Pages部署配置 - 移除base路径以支持自定义域名
  // router: {
  //   base: process.env.NODE_ENV === 'production' ? '/rc_drift_parts/' : '/'
  // },
  
  // Static site generation configuration: https://nuxtjs.org/docs/configuration-glossary/configuration-generate
  generate: {
    dir: 'dist',
    routes: ['/parts/tamiya-tt-02', '/models']
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
    script: []
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
    // 优化构建性能
    optimizeCSS: true,
    // 启用代码分割
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true
    },
    // 压缩JavaScript
    terser: {
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production'
        }
      }
    }
  },
  
  // 开发服务器配置
  dev: process.env.NODE_ENV === 'development',
  
  // 渲染配置
  render: {
    // 压缩HTML
    compressor: {
      threshold: 1024
    },
    // 静态资源缓存
    static: {
      maxAge: '1y'
    }
  }
}
