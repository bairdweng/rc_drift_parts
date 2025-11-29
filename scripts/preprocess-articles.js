#!/usr/bin/env node

/**
 * 构建时预处理脚本
 * 用于生产环境下预处理零件-文章关联数据
 * 运行: node scripts/preprocess-articles.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ES模块兼容性处理
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 解析Markdown文件的前言元数据
 */
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) return {}
  
  const frontmatterText = frontmatterMatch[1]
  const frontmatter = {}
  
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      let value = line.substring(colonIndex + 1).trim()
      
      // 处理数组类型的值
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''))
      } else {
        // 处理字符串值，去除引号
        value = value.replace(/^['"](.*)['"]$/, '$1')
      }
      
      frontmatter[key] = value
    }
  })
  
  return frontmatter
}

/**
 * 读取所有文章数据
 */
function readAllArticlesSync() {
  const articlesDir = path.join(process.cwd(), 'content/articles')
  const articleFiles = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'))
  
  return articleFiles.map(file => {
    const content = fs.readFileSync(path.join(articlesDir, file), 'utf8')
    const frontmatter = parseFrontmatter(content)
    
    return {
      slug: file.replace('.md', ''),
      title: frontmatter.title || '',
      description: frontmatter.description || '',
      category: frontmatter.category || '',
      keywords: frontmatter.keywords || '',
      models: Array.isArray(frontmatter.models) ? frontmatter.models : [],
      compatibleModels: Array.isArray(frontmatter.compatibleModels) ? frontmatter.compatibleModels : [],
      partIds: Array.isArray(frontmatter.partIds) ? frontmatter.partIds : []
    }
  })
}

/**
 * 查找与零件相关的文章
 */
function findRelatedArticles(part, articles) {
  const relatedArticles = []
  
  articles.forEach(article => {
    // 基于零件ID进行精确匹配
    if (article.partIds && article.partIds.includes(part.id)) {
      relatedArticles.push({
        slug: article.slug,
        title: article.title,
        description: article.description,
        category: article.category
      })
    }
  })
  
  // 返回所有匹配的文章
  return relatedArticles
}

/**
 * 查找与文章相关的零件
 */
function findRelatedParts(article, parts) {
  const relatedParts = []
  
  if (article.partIds && article.partIds.length > 0) {
    parts.forEach(part => {
      // 基于零件ID进行精确匹配
      if (article.partIds.includes(part.id)) {
        relatedParts.push({
          id: part.id,
          name: part.name,
          category_id: part.category_id,
          subcategory: part.subcategory,
          image: part.image,
          price: part.price
        })
      }
    })
  }
  
  // 返回所有匹配的零件
  return relatedParts
}

/**
 * 主处理函数
 */
function preprocessData() {
  console.log('🚀 开始预处理零件-文章双向关联数据...')
  
  try {
    // 读取零件数据
    const partsDataPath = path.join(process.cwd(), 'data/parts/tamiya-tt-02-parts.json')
    const partsData = JSON.parse(fs.readFileSync(partsDataPath, 'utf8'))
    
    // 读取所有文章
    const articles = readAllArticlesSync()
    
    console.log(`📚 找到 ${articles.length} 篇文章`)
    console.log(`🔧 处理 ${partsData.length} 个零件`)
    
    // 为每个零件关联相关文章
    const enhancedParts = partsData.map(part => {
      const relatedArticles = findRelatedArticles(part, articles)
      
      console.log(`📦 ${part.name}: 关联到 ${relatedArticles.length} 篇文章`)
      
      return {
        ...part,
        relatedArticles
      }
    })
    
    // 为每篇文章关联相关零件
    const enhancedArticles = articles.map(article => {
      const relatedParts = findRelatedParts(article, partsData)
      
      console.log(`📖 ${article.title}: 关联到 ${relatedParts.length} 个零件`)
      
      return {
        ...article,
        relatedParts
      }
    })
    
    // 确保静态目录存在
    const staticDir = path.join(process.cwd(), 'static/data')
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true })
    }
    
    // 保存预处理数据
    const partsOutputPath = path.join(staticDir, 'parts-enhanced.json')
    fs.writeFileSync(partsOutputPath, JSON.stringify(enhancedParts, null, 2))
    
    const articlesOutputPath = path.join(staticDir, 'articles-enhanced.json')
    fs.writeFileSync(articlesOutputPath, JSON.stringify(enhancedArticles, null, 2))
    
    console.log(`✅ 预处理完成！数据已保存到:`)
    console.log(`   - 零件数据: ${partsOutputPath}`)
    console.log(`   - 文章数据: ${articlesOutputPath}`)
    
    console.log(`📊 统计信息:`)
    console.log(`   - 总零件数: ${enhancedParts.length}`)
    console.log(`   - 有相关文章的零件数: ${enhancedParts.filter(p => p.relatedArticles.length > 0).length}`)
    console.log(`   - 总关联文章数: ${enhancedParts.reduce((sum, p) => sum + p.relatedArticles.length, 0)}`)
    console.log(`   - 总文章数: ${enhancedArticles.length}`)
    console.log(`   - 有相关零件的文章数: ${enhancedArticles.filter(a => a.relatedParts.length > 0).length}`)
    console.log(`   - 总关联零件数: ${enhancedArticles.reduce((sum, a) => sum + a.relatedParts.length, 0)}`)
    
    return {
      enhancedParts,
      enhancedArticles
    }
  } catch (error) {
    console.error('❌ 预处理失败:', error)
    process.exit(1)
  }
}

// 运行预处理
if (import.meta.url === `file://${process.argv[1]}`) {
  // 检查是否启用监听模式
  if (process.argv.includes('--watch')) {
    console.log('👀 启用文件监听模式...')
    
    const chokidar = await import('chokidar')
    const articlesDir = path.join(process.cwd(), 'content/articles')
    
    // 监听文章目录的变化
    const watcher = chokidar.watch(articlesDir, {
      ignored: /(^|[\/\\])\../, // 忽略隐藏文件
      persistent: true
    })
    
    watcher
      .on('change', (filePath) => {
        console.log(`🔄 检测到文件变化: ${path.basename(filePath)}`)
        console.log('🔄 重新预处理关联数据...')
        preprocessData()
      })
      .on('add', (filePath) => {
        console.log(`➕ 检测到新文件: ${path.basename(filePath)}`)
        console.log('🔄 重新预处理关联数据...')
        preprocessData()
      })
      .on('unlink', (filePath) => {
        console.log(`➖ 检测到文件删除: ${path.basename(filePath)}`)
        console.log('🔄 重新预处理关联数据...')
        preprocessData()
      })
    
    console.log(`✅ 正在监听 ${articlesDir} 目录...`)
    console.log('💡 按 Ctrl+C 退出监听模式')
  } else {
    // 单次运行模式
    preprocessData()
  }
}

export {
  preprocessData,
  findRelatedArticles,
  readAllArticlesSync
}