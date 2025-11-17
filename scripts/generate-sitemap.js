import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// 确保dist目录存在
const distDir = path.join(__dirname, '..', 'dist')
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}

// 写入站点地图文件
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml)
console.log('✅ 站点地图已生成: dist/sitemap.xml')

// 同时生成robots.txt（如果需要）
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# 禁止爬虫访问的目录
Disallow: /_nuxt/
Disallow: /_ipx/

# 允许爬虫访问所有页面
Allow: /parts/
Allow: /models/

# 爬取延迟（可选）
Crawl-delay: 1`

fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt)
console.log('✅ robots.txt 已生成: dist/robots.txt')