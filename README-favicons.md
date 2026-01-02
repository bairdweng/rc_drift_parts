# RC Drift Parts 网站图标生成器

这是一个自动化的网站图标生成脚本，可以将一张图片自动裁剪成多种规格的网站图标。

## 🚀 功能特性

- ✅ 自动生成多种规格的网站图标
- ✅ 支持所有主流浏览器和平台
- ✅ 生成网站清单文件 (Web App Manifest)
- ✅ 生成浏览器配置文件 (Browser Config)
- ✅ 提供完整的 HTML 代码示例

## 📋 支持的图标规格

| 规格 | 尺寸 | 用途 |
|------|------|------|
| Favicon | 16x16, 32x32 | 浏览器标签页图标 |
| Apple Touch Icon | 180x180 | iOS 设备主屏幕图标 |
| Android Chrome | 192x192, 512x512 | Android 设备主屏幕图标 |
| Microsoft Tile | 150x150 | Windows 开始菜单图标 |
| Safari Pinned Tab | 32x32 | Safari 浏览器固定标签页图标 |

## 🛠️ 使用方法

### 1. 准备图片

准备一张正方形或接近正方形的图片，建议分辨率至少为 512x512 像素。

### 2. 运行脚本

```bash
# 基本用法
node scripts/generate-favicons.js <输入图片路径>

# 指定输出目录
node scripts/generate-favicons.js <输入图片路径> <输出目录>

# 示例
node scripts/generate-favicons.js ./logo.png
node scripts/generate-favicons.js ./logo.png ./public/static/favicons
```

### 3. 查看输出

脚本会在指定目录生成以下文件：

```
public/static/favicons/
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── mstile-150x150.png
├── safari-pinned-tab.png
├── site.webmanifest
└── browserconfig.xml
```

### 4. 在网站中使用

将以下代码添加到您的 HTML 文件的 `<head>` 部分：

```html
<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/static/favicons/apple-touch-icon.png">

<!-- Safari Pinned Tab -->
<link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#000000">

<!-- Web App Manifest -->
<link rel="manifest" href="/static/favicons/site.webmanifest">

<!-- Microsoft Tile -->
<meta name="msapplication-TileColor" content="#000000">
<meta name="msapplication-config" content="/static/favicons/browserconfig.xml">

<!-- Theme Color -->
<meta name="theme-color" content="#000000">
```

## 🔧 自定义配置

您可以根据需要修改 `scripts/generate-favicons.js` 文件中的配置：

### 修改图标规格

```javascript
const ICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  // 添加更多规格...
];
```

### 修改网站清单配置

```javascript
const MANIFEST_CONFIG = {
  name: '您的网站名称',
  short_name: '简称',
  description: '网站描述',
  theme_color: '#您的主题颜色',
  // 其他配置...
};
```

## 🎯 最佳实践

1. **图片格式**: 建议使用 PNG 格式，支持透明背景
2. **图片尺寸**: 至少 512x512 像素，确保图标清晰
3. **设计原则**: 使用简洁的图形和对比度高的颜色
4. **测试**: 在不同设备和浏览器上测试图标显示效果

## ❓ 常见问题

### Q: 脚本运行失败怎么办？
A: 检查图片路径是否正确，确保图片文件存在且可读。

### Q: 生成的图标模糊怎么办？
A: 使用更高分辨率的原始图片，建议至少 512x512 像素。

### Q: 如何更新现有图标？
A: 直接运行脚本，它会覆盖现有的图标文件。

## 📞 技术支持

如有问题，请检查：
- 图片文件路径是否正确
- Node.js 版本是否支持 sharp 库
- 输出目录是否有写入权限

---

**注意**: 此脚本专为 RC Drift Parts 网站优化，但也可用于其他 Next.js 项目。