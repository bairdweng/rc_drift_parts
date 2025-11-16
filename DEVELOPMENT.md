# RC Drift Parts - Development Guide

## Project Overview

RC Drift Parts is a modern e-commerce website built with Nuxt.js for selling RC drift car parts and accessories.

**Live Website**: https://rcdriftparts.com
**Repository**: https://github.com/bairdweng/rc_drift_parts
**Git Clone URL**: git@github.com:bairdweng/rc_drift_parts.git
**GitHub Pages**: https://bairdweng.github.io/rc_drift_parts/

## Tech Stack

- **Framework**: Nuxt.js 2.17.0
- **Frontend**: Vue.js 2.7.14
- **Routing**: Vue Router 3.6.5
- **Language**: TypeScript
- **Package Manager**: npm

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16.x or higher recommended)
- npm (v8.x or higher)
- Git

## Getting Started

### 1. Clone the Repository

**Using SSH (Recommended):**
```bash
git clone git@github.com:bairdweng/rc_drift_parts.git
cd rc_drift_parts
```

**Using HTTPS:**
```bash
git clone https://github.com/bairdweng/rc_drift_parts.git
cd rc_drift_parts
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or a random port if 3000 is occupied).

### 4. Build for Production

```bash
npm run build
```

### 5. Generate Static Site (for GitHub Pages)

```bash
npm run generate
```

This creates a `dist` folder with static files ready for deployment.

## Project Structure

```
rc_drift_parts/
├── app/
│   └── app.vue          # Main application component
├── pages/               # Auto-generated pages (optional)
├── components/          # Reusable Vue components
├── assets/              # Static assets (images, styles)
├── static/              # Static files (copied as-is)
├── nuxt.config.ts       # Nuxt configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Development Guidelines

### Adding New Pages

Create `.vue` files in the `pages` directory. Nuxt will automatically create routes based on the file structure.

Example: `pages/products/index.vue` → `/products`

### Creating Components

Place reusable components in the `components` directory. They are automatically imported and available globally.

### Styling

- Use CSS/SCSS in component `<style>` blocks
- Global styles can be added to `nuxt.config.ts` in the `css` array
- Consider using CSS frameworks like Tailwind CSS or Bootstrap

### State Management

For simple state management, use Vue's reactive system. For complex applications, consider integrating Vuex.

## GitHub Pages Deployment

### Prerequisites

- GitHub repository set up
- GitHub Actions enabled

### Deployment Steps

1. **Configure GitHub Pages Source**
   - Go to repository Settings → Pages
   - Set source to "GitHub Actions"

2. **Create GitHub Actions Workflow**
   Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Generate static site
        run: npm run generate
        
      - name: Setup Pages
        uses: actions/configure-pages@v3
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: ./dist
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
```

3. **Configure Custom Domain (Optional)**
   - Create a `CNAME` file in the `static` directory with content: `rcdriftparts.com`
   - Configure DNS settings with your domain provider

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run generate

# The dist folder is ready for deployment
# Upload contents to your web server or GitHub Pages
```

## Data Structure Documentation

### Overview

RC Drift Parts 采用数据驱动的架构，所有车型和配件信息都存储在JSON文件中，便于维护和扩展。

### Directory Structure

```
data/
├── categories.json          # 配件分类体系
├── models/                  # 车型数据目录
│   └── tamiya-tt-02.json   # Tamiya TT-02车型信息
└── parts/                  # 配件数据目录
    └── tamiya-tt-02-parts.json  # Tamiya TT-02配件信息
```

### 1. 车型数据结构 (models/)

每个车型对应一个JSON文件，文件名格式：`{brand}-{model}.json`

**示例：tamiya-tt-02.json**
```json
{
  "id": "tamiya-tt-02",
  "brand": "Tamiya",
  "name": "TT-02",
  "fullName": "Tamiya TT-02",
  "type": "drift",
  "scale": "1/10",
  "driveType": "4WD",
  "description": "车型描述...",
  "images": {
    "main": "/images/models/tamiya-tt-02.jpg",
    "gallery": ["/images/models/tt-02-1.jpg"]
  },
  "specifications": {
    "wheelbase": "257mm",
    "width": "190mm",
    "weight": "1500g",
    "chassisMaterial": "ABS Plastic",
    "suspension": "4-wheel independent suspension"
  },
  "compatibility": {
    "motorSize": "540",
    "escType": "Brushed/Brushless",
    "battery": "7.2V NiMH/2S LiPo"
  },
  "seo": {
    "title": "页面标题",
    "description": "页面描述",
    "keywords": ["关键词1", "关键词2"]
  },
  "popularity": 85,
  "releaseYear": 2013,
  "status": "active"
}
```

### 2. 配件分类体系 (categories.json)

定义配件的一级分类和子分类：

