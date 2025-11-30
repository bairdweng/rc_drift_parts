# 文章图片下载工具使用指南

## 🚀 功能概述

这个工具可以自动下载文章Markdown文件中的远程图片并更新为本地路径，大大提高开发效率。

## 📁 文件结构

```
utils/
├── download-article-images.js    # 主下载脚本
└── article-image-download-guide.md  # 使用说明
```

## 🛠️ 使用方法

### 1. 检查远程URL状态
```bash
cd /Users/bairdweng/Desktop/ai-tools/rc_drift_parts
node utils/download-article-images.js check
```

### 2. 执行自动下载
```bash
cd /Users/bairdweng/Desktop/ai-tools/rc_drift_parts
node utils/download-article-images.js download
```

### 3. 使用代理下载（如果需要）
```bash
node utils/download-article-images.js download --proxy
```

### 4. 在代码中使用
```javascript
import ArticleImageDownloader from './utils/download-article-images.js';
const downloader = new ArticleImageDownloader();

// 检查远程URL
downloader.checkRemoteUrls();

// 执行下载
downloader.processAll();
```

## 🔄 工作流程

1. **扫描文章目录**：自动读取 `content/articles/` 目录下的所有 `.md` 文件
2. **检测远程图片**：识别Markdown中的 `![alt text](http://example.com/image.jpg)` 格式
3. **下载图片**：支持重试机制和超时控制
4. **更新路径**：自动将远程URL替换为本地路径
5. **保存文件**：更新Markdown文件内容

## 📝 支持的图片格式

### Markdown图片语法
```markdown
![图片描述](https://example.com/image.jpg)
![Aluminum Knuckle](https://www.chrishouse.ca/cdn/shop/files/yea-tt02-006bu.webp)
```

### 处理后格式
```markdown
![图片描述](/image/articles/article-name-image-1.webp)
![Aluminum Knuckle](/image/articles/aluminum-drift-steering-kit-guide-image-1.webp)
```

## 🎯 文件名生成规则

本地文件名格式：`{文章文件名}-image-{序号}.{扩展名}`

**示例转换：**
- 文章文件: `aluminum-drift-steering-kit-guide.md`
- 远程URL: `https://example.com/image.jpg`
- 本地文件名: `aluminum-drift-steering-kit-guide-image-1.jpg`

## ⚙️ 配置选项

在 `download-article-images.js` 中可以修改：

- `maxRetries`: 最大重试次数（默认：3）
- `timeout`: 下载超时时间（默认：10000ms）
- `imageDir`: 图片保存目录（默认：`static/image/articles/`）
- `articlesDir`: 文章目录（默认：`content/articles/`）

## 🔍 检测功能

### 检查远程图片状态
```bash
node utils/download-article-images.js check
```

**输出示例：**
```
🔍 扫描 10 篇文章中的远程图片...

📄 aluminum-drift-steering-kit-guide.md:
   [1] https://www.chrishouse.ca/cdn/shop/files/yea-tt02-006bu.webp
   [2] https://rc-volt.ca/cdn/shop/files/799-54752_480x480.jpg

📊 总共发现 2 个远程图片URL
```

## 🚨 注意事项

1. **网络连接**：确保有稳定的网络连接
2. **文件权限**：确保有写入图片目录的权限
3. **URL有效性**：确保远程URL可访问
4. **备份文章**：建议在执行前备份文章文件
5. **Nuxt.js配置**：图片需要放在 `static` 目录下

## 🔧 故障排除

### 常见问题

1. **下载失败**
   - 检查网络连接
   - 验证URL是否可访问
   - 检查防火墙设置

2. **文件权限错误**
   - 确保有写入权限
   - 检查目录是否存在

3. **Markdown格式错误**
   - 验证图片语法是否正确
   - 检查特殊字符转义

### 调试模式

添加环境变量查看详细日志：
```bash
DEBUG=article-image-downloader node utils/download-article-images.js download
```

## 📈 性能优化

- **批量处理**：支持同时处理多篇文章
- **并发控制**：避免同时下载过多文件
- **缓存机制**：已存在的文件不会重复下载
- **错误恢复**：失败的文件可以单独重试

## 🔄 与Nuxt.js集成

下载后的图片会自动保存在：
```
static/image/articles/
```

在Nuxt Content文章中使用：
```markdown
![图片描述](/image/articles/article-name-image-1.webp)
```

## 📊 处理统计

脚本会显示详细的处理统计：
```
📊 处理完成:
✓ 处理文章: 3/10
✓ 下载图片: 5
○ 跳过图片: 2
✗ 失败图片: 1
```

## 📞 技术支持

如有问题，请检查：
1. 控制台错误信息
2. 网络连接状态
3. 文件权限设置
4. URL有效性验证

## 🔗 相关工具

- **零件图片下载**：`utils/download-images.js`
- **图片压缩**：`scripts/compress_images.py`
- **格式转换**：`scripts/convert_to_webp.py`