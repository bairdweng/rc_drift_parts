# 自动图片下载工具使用指南

## 🚀 功能概述

这个工具可以自动下载远程图片并更新JSON文件中的路径，大大提高开发效率。

## 📁 文件结构

```
utils/
├── download-images.js    # 主下载脚本
└── image-download-guide.md  # 使用说明
```

## 🛠️ 使用方法

### 1. 检查远程URL状态
```bash
cd /Users/bairdweng/Desktop/ai-tools/rc_drift_parts
node utils/download-images.js check
```

### 2. 执行自动下载
```bash
cd /Users/bairdweng/Desktop/ai-tools/rc_drift_parts
node utils/download-images.js download
```

### 3. 在代码中使用
```javascript
const ImageDownloader = require('./utils/download-images');
const downloader = new ImageDownloader();

// 检查远程URL
downloader.checkRemoteUrls();

// 执行下载
downloader.processAll();
```

## 🔄 工作流程

1. **检测远程URL**：自动识别以 `http://` 或 `https://` 开头的图片URL
2. **生成文件名**：基于零件ID和名称生成有意义的本地文件名
3. **下载图片**：支持重试机制和超时控制
4. **更新路径**：自动将远程URL替换为本地路径
5. **错误处理**：详细的错误报告和跳过机制

## 📝 JSON文件格式要求

### 当前格式（支持远程URL）
```json
{
  "id": "53433",
  "name": "Medium-Narrow Reinforced Tires Type-A",
  "image": "https://example.com/images/tt02-tire-a.jpg"
}
```

### 处理后格式（自动转换为本地路径）
```json
{
  "id": "53433",
  "name": "Medium-Narrow Reinforced Tires Type-A",
  "image": "/image/parts/tamiya-tt-02/tt02-53433-medium-narrow-reinforced-tires-type-a.jpg"
}
```

## 🎯 文件名生成规则

本地文件名格式：`tt02-{零件ID}-{零件名称}.{扩展名}`

**示例：**
- 远程URL: `https://example.com/tire.jpg`
- 本地文件名: `tt02-53433-medium-narrow-reinforced-tires-type-a.jpg`

## ⚙️ 配置选项

在 `download-images.js` 中可以修改：

- `maxRetries`: 最大重试次数（默认：3）
- `timeout`: 下载超时时间（默认：10000ms）
- `imageDir`: 图片保存目录
- `dataFile`: 数据文件路径

## 🚨 注意事项

1. **网络连接**：确保有稳定的网络连接
2. **文件权限**：确保有写入图片目录的权限
3. **URL有效性**：确保远程URL可访问
4. **备份数据**：建议在执行前备份JSON文件
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

3. **JSON格式错误**
   - 验证JSON文件格式
   - 检查特殊字符转义

### 调试模式

添加环境变量查看详细日志：
```bash
DEBUG=image-downloader node utils/download-images.js download
```

## 📈 性能优化

- **批量处理**：支持同时处理多个URL
- **并发控制**：避免同时下载过多文件
- **缓存机制**：已存在的文件不会重复下载
- **错误恢复**：失败的文件可以单独重试

## 🔄 与Nuxt.js集成

下载后的图片会自动保存在：
```
static/image/parts/tamiya-tt-02/
```

在Vue组件中使用：
```vue
<template>
  <img :src="part.image" :alt="part.name" />
</template>
```

## 📞 技术支持

如有问题，请检查：
1. 控制台错误信息
2. 网络连接状态
3. 文件权限设置
4. URL有效性验证