```json
[
  {
    "id": "chassis",
    "name": "Chassis",
    "subcategories": [
      {"id": "chassis-plates", "name": "Chassis Plates"},
      {"id": "upper-decks", "name": "Upper Decks"},
      {"id": "motor-mounts", "name": "Motor Mounts"}
    ]
  },
  {
    "id": "electronics",
    "name": "Electronics",
    "subcategories": [
      {"id": "esc", "name": "ESC"},
      {"id": "servos", "name": "Servos"},
      {"id": "receivers", "name": "Receivers"}
    ]
  }
]
```

### 3. 配件数据结构 (parts/)

每个车型的配件数据存储在独立的JSON文件中，文件名格式：`{model-id}-parts.json`

**示例：tamiya-tt-02-parts.json**
```json
[
  {
    "id": "tt02-chassis-001",
    "sku": "TT02-CH-001",
    "name": "Aluminum Chassis Plate",
    "brand": "Yeah Racing",
    "category": "chassis",
    "subcategory": "chassis-plates",
    "description": "7075 aluminum chassis plate for Tamiya TT-02",
    "images": {
      "main": "/images/parts/tt02-chassis-001.jpg",
      "gallery": ["/images/parts/tt02-chassis-001-1.jpg"]
    },
    "compatibility": {
      "models": ["tamiya-tt-02"],
      "notes": "Direct replacement for stock plastic chassis"
    },
    "specifications": {
      "material": "7075 Aluminum",
      "weight": "85g",
      "thickness": "3mm",
      "color": "Silver"
    },
    "pricing": {
      "retail": 45.99,
      "sale": 39.99,
      "currency": "USD",
      "availability": "in_stock"
    },
    "installation": {
      "difficulty": "intermediate",
      "timeEstimate": "30-45 minutes",
      "toolsRequired": ["2.0mm hex driver", "Phillips screwdriver"]
    },
    "vendors": [
      {
        "name": "Amazon",
        "url": "https://amazon.com/dp/product123",
        "price": 39.99
      }
    ],
    "reviews": {
      "rating": 4.5,
      "count": 23
    }
  }
]
```

### 4. 数据关系模型

```
车型 (Model) ←→ 配件 (Part)
    ↑
    └── 分类 (Category)
```

- **一对多关系**: 一个车型对应多个配件
- **多对多关系**: 一个配件可能兼容多个车型
- **分类体系**: 配件按功能分类，便于用户浏览

### 5. 扩展新车型的步骤

1. **创建车型数据文件**
   ```bash
   # 在 data/models/ 目录下创建新文件
   touch data/models/yokomo-yd-2.json
   ```

2. **创建配件数据文件**
   ```bash
   # 在 data/parts/ 目录下创建新文件
   touch data/parts/yokomo-yd-2-parts.json
   ```

3. **更新静态生成配置** (可选)
   ```javascript
   // 在 nuxt.config.ts 中添加新路由
   generate: {
     routes: ['/parts/tamiya-tt-02', '/parts/yokomo-yd-2', '/models']
   }
   ```

### 6. 数据验证规则

- **车型ID**: 必须唯一，格式为 `brand-model`
- **配件SKU**: 必须唯一，建议包含车型标识
- **价格**: 必须为数字，支持小数
- **兼容性**: 必须包含至少一个车型ID
- **分类**: 必须存在于 categories.json 中

### 7. 数据加载方式

#### 开发模式 vs 生产模式

**开发模式** (npm run dev):
- 使用ES6模块导入直接加载数据文件
- 数据文件位于 `data/` 目录下
- 修改数据文件后，开发服务器会自动热重载
- 示例代码：
```javascript
import partsData from '~/data/parts/tamiya-tt-02-parts.json'

export default {
  data() {
    return {
      parts: partsData
    }
  }
}
```

**生产模式** (npm run generate):
- Nuxt.js会自动将数据文件静态化
- 生成的文件位于 `dist/` 目录
- 数据文件会被优化并包含在最终的构建产物中

#### 单一数据源原则

项目采用单一数据源架构：
- **唯一数据源**: `/data/` 目录下的JSON文件
- **无需手动复制**: 避免在 `public/` 或 `static/` 目录创建重复数据
- **实时同步**: 修改数据文件后，页面会自动更新

#### 数据文件访问路径

```
数据源 (唯一) → 开发/生产构建 → 最终网站
    ↓
data/parts/tamiya-tt-02-parts.json → 构建处理 → 可访问的零件数据
```

### 8. 最佳实践

1. **单一数据源**: 所有数据修改只在 `data/` 目录进行，避免多份数据副本
2. **保持数据一致性**: 所有JSON文件使用相同的字段命名规范
3. **SEO优化**: 为每个车型设置完整的SEO元数据
4. **图片管理**: 使用相对路径，图片文件存储在 public/images/ 目录
5. **版本控制**: 数据文件随代码一起版本控制
6. **备份策略**: 定期备份重要数据文件

