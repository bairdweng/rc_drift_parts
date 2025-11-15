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
- Actions: https://github.com/bairdweng/rc_drift_parts/actions

Remember to keep this documentation updated as the project evolves!