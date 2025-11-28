<template>
  <v-app>
    <!-- Navigation Bar with Breadcrumbs -->
    <v-app-bar color="primary" dark flat dense app>
      <!-- Breadcrumb Navigation -->
      <div class="breadcrumb-nav">
        <nav class="breadcrumb-container">
          <a href="/" class="breadcrumb-link">
            <v-icon small class="mr-1">mdi-home</v-icon>
            Home
          </a>
          <span class="breadcrumb-divider">/</span>
          <a href="/tech-articles" class="breadcrumb-link">
            <v-icon small class="mr-1">mdi-book-open-variant</v-icon>
            Technical Guides
          </a>
          <span class="breadcrumb-divider">/</span>
          <span class="breadcrumb-current">
            <v-icon small class="mr-1">mdi-file-document</v-icon>
            {{ article.title }}
          </span>
        </nav>
      </div>
      
      <v-spacer></v-spacer>
      
      <!-- Navigation Buttons -->
      <v-btn text @click="$router.push('/tech-articles')" class="mr-2">
        <v-icon left>mdi-arrow-left</v-icon>
        Back to Articles
      </v-btn>
      <v-btn text @click="$router.push('/')">
        <v-icon left>mdi-home</v-icon>
        Back to Home
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="article-main">
      <v-container class="pa-4">
        <!-- Article Header -->
        <v-row class="mb-6">
          <v-col cols="12">
            <!-- Featured Badge -->
            <v-chip v-if="article.featured" color="primary" class="mb-3">
              <v-icon left>mdi-star</v-icon>
              Featured Article
            </v-chip>
            
            <!-- Article Title -->
            <h1 class="display-1 font-weight-bold white--text mb-3">{{ article.title }}</h1>
            <p class="subtitle-1 white--text mb-4">{{ article.description }}</p>
            
            <!-- Article Meta -->
            <v-card class="meta-card pa-3 mb-4" flat color="rgba(255,255,255,0.1)">
              <v-row align="center" no-gutters>
                <v-col cols="auto" class="mr-4">
                  <v-icon small class="mr-1">mdi-clock-outline</v-icon>
                  <span class="caption">{{ article.readingTime }} min read</span>
                </v-col>
                <v-col cols="auto" class="mr-4">
                  <v-icon small class="mr-1">mdi-calendar</v-icon>
                  <span class="caption">{{ formatDate(article.date) }}</span>
                </v-col>
                <v-col cols="auto" class="mr-4">
                  <v-icon small class="mr-1">mdi-account</v-icon>
                  <span class="caption">By {{ article.author }}</span>
                </v-col>
                <v-col cols="auto">
                  <v-chip small color="secondary">
                    {{ article.category }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-card>
            
            <!-- Article Image -->
            <v-img
              :src="article.image || '/images/article-placeholder.jpg'"
              :alt="article.title"
              height="300"
              class="article-image mb-4"
              contain
            ></v-img>
          </v-col>
        </v-row>

        <!-- Article Content -->
        <v-row>
          <v-col cols="12" lg="9">
            <!-- Floating Table of Contents -->
            <v-card class="toc-card mb-4" v-if="mainHeadings.length > 0">
              <v-card-title class="d-flex align-center">
                <v-icon left>mdi-table-of-contents</v-icon>
                Table of Contents
                <v-spacer></v-spacer>
                <v-btn icon @click="isTocOpen = !isTocOpen">
                  <v-icon>{{ isTocOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </v-card-title>
              <v-expand-transition>
                <div v-show="isTocOpen">
                  <v-divider></v-divider>
                  <v-card-text>
                    <nav class="toc-nav">
                      <v-list dense>
                        <v-list-item
                          v-for="(heading, index) in mainHeadings"
                          :key="index"
                          :class="['toc-item', { 'toc-active': heading.id === activeHeading }]"
                          :style="{ 'padding-left': (heading.level === 'h3' ? '24px' : '16px') }"
                          @click="scrollToHeading(heading.id)"
                        >
                          <v-list-item-content>
                            <v-list-item-title class="toc-link">
                              {{ heading.text }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </nav>
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
            
            <!-- Article Content -->
            <v-card class="article-content-card pa-4 mb-6">
              <nuxt-content :document="article" />
            </v-card>
            
            <!-- Article Navigation -->
            <v-row class="article-navigation mb-6">
              <v-col cols="12" sm="4">
                <v-btn 
                  v-if="prevArticle" 
                  @click="navigateToArticle(prevArticle.slug)"
                  block 
                  outlined 
                  color="primary"
                  class="prev-button"
                >
                  <v-icon left>mdi-chevron-left</v-icon>
                  Previous
                </v-btn>
              </v-col>
              <v-col cols="12" sm="4" class="text-center">
                <v-btn 
                  @click="$router.push('/tech-articles')"
                  block 
                  outlined 
                  color="primary"
                  class="back-button"
                >
                  <v-icon left>mdi-view-list</v-icon>
                  All Articles
                </v-btn>
              </v-col>
              <v-col cols="12" sm="4">
                <v-btn 
                  v-if="nextArticle" 
                  @click="navigateToArticle(nextArticle.slug)"
                  block 
                  outlined 
                  color="primary"
                  class="next-button"
                >
                  Next
                  <v-icon right>mdi-chevron-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          
          <!-- Related Articles Sidebar -->
          <v-col cols="12" lg="3">
            <v-card v-if="relatedArticles.length > 0" class="related-articles-card">
              <v-card-title class="d-flex align-center">
                <v-icon left>mdi-bookmark-multiple</v-icon>
                Related Articles
              </v-card-title>
              <v-divider></v-divider>
              <v-list dense>
                <v-list-item
                  v-for="related in relatedArticles"
                  :key="related.slug"
                  @click="navigateToArticle(related.slug)"
                  class="related-card"
                >
                  <v-list-item-avatar size="48">
                    <v-img
                      :src="related.image || '/images/article-placeholder.jpg'"
                      :alt="related.title"
                    ></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="body-2 font-weight-bold">
                      {{ related.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="caption">
                      {{ related.category }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const article = await $content('articles', params.slug).fetch()
    
    // Get all articles for navigation
    const allArticles = await $content('articles')
      .sortBy('date', 'desc')
      .fetch()
    
    // Find current article index
    const currentIndex = allArticles.findIndex(a => a.slug === params.slug)
    
    // Get previous and next articles
    const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null
    const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null
    
    // Get related articles (same category, excluding current)
    const relatedArticles = allArticles
      .filter(a => a.category === article.category && a.slug !== params.slug)
      .slice(0, 3)
    
    // Extract main headings (h2 and h3 levels)
    const mainHeadings = []
    if (article.body && article.body.children) {
      article.body.children.forEach(child => {
        // Handle both h2 and h3 headings for better compatibility
        if (child.type === 'element' && (child.tag === 'h2' || child.tag === 'h3')) {
          // Improved text extraction to handle various content types
          const extractText = (node) => {
            if (node.type === 'text') {
              return node.value
            } else if (node.type === 'element' && node.children) {
              return node.children.map(extractText).join('')
            }
            return ''
          }
          
          const text = child.children
            .map(extractText)
            .join('')
            .trim()
          
          if (text) {
            // Generate ID that matches Nuxt Content's default anchor generation
            // Improved regex to handle special characters, Unicode, and formatting
            const id = text.toLowerCase()
              .replace(/[^\w\s-]/g, '') // Keep word characters, spaces, and hyphens
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '')
              .substring(0, 50) // Limit ID length to prevent issues
            
            // Ensure the heading element has the correct ID
            if (!child.props) child.props = {}
            child.props.id = id
            
            // Only add if we have a valid ID
            if (id && id.length > 0) {
              mainHeadings.push({
                id,
                text,
                level: child.tag
              })
            }
          }
        }
      })
    }
    
    return {
      article,
      prevArticle,
      nextArticle,
      relatedArticles,
      mainHeadings
    }
  },
  
  data() {
    return {
      isTocOpen: false,
      activeHeading: '',
      scrollTimeout: null
    }
  },
  
  mounted() {
    // Add scroll event listener for active heading detection
    window.addEventListener('scroll', this.handleScroll)
    // Initial check
    this.handleScroll()
  },
  
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
    }
  },
  
  methods: {
    navigateToArticle(slug) {
      this.$router.push(`/tech-articles/${slug}`)
    },
    
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    },
    
    toggleToc() {
      this.isTocOpen = !this.isTocOpen
    },
    
    scrollToHeading(headingId) {
      // Wait for next tick to ensure DOM is updated
      this.$nextTick(() => {
        const element = document.getElementById(headingId)
        if (element) {
          // Get the exact position of the element
          const elementRect = element.getBoundingClientRect()
          const offsetTop = window.pageYOffset + elementRect.top - 80
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          })
          
          // Close TOC after clicking on mobile
          if (window.innerWidth < 768) {
            this.isTocOpen = false
          }
        }
      })
    },
    
    handleScroll() {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout)
      }
      
      this.scrollTimeout = setTimeout(() => {
        const headings = this.mainHeadings.map(h => document.getElementById(h.id)).filter(Boolean)
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        
        let activeHeading = ''
        
        for (let i = headings.length - 1; i >= 0; i--) {
          const heading = headings[i]
          if (heading.offsetTop - 150 <= scrollTop) {
            activeHeading = heading.id
            break
          }
        }
        
        this.activeHeading = activeHeading
      }, 100)
    }
  },
  
  head() {
    const seoTitle = this.article.title.includes('RC Drift') ? this.article.title : `${this.article.title} - RC Drift Cars Guide`
    const seoDescription = this.article.description.includes('rc drift') ? this.article.description : `${this.article.description} - Expert RC drift cars technical guide`
    
    return {
      title: seoTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: seoDescription
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.article.keywords || 'rc drift cars, RC drift car parts, drift car setup, technical guide'
        },
        {
          property: 'og:title',
          content: seoTitle
        },
        {
          property: 'og:description',
          content: seoDescription
        },
        {
          property: 'og:image',
          content: this.article.image || '/images/article-placeholder.jpg'
        },
        {
          property: 'og:type',
          content: 'article'
        },
        {
          property: 'article:published_time',
          content: this.article.date
        },
        {
          property: 'article:author',
          content: this.article.author
        },
        {
          property: 'article:section',
          content: this.article.category
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:title',
          content: seoTitle
        },
        {
          name: 'twitter:description',
          content: seoDescription
        }
      ],
      script: [
        {
          type: 'application/ld+json',
          json: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            'headline': seoTitle,
            'description': seoDescription,
            'image': this.article.image || '/images/article-placeholder.jpg',
            'datePublished': this.article.date,
            'dateModified': this.article.date,
            'author': {
              '@type': 'Person',
              'name': this.article.author
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'RC Drift Parts',
              'logo': {
                '@type': 'ImageObject',
                'url': '/logo.png'
              }
            },
            'mainEntityOfPage': {
              '@type': 'WebPage',
              '@id': `${process.env.BASE_URL || 'https://rcdriftparts.com'}/tech-articles/${this.article.slug}`
            },
            'articleSection': this.article.category,
            'keywords': this.article.keywords || 'rc drift cars, RC drift car parts, drift car setup',
            'inLanguage': 'en'
          }
        }
      ]
    }
  }
}
</script>

