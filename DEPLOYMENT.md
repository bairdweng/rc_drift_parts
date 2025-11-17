# RC Drift Parts 部署指南

## 部署状态
✅ **当前部署正常** - 自定义域名 `rcdriftparts.com` 已正确配置

## 重要配置说明

### 1. Nuxt.js 配置 (`nuxt.config.ts`)
**关键修复**: 移除了 `router.base` 配置以支持自定义域名
```typescript
// GitHub Pages部署配置 - 移除base路径以支持自定义域名
// router: {
//   base: process.env.NODE_ENV === 'production' ? '/rc_drift_parts/' : '/'
// },
```

**为什么需要这个修复**:
- 自定义域名 `rcdriftparts.com` 与 `/rc_drift_parts/` base路径冲突
- 移除后，静态资源从根路径 `/_nuxt/` 正确加载

### 2. GitHub Actions 配置 (`.github/workflows/static.yml`)
支持两种部署方式：
1. **云端构建** (默认) - 在GitHub服务器上构建
2. **使用本地dist** - 手动触发时可选择跳过构建

## 部署流程

### 标准部署 (推荐)
```bash
# 1. 确保代码是最新的
git pull origin main

# 2. 本地测试构建
npm run generate

# 3. 提交并推送
git add .
git commit -m "feat: 更新功能"
git push origin main

# 4. GitHub Actions会自动构建和部署
```

### 手动触发部署
1. 访问 GitHub Repository → Actions
2. 选择 "Deploy static content to Pages" workflow
3. 点击 "Run workflow"
4. 可选择是否使用本地dist目录

## 常见问题排查

### 静态资源404错误
**症状**: JS/CSS文件返回404
**解决方案**:
1. 检查浏览器缓存 - 使用硬刷新 (`Cmd + Shift + R`)
2. 确认 `nuxt.config.ts` 中没有 `router.base` 配置
3. 检查GitHub Actions构建日志

### 自定义域名问题
**症状**: 域名无法访问或重定向错误
**解决方案**:
1. 确认 `static/CNAME` 文件存在且内容正确
2. 检查GitHub Pages设置中的自定义域名配置
3. DNS解析可能需要时间生效

## 环境配置

### 开发环境
- 访问: `http://localhost:3000`
- 命令: `npm run dev`

### 生产环境  
- 访问: `https://rcdriftparts.com`
- 构建命令: `npm run generate`

## 监控和维护

### 部署状态检查
1. **GitHub Actions**: 查看构建状态和日志
2. **网站可用性**: 定期访问 `https://rcdriftparts.com`
3. **资源加载**: 检查浏览器开发者工具Network标签

### 性能优化
- 已启用代码分割和资源压缩
- 静态资源设置长期缓存
- 生产环境移除console日志

## 紧急恢复步骤

如果部署出现问题，可按以下步骤恢复：

1. **回滚到上一个稳定版本**
```bash
git checkout <stable-commit-hash>
git push -f origin main
```

2. **强制重新构建**
- 手动触发GitHub Actions工作流
- 选择"清空缓存并硬性重新加载"

3. **检查配置**
- 确认 `nuxt.config.ts` 配置正确
- 验证 `static/CNAME` 文件存在

---

**最后更新**: 2024年11月17日  
**维护者**: AI Assistant  
**部署状态**: ✅ 正常