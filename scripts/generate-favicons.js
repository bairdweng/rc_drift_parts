import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const ICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
  { size: 150, name: 'mstile-150x150.png' },
  { size: 32, name: 'safari-pinned-tab.svg', format: 'svg' }
]

async function generateFavicons(inputImagePath, outputDir = './public/static/favicons') {
  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log(`✅ 创建输出目录: ${outputDir}`)
  }

  // 检查输入图片是否存在
  if (!fs.existsSync(inputImagePath)) {
    console.error(`❌ 输入图片不存在: ${inputImagePath}`)
    return
  }

  try {
    // 读取输入图片
    const image = sharp(inputImagePath)
    
    // 生成各种尺寸的图标
    for (const config of ICON_SIZES) {
      const outputPath = path.join(outputDir, config.name)
      
      try {
        if (config.format === 'svg') {
          // 对于 SVG 格式，直接复制文件
          fs.copyFileSync(inputImagePath, outputPath)
        } else {
          // 图片处理
          await image
            .resize(config.size, config.size, {
              fit: 'cover',
              position: 'center'
            })
            .png()
            .toFile(outputPath)
        }
        console.log(`✅ 生成: ${config.name}`)
      } catch (error) {
        console.error(`❌ 生成 ${config.name} 失败:`, error.message)
      }
    }

    console.log('🎉 所有图标生成完成!')
  } catch (error) {
    console.error('❌ 图标生成过程出错:', error.message)
  }
}

// 如果直接运行此脚本，使用默认参数
if (import.meta.url === `file://${process.argv[1]}`) {
  const inputImage = './scripts/icon.png'
  generateFavicons(inputImage).catch(console.error)
}

export default generateFavicons
