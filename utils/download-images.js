import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 自动下载远程图片并更新JSON文件路径的工具
 * 支持功能：
 * 1. 检测远程URL并自动下载
 * 2. 转换为本地路径
 * 3. 批量处理多个零件
 * 4. 错误处理和重试机制
 */

class ImageDownloader {
  constructor(useProxy = false) {
    this.dataFile = path.join(__dirname, '../data/parts/tamiya-tt-02-parts.json');
    this.imageDir = path.join(__dirname, '../static/image/parts/tamiya-tt-02');
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
    return url.startsWith('http://') || url.startsWith('https://');
  }

  // 从URL提取文件名
  getFilenameFromUrl(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = path.basename(pathname);
    
    // 如果没有扩展名，添加.jpg
    if (!path.extname(filename)) {
      return `${filename}.jpg`;
    }
    return filename;
  }

  // 生成本地文件名（基于零件ID和名称）
  generateLocalFilename(part, url) {
    const urlFilename = this.getFilenameFromUrl(url);
    const name = part.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const extension = path.extname(urlFilename) || '.jpg';
    return `tt02-${part.id}-${name}${extension}`;
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

        const fileStream = fs.createWriteStream(localPath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve(localPath);
        });

        fileStream.on('error', (err) => {
          fs.unlink(localPath, () => {}); // 删除损坏的文件
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

  // 处理单个零件
  async processPart(part, index) {
    if (!part.image || !this.isRemoteUrl(part.image)) {
      console.log(`[${index + 1}] 跳过: ${part.name} (非远程URL)`);
      return { part, downloaded: false };
    }

    const localFilename = this.generateLocalFilename(part, part.image);
    const localPath = path.join(this.imageDir, localFilename);
    const localUrl = `/image/parts/tamiya-tt-02/${localFilename}`;

    // 检查文件是否已存在
    if (fs.existsSync(localPath)) {
      console.log(`[${index + 1}] 已存在: ${part.name} -> ${localFilename}`);
      return { 
        part: { ...part, image: localUrl },
        downloaded: false 
      };
    }

    // 下载图片
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`[${index + 1}] 下载中 (尝试 ${attempt}): ${part.name}`);
        await this.downloadImage(part.image, localPath);
        
        // 验证文件大小
        const stats = fs.statSync(localPath);
        if (stats.size === 0) {
          fs.unlinkSync(localPath);
          throw new Error('下载的文件为空');
        }

        console.log(`[${index + 1}] ✓ 下载完成: ${part.name} -> ${localFilename} (${stats.size} bytes)`);
        return { 
          part: { ...part, image: localUrl },
          downloaded: true 
        };

      } catch (error) {
        console.log(`[${index + 1}] 尝试 ${attempt} 失败: ${error.message}`);
        
        if (attempt === this.maxRetries) {
          console.log(`[${index + 1}] ✗ 下载失败: ${part.name}`);
          return { part, downloaded: false, error: error.message };
        }
        
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  // 主处理函数
  async processAll() {
    try {
      // 读取数据文件
      const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
      
      // 确保图片目录存在
      if (!fs.existsSync(this.imageDir)) {
        fs.mkdirSync(this.imageDir, { recursive: true });
      }

      console.log('🚀 开始处理图片下载...');
      console.log(`📁 目标目录: ${this.imageDir}`);
      console.log(`📊 总零件数: ${data.length}`);
      console.log('─'.repeat(50));

      const results = [];
      let downloadedCount = 0;
      let skippedCount = 0;
      let failedCount = 0;

      // 处理每个零件
      for (let i = 0; i < data.length; i++) {
        const result = await this.processPart(data[i], i);
        results.push(result);
        
        if (result.downloaded) downloadedCount++;
        else if (result.error) failedCount++;
        else skippedCount++;
      }

      // 更新数据文件
      const updatedData = results.map(r => r.part);
      fs.writeFileSync(this.dataFile, JSON.stringify(updatedData, null, 2));

      console.log('─'.repeat(50));
      console.log('📊 处理完成:');
      console.log(`✓ 下载成功: ${downloadedCount}`);
      console.log(`○ 跳过处理: ${skippedCount}`);
      console.log(`✗ 下载失败: ${failedCount}`);
      console.log(`📁 数据文件已更新: ${this.dataFile}`);

    } catch (error) {
      console.error('❌ 处理失败:', error.message);
    }
  }

  // 检查远程URL状态
  async checkRemoteUrls() {
    const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
    const remoteParts = data.filter(part => part.image && this.isRemoteUrl(part.image));
    
    console.log(`🔍 发现 ${remoteParts.length} 个远程URL:`);
    remoteParts.forEach((part, index) => {
      console.log(`[${index + 1}] ${part.name}: ${part.image}`);
    });
    
    return remoteParts;
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

const downloader = new ImageDownloader(useProxy);

switch (command) {
  case 'check':
    downloader.checkRemoteUrls();
    break;
  case 'download':
  default:
    downloader.processAll();
    break;
}

export default ImageDownloader;