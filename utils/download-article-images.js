import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 自动下载文章中的远程图片并更新Markdown文件路径的工具
 * 支持功能：
 * 1. 检测Markdown文件中的远程图片URL
 * 2. 下载图片到本地static目录
 * 3. 更新Markdown文件中的图片路径
 * 4. 批量处理所有文章文件
 * 5. 错误处理和重试机制
 */

class ArticleImageDownloader {
  constructor(useProxy = false) {
    this.articlesDir = path.join(__dirname, '../content/articles');
    this.imageDir = path.join(__dirname, '../static/image/articles');
    this.maxRetries = 3;
    this.timeout = 10000; // 10秒超时
    this.useProxy = useProxy;
    
    // 代理配置
    this.proxyConfig = {
      http: process.env.http_proxy || process.env.HTTP_PROXY,
      https: process.env.https_proxy || process.env.HTTPS_PROXY,
      all: process.env.all_proxy || process.env.ALL_PROXY
    };
  }

  // 检查是否为远程URL
  isRemoteUrl(url) {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  }

  // 从URL提取文件名
  getFilenameFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = path.basename(pathname);
      
      // 如果没有扩展名，添加.jpg
      if (!path.extname(filename)) {
        return `${filename}.jpg`;
      }
      return filename;
    } catch (error) {
      // 如果URL解析失败，使用原始URL的最后部分
      const parts = url.split('/');
      let filename = parts[parts.length - 1];
      if (!path.extname(filename)) {
        filename += '.jpg';
      }
      return filename;
    }
  }

  // 转换图片为WebP格式
  convertToWebp(inputPath, outputPath, quality = 75) {
    try {
      // 使用Python脚本进行WebP转换
      const pythonScript = path.join(__dirname, '../scripts/convert_to_webp.py');
      const directory = path.dirname(inputPath);
      const command = `python3 "${pythonScript}" --directory "${directory}" --quality ${quality} --no-backup`;
      
      execSync(command, { stdio: 'pipe' });
      
      // 检查WebP文件是否生成（基于原文件名生成WebP文件名）
      const webpPath = inputPath.replace(/\.(jpg|jpeg|png|temp)/i, '.webp');
      if (fs.existsSync(webpPath)) {
        // 删除原文件（如果存在）
        if (fs.existsSync(inputPath)) {
          fs.unlinkSync(inputPath);
        }
        return webpPath;
      }
      return inputPath;
    } catch (error) {
      console.log(`⚠️  WebP转换失败: ${error.message}`);
      return inputPath; // 返回原文件路径
    }
  }

  // 生成本地文件名（基于文章文件名和图片序号）
  generateLocalFilename(articleFile, url, index) {
    const articleName = path.basename(articleFile, '.md').replace(/[^a-z0-9]/g, '-');
    return `${articleName}-image-${index + 1}.webp`;
  }

  // 获取代理配置
  getProxyOptions(url) {
    if (!this.useProxy) return {};
    
    const isHttps = url.startsWith('https');
    let proxyUrl = this.proxyConfig.https || this.proxyConfig.all;
    
    if (!isHttps) {
      proxyUrl = this.proxyConfig.http || this.proxyConfig.all;
    }
    
    if (!proxyUrl) {
      console.log('⚠️  代理已启用但未找到代理配置，将使用直连');
      return {};
    }
    
    console.log(`🔌 使用代理: ${proxyUrl}`);
    return {
      agent: new HttpsProxyAgent(proxyUrl)
    };
  }

  // 下载单个图片
  async downloadImage(url, localPath) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      
      // 确保目标目录存在
      const dir = path.dirname(localPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // 禁用SSL证书验证（仅用于开发环境）
      const options = url.startsWith('https') ? {
        rejectUnauthorized: false
      } : {};
      
      // 添加代理配置
      const proxyOptions = this.getProxyOptions(url);
      Object.assign(options, proxyOptions);
      
      const request = protocol.get(url, options, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${url}`));
          return;
        }

        // 先下载到临时文件（使用正确的图片扩展名），然后转换为WebP
        const tempPath = localPath.replace('.webp', '.jpg');
        const fileStream = fs.createWriteStream(tempPath);
        response.pipe(fileStream);

        fileStream.on('finish', async () => {
          fileStream.close();
          
          try {
            // 转换为WebP格式
            const webpPath = this.convertToWebp(tempPath, localPath, 75);
            
            // 如果转换成功，删除临时文件（如果存在）
            if (webpPath !== tempPath && fs.existsSync(tempPath)) {
              fs.unlinkSync(tempPath);
            }
            
            resolve(webpPath);
          } catch (error) {
            // 如果转换失败，重命名临时文件为WebP（如果临时文件存在）
            if (fs.existsSync(tempPath)) {
              fs.renameSync(tempPath, localPath);
              console.log(`⚠️  WebP转换失败，保留原格式: ${localPath}`);
              resolve(localPath);
            } else {
              // 如果临时文件也不存在，直接返回目标路径
              console.log(`⚠️  WebP转换失败且临时文件不存在: ${localPath}`);
              resolve(localPath);
            }
          }
        });

        fileStream.on('error', (err) => {
          if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath); // 删除损坏的文件
          }
          reject(err);
        });
      });

      request.setTimeout(this.timeout, () => {
        request.destroy();
        reject(new Error(`Timeout: ${url}`));
      });

      request.on('error', (err) => {
        reject(err);
      });
    });
  }

  // 提取Markdown文件中的所有图片URL
  extractImageUrls(content) {
    const imageUrls = [];
    
    // 匹配Markdown图片语法: ![alt text](url)
    const markdownRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = markdownRegex.exec(content)) !== null) {
      const url = match[2].trim();
      if (this.isRemoteUrl(url)) {
        imageUrls.push({
          url: url,
          alt: match[1],
          fullMatch: match[0],
          index: match.index
        });
      }
    }
    
    return imageUrls;
  }

  // 提取frontmatter中的image字段
  extractFrontmatterImageUrls(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    
    if (!match) return [];
    
    const frontmatter = match[1];
    const imageRegex = /^image:\s*["']?([^"'\n]+)["']?$/m;
    const imageMatch = frontmatter.match(imageRegex);
    
    if (!imageMatch) return [];
    
    const url = imageMatch[1].trim();
    if (this.isRemoteUrl(url)) {
      return [url];
    }
    
    return [];
  }

  // 提取所有图片URL（包括frontmatter和markdown）
  extractAllImageUrls(content) {
    const frontmatterImages = this.extractFrontmatterImageUrls(content);
    const markdownImages = this.extractImageUrls(content);
    
    return {
      frontmatterImage: frontmatterImages,
      markdownImages: markdownImages.map(img => img.url)
    };
  }

  // 处理单个文章文件
  async processArticle(articleFile, index) {
    const filePath = path.join(this.articlesDir, articleFile);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 提取frontmatter中的image字段和Markdown中的图片URL
      const { frontmatterImage, markdownImages } = this.extractAllImageUrls(content);
      const allImageUrls = [...frontmatterImage, ...markdownImages];
      
      if (allImageUrls.length === 0) {
        console.log(`[${index + 1}] 跳过: ${articleFile} (无远程图片)`);
        return { 
          processed: false, 
          downloaded: 0, 
          skipped: 0, 
          failed: 0 
        };
      }
      
      console.log(`[${index + 1}] 处理: ${articleFile} (发现 ${allImageUrls.length} 个远程图片 (${frontmatterImage.length} 个frontmatter, ${markdownImages.length} 个markdown))`);
      
      let newContent = content;
      let downloadedCount = 0;
      let skippedCount = 0;
      let failedCount = 0;

      // 处理每个图片
      for (let i = 0; i < allImageUrls.length; i++) {
        const url = allImageUrls[i];
        const localFilename = this.generateLocalFilename(articleFile, url, i);
        const localPath = path.join(this.imageDir, localFilename);
        const localUrl = `/image/articles/${localFilename}`;

        // 检查文件是否已存在（如果文件存在则跳过下载）
        let fileExists = false;
        try {
          fileExists = fs.existsSync(localPath);
        } catch (error) {
          // 如果检查文件存在时出错（如目录不存在），继续下载流程
          console.log(`   [${i + 1}] 文件检查失败，继续下载: ${error.message}`);
          fileExists = false;
        }
        
        if (fileExists) {
          console.log(`   [${i + 1}] 已存在: ${localFilename}`);
          // 根据类型替换URL
          if (i < frontmatterImage.length) {
            // frontmatter中的image字段
            newContent = newContent.replace(`image: "${url}"`, `image: "${localUrl}"`);
          } else {
            // markdown中的图片语法
            const markdownIndex = i - frontmatterImage.length;
            const imageInfo = this.extractImageUrls(content)[markdownIndex];
            newContent = newContent.replace(imageInfo.fullMatch, `![${imageInfo.alt}](${localUrl})`);
          }
          skippedCount++;
          continue;
        }

        // 下载图片
        let downloadSuccess = false;
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
          try {
            console.log(`   [${i + 1}] 下载中 (尝试 ${attempt}): ${path.basename(url)}`);
            const actualFilePath = await this.downloadImage(url, localPath);
            
            // 验证文件大小（使用实际返回的文件路径）
            const stats = fs.statSync(actualFilePath);
            if (stats.size === 0) {
              fs.unlinkSync(actualFilePath);
              throw new Error('下载的文件为空');
            }

            console.log(`   [${i + 1}] ✓ 下载完成: ${path.basename(actualFilePath)} (${stats.size} bytes)`);
            
            // 根据类型替换URL
            if (i < frontmatterImage.length) {
              // frontmatter中的image字段
              newContent = newContent.replace(`image: "${url}"`, `image: "${localUrl}"`);
            } else {
              // markdown中的图片语法
              const markdownIndex = i - frontmatterImage.length;
              const imageInfo = this.extractImageUrls(content)[markdownIndex];
              newContent = newContent.replace(imageInfo.fullMatch, `![${imageInfo.alt}](${localUrl})`);
            }
            
            downloadedCount++;
            downloadSuccess = true;
            break;
          } catch (error) {
            console.log(`   [${i + 1}] 下载失败 (尝试 ${attempt}): ${error.message}`);
            
            if (attempt === this.maxRetries) {
              console.log(`   [${i + 1}] ✗ 下载失败: ${path.basename(url)}`);
              failedCount++;
            } else {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
      }

      // 保存更新后的内容
      if (downloadedCount > 0 || skippedCount > 0) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`[${index + 1}] ✓ 文件已更新: ${articleFile}`);
      }

      return {
        processed: true,
        downloaded: downloadedCount,
        skipped: skippedCount,
        failed: failedCount
      };

    } catch (error) {
      console.log(`[${index + 1}] ✗ 处理失败: ${articleFile} - ${error.message}`);
      return {
        processed: false,
        downloaded: 0,
        skipped: 0,
        failed: 1
      };
    }
  }

  // 主处理函数
  async processAll() {
    try {
      // 获取所有文章文件
      const articleFiles = fs.readdirSync(this.articlesDir)
        .filter(file => file.endsWith('.md'));
      
      // 确保图片目录存在
      if (!fs.existsSync(this.imageDir)) {
        fs.mkdirSync(this.imageDir, { recursive: true });
      }

      console.log('🚀 开始处理文章图片下载...');
      console.log(`📁 文章目录: ${this.articlesDir}`);
      console.log(`📁 图片目录: ${this.imageDir}`);
      console.log(`📊 总文章数: ${articleFiles.length}`);
      console.log('─'.repeat(50));

      const results = [];
      let totalDownloaded = 0;
      let totalSkipped = 0;
      let totalFailed = 0;
      let totalProcessed = 0;

      // 处理每个文章文件
      for (let i = 0; i < articleFiles.length; i++) {
        const result = await this.processArticle(articleFiles[i], i);
        results.push(result);
        
        if (result.processed) {
          totalProcessed++;
          totalDownloaded += result.downloaded || 0;
          totalSkipped += result.skipped || 0;
          totalFailed += result.failed || 0;
        }
      }

      console.log('─'.repeat(50));
      console.log('📊 处理完成:');
      console.log(`✓ 处理文章: ${totalProcessed}/${articleFiles.length}`);
      console.log(`✓ 下载图片: ${totalDownloaded}`);
      console.log(`○ 跳过图片: ${totalSkipped}`);
      console.log(`✗ 失败图片: ${totalFailed}`);

    } catch (error) {
      console.error('❌ 处理失败:', error.message);
    }
  }

  // 检查远程URL状态
  async checkRemoteUrls() {
    const articleFiles = fs.readdirSync(this.articlesDir)
      .filter(file => file.endsWith('.md'));
    
    console.log(`🔍 扫描 ${articleFiles.length} 篇文章中的远程图片...`);
    
    let totalRemoteUrls = 0;
    
    for (const articleFile of articleFiles) {
      const filePath = path.join(this.articlesDir, articleFile);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 提取所有图片URL（包括frontmatter和markdown）
      const { frontmatterImage, markdownImages } = this.extractAllImageUrls(content);
      const allImageUrls = [...frontmatterImage, ...markdownImages];
      
      if (allImageUrls.length > 0) {
        console.log(`\n📄 ${articleFile}:`);
        
        // 显示frontmatter中的图片
        if (frontmatterImage.length > 0) {
          console.log(`   [frontmatter] ${frontmatterImage[0]}`);
        }
        
        // 显示markdown中的图片
        markdownImages.forEach((url, index) => {
          console.log(`   [${index + 1}] ${url}`);
        });
        
        totalRemoteUrls += allImageUrls.length;
      }
    }
    
    console.log(`\n📊 总共发现 ${totalRemoteUrls} 个远程图片URL`);
    return totalRemoteUrls;
  }
}

// 命令行接口
const command = process.argv[2];
const useProxy = process.argv.includes('--proxy') || process.argv.includes('-p');

console.log(`🔧 代理模式: ${useProxy ? '启用' : '禁用'}`);
if (useProxy) {
  console.log('📡 代理配置:');
  console.log(`   HTTP代理: ${process.env.http_proxy || process.env.HTTP_PROXY || '未设置'}`);
  console.log(`   HTTPS代理: ${process.env.https_proxy || process.env.HTTPS_PROXY || '未设置'}`);
  console.log(`   全局代理: ${process.env.all_proxy || process.env.ALL_PROXY || '未设置'}`);
}

const downloader = new ArticleImageDownloader(useProxy);

switch (command) {
  case 'check':
    downloader.checkRemoteUrls();
    break;
  case 'download':
  default:
    downloader.processAll();
    break;
}

export default ArticleImageDownloader;