## Environment Configuration

### Development Environment

Create a `.env` file for local development:

```env
NODE_ENV=development
API_URL=http://localhost:3000/api
```

### Production Environment

Configure environment variables in your deployment platform:

- **GitHub Pages**: Use repository secrets
- **Other platforms**: Follow their environment variable configuration

## Testing

### Running Tests

```bash
# Unit tests
npm run test:unit

# End-to-end tests
npm run test:e2e

# All tests
npm run test
```

### Adding Tests

- Unit tests: Place in `tests/unit` directory
- E2E tests: Place in `tests/e2e` directory
- Use Jest for unit testing
- Use Cypress for E2E testing

## Performance Optimization

### Code Splitting

Nuxt automatically code-splits your application. Use dynamic imports for large components:

```javascript
const HeavyComponent = () => import('@/components/HeavyComponent.vue')
```

### Image Optimization

- Use Nuxt Image module for automatic optimization
- Compress images before uploading
- Use appropriate image formats (WebP, AVIF)

### Bundle Analysis

Analyze bundle size:

```bash
npm run build -- --analyze
```

## SEO Optimization

### Meta Tags

Configure meta tags in `nuxt.config.ts`:

```javascript
export default {
  head: {
    title: 'RC Drift Parts - Premium RC Car Components',
    meta: [
      { hid: 'description', name: 'description', content: 'Your meta description' }
    ]
  }
}
```

### Sitemap

Generate sitemap automatically or manually create one in `static/sitemap.xml`.

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   npm run dev -- --port 3001
   ```

2. **Dependency issues**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build errors**
   - Check TypeScript errors
   - Verify all imports are correct
   - Ensure all dependencies are properly installed

### Getting Help

- Check Nuxt.js documentation: https://nuxtjs.org
- Search existing issues in the repository
- Create a new issue with detailed description

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards

- Follow Vue.js style guide
- Use TypeScript for type safety
- Write meaningful commit messages
- Add tests for new features
- Update documentation when necessary

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Git Workflow

### Basic Git Commands

**Initialize and setup:**
```bash
# Clone the repository
git clone git@github.com:bairdweng/rc_drift_parts.git

# Check current status
git status

# View remote repositories
git remote -v
```

**Making changes:**
```bash
# Add all changes
git add .

# Add specific files
git add filename.js

# Commit changes
git commit -m "Descriptive commit message"

# Push to remote
git push origin main
```

**Branch management:**
```bash
# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main
git checkout feature/new-feature

# Merge branches
git checkout main
git merge feature/new-feature

# Delete branch
git branch -d feature/new-feature
```

### Deployment Workflow

1. **Make changes locally**
2. **Test changes**
   ```bash
   npm run dev
   npm run generate
   ```
3. **Commit and push**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
4. **GitHub Actions automatically deploys to GitHub Pages**
5. **Check deployment status at:** https://github.com/bairdweng/rc_drift_parts/actions

### Useful Git Tips

- Always pull latest changes before starting work: `git pull origin main`
- Use descriptive commit messages
- Create feature branches for new functionality
- Regularly push your changes to avoid conflicts

## Support

For support and questions:
- Create an issue in the repository: https://github.com/bairdweng/rc_drift_parts/issues
- Contact the development team
- Check the project documentation

---

**Last Updated**: 2024-11-15

**Important Links:**
- Repository: https://github.com/bairdweng/rc_drift_parts
- GitHub Pages: https://bairdweng.github.io/rc_drift_parts/
- Custom Domain: https://rcdriftparts.com ✅ **LIVE**
- Cloudflare DNS Management: https://dash.cloudflare.com/46e30407068c1219db970509e332b407/rcdriftparts.com/dns/records
- Issues: https://github.com/bairdweng/rc_drift_parts/issues

## Domain Configuration Status

### ✅ **Custom Domain Successfully Configured** (2024-11-15)
- **Primary Domain**: https://rcdriftparts.com
- **WWW Subdomain**: https://www.rcdriftparts.com  
- **GitHub Pages**: https://bairdweng.github.io/rc_drift_parts/
- **SSL/TLS**: Full encryption mode enabled
- **Cloudflare Proxy**: Active and working
- **HTTPS Enforcement**: Automatic

### DNS Records Configuration:
```
Type: CNAME | Name: rcdriftparts.com | Target: bairdweng.github.io | Proxy: Enabled
Type: CNAME | Name: www | Target: bairdweng.github.io | Proxy: Enabled
```

### Google Analytics Configuration (2024-11-15)
- **Tracking ID**: G-KGTL7ESMEK
- **Implementation**: Global gtag.js script
- **Status**: ✅ Active and collecting data
- **Analytics Dashboard**: https://analytics.google.com/analytics/web/
- Actions: https://github.com/bairdweng/rc_drift_parts/actions

Remember to keep this documentation updated as the project evolves!