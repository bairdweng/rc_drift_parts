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
  // 注意：head配置已移至各页面组件中，避免全局配置冲突
  // head: {
  //   title: 'RC Drift Parts - 专业RC漂移车零件搜索和购买平台',
  //   htmlAttrs: {
  //     lang: 'zh-CN'
  //   },
  //   meta: [
  //     { charset: 'utf-8' },
  //     { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  //     { hid: 'description', name: 'description', content: 'RC Drift Parts - 专业的RC漂移车零件搜索平台，提供田宫Tamiya TT-02等热门车型的零件搜索、价格比较和购买指南。快速找到您需要的RC漂移车配件。' },
  //     { name: 'keywords', content: 'RC漂移车,RC零件,田宫Tamiya,TT-02,漂移车配件,RC模型车' },
  //     { name: 'author', content: 'RC Drift Parts' },
  //     { name: 'robots', content: 'index, follow' }
  //   ],
  //   link: [
  //     { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  //     { rel: 'canonical', href: 'https://rcdriftparts.com' }
  //   ],
  //   script: []
  // },

  // Global CSS: https://nuxtjs.org/docs/configuration-glossary/configuration-css
  css: [
  ],

  // Plugins to run before rendering page: https://nuxtjs.org/docs/configuration-glossary/configuration-plugins
  plugins: [
    '~/plugins/sitemap.js'
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
