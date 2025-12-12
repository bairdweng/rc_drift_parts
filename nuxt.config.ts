// Nuxt 3 配置文件
import { resolve } from 'path'

export default defineNuxtConfig({
  // 全局配置
  ssr: true,
  
  // 开发模式配置 - 启用开发工具
  devtools: { enabled: true },
  
  // Nuxt 4 特定配置
  compatibilityDate: '2024-01-01',
  
  // Nuxt 4 路由配置 - 使用pages目录进行路由
  // pages: true, // Nuxt 4中pages选项已弃用，使用app/pages目录结构
  
  // 应用配置
  app: {
    head: {
      title: 'RC漂移零件导航 - 专业RC漂移零件选购指南',
      htmlAttrs: {
        lang: 'zh'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '专业的RC漂移零件导航网站，提供Tamiya TT-02等车型的零件选购指南、价格比较和技术文章' },
        { name: 'keywords', content: 'RC漂移车, RC零件, Tamiya, TT-02, 漂移车配件, RC模型车' },
        { name: 'author', content: 'RC漂移零件导航' },
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
          innerHTML: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-KGTL7ESMEK');`
        }
      ]
    }
  },

  // 静态生成配置
  nitro: {
    prerender: {
      routes: [
        '/',
        '/models',
        '/parts',
        '/parts/tamiya-tt-02',
        '/rc-drift-cars',
        '/tech-articles',
        '/tech-articles/battery-basics-guide',
        '/tech-articles/battery-systems-guide',
        '/tech-articles/electronics-tuning-guide',
        '/tech-articles/lipo-battery-safety-guide',
        '/tech-articles/suspension-tire-setup',
        '/tech-articles/tamiya-tt-02-suspension-guide',
        '/tech-articles/transmitter-setup-guide',
        '/tech-articles/what-does-gyro-do-in-rc-drift-car',
        '/tech-articles/model/tamiya-tt-02'
      ]
    }
  },

  // CSS配置
  css: [
    resolve(__dirname, 'assets/css/main.css'),
    resolve(__dirname, 'assets/css/svg-icons.css')
  ],

  // 构建配置
  build: {
    transpile: [
      'naive-ui',
      'vueuc',
      '@css-render/vue3-ssr',
      '@juggle/resize-observer'
    ]
  },

  // 插件配置
  plugins: [
    '~/plugins/performance.js',
    '~/plugins/sitemap.js',
    '~/plugins/svg-icons.js'
  ],

  // 自动导入组件
  components: true,
  
  // Naive UI 自动导入配置
  imports: {
    dirs: ['composables/**'],
    presets: [
      {
        from: 'naive-ui',
        imports: [
          // 布局组件
          'NLayout', 'NLayoutHeader', 'NLayoutContent', 'NLayoutFooter',
          // 基础组件
          'NButton', 'NIcon', 'NText', 'NH1', 'NH2', 'NH3', 'NH4', 'NH5', 'NH6',
          // 数据展示
          'NCard', 'NThing', 'NList', 'NListItem', 'NDataTable',
          // 反馈组件
          'NMessageProvider', 'useMessage', 'NDialogProvider', 'useDialog',
          // 表单组件
          'NInput', 'NInputGroup', 'NSelect', 'NInputNumber',
          // 导航组件
          'NTabs', 'NTabPane',
          // 其他组件
          'NGrid', 'NGi', 'NSpace', 'NTag', 'NProgress', 'NSlider',
          'NGradientText'
        ]
      }
    ]
  },

  // 模块配置
  modules: [
    '@nuxt/content'
  ],

  // Content模块配置
  content: {}
})