<style scoped>
.article-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Article Header */
.article-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0 40px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.breadcrumb-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb-link:hover {
  color: white;
}

.breadcrumb-separator {
  margin: 0 10px;
  opacity: 0.6;
}

.breadcrumb-current {
  color: white;
  font-weight: 600;
}

.featured-badge {
  display: inline-block;
  background: #ff6b6b;
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.article-description {
  font-size: 1.2rem;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.article-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  opacity: 0.8;
}

.article-image {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.article-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

/* Article Content */
.article-content-section {
  padding: 60px 0;
}

.article-content {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

/* Related Articles */
.related-articles {
  margin-bottom: 40px;
}

.related-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #2d3748;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.related-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.related-card:hover {
  transform: translateY(-3px);
}

.related-image {
  height: 120px;
  overflow: hidden;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-content {
  padding: 15px;
}

.related-category {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.related-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #2d3748;
  line-height: 1.3;
}

.related-description {
  font-size: 0.8rem;
  color: #718096;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Navigation */
.article-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
  text-decoration: none;
}

.nav-button:hover {
  background: #5a6fd8;
}

.back-button {
  background: #e2e8f0;
  color: #4a5568;
  padding: 12px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s;
}

.back-button:hover {
  background: #cbd5e0;
}

/* Floating Table of Contents */
.floating-toc {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 1000;
  transition: all 0.3s ease;
}

.toc-toggle {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 16px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.toc-toggle:hover {
  background: #5a6fd8;
  transform: translateX(-5px);
}

.toc-icon {
  font-size: 1.2rem;
}

.toc-text {
  font-size: 0.9rem;
}

.toc-content {
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 20px;
  width: 280px;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 10px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toc-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #2d3748;
  border-bottom: 2px solid #667eea;
  padding-bottom: 8px;
}

.toc-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-nav li {
  margin-bottom: 8px;
}

.toc-link {
  display: block;
  color: #4a5568;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  line-height: 1.4;
}

.toc-link:hover {
  background: #f7fafc;
  color: #667eea;
}

.toc-nav li.toc-active .toc-link {
  background: #667eea;
  color: white;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .floating-toc {
    right: 10px;
  }
  
  .toc-content {
    width: 250px;
    max-height: 300px;
  }
  
  .toc-text {
    display: none;
  }
  
  .toc-toggle {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .floating-toc {
    right: 5px;
  }
  
  .toc-content {
    width: 220px;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .article-title {
    font-size: 2rem;
  }
  
  .article-description {
    font-size: 1.1rem;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 10px;
  }
  
  .article-content {
    padding: 25px;
  }
  
  .article-navigation {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav-button,
  .back-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }
  
  .article-header {
    padding: 40px 0 30px;
  }
  
  .article-title {
    font-size: 1.8rem;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* Global content styles for nuxt-content */
.nuxt-content {
  line-height: 1.7;
  color: #2d3748;
}

.nuxt-content h1,
.nuxt-content h2,
.nuxt-content h3,
.nuxt-content h4,
.nuxt-content h5,
.nuxt-content h6 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #2d3748;
}

.nuxt-content h1 {
  font-size: 2rem;
  border-bottom: 3px solid #667eea;
  padding-bottom: 0.5rem;
}

.nuxt-content h2 {
  font-size: 1.6rem;
  border-left: 4px solid #667eea;
  padding-left: 1rem;
}

.nuxt-content h3 {
  font-size: 1.3rem;
}

.nuxt-content p {
  margin-bottom: 1.5rem;
}

.nuxt-content ul,
.nuxt-content ol {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.nuxt-content li {
  margin-bottom: 0.5rem;
}

.nuxt-content table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.nuxt-content th,
.nuxt-content td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.nuxt-content th {
  background: #f7fafc;
  font-weight: 600;
}

.nuxt-content code {
  background: #edf2f7;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.nuxt-content pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.nuxt-content pre code {
  background: none;
  padding: 0;
  color: inherit;
}

.nuxt-content blockquote {
  border-left: 4px solid #667eea;
  padding-left: 1rem;
  margin-left: 0;
  font-style: italic;
  color: #718096;
  margin-bottom: 1.5rem;
}

.nuxt-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.nuxt-content a {
  color: #667eea;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s;
}

.nuxt-content a:hover {
  border-bottom-color: #667eea;
}
</style>