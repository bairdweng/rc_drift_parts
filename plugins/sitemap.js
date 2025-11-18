// Nuxt.js 站点地图生成插件
export default function (context) {
  const { app } = context
  
  // 站点地图配置
  const baseUrl = 'https://rcdriftparts.com'
  const routes = [
    {
      url: '/',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString()
    },
    {
      url: '/models',
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString()
    },
    {
      url: '/parts/tamiya-tt-02',
      changefreq: 'weekly',
      priority: 0.9,
      lastmod: new Date().toISOString()
    }
  ]
  
  // 生成站点地图XML
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
    <url>
      <loc>${baseUrl}${route.url}</loc>
      <lastmod>${route.lastmod}</lastmod>
      <changefreq>${route.changefreq}</changefreq>
      <priority>${route.priority}</priority>
    </url>`).join('')}
</urlset>`
  
  // 在服务器端生成站点地图
  if (process.server) {
    const fs = require('fs')
    const path = require('path')
    
    // 确保dist目录存在
    const distDir = path.join(process.cwd(), 'dist')
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true })
    }
    
    // 写入站点地图文件
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml)
  }
  
  // 添加路由钩子，在生成静态页面时创建站点地图
  // 注意：已移除自动下载功能，避免用户访问时自动下载文件
  app.router.afterEach((to, from) => {
    if (process.static && process.client) {
      // 仅在开发环境下输出日志，避免生产环境干扰
      if (process.env.NODE_ENV === 'development') {
        console.log('Sitemap generated for static site')
      }
    }
  })
}