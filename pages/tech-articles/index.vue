<template>
  <v-app>
    <!-- Navigation Bar with Breadcrumbs -->
    <v-app-bar color="primary" dark flat dense app>
      <!-- Breadcrumb Navigation -->
      <div class="breadcrumb-nav">
        <nav class="breadcrumb-container">
          <a href="#" @click.prevent="$router.push('/')" class="breadcrumb-link">
            <v-icon small class="mr-1">mdi-home</v-icon>
            Home
          </a>
          <span class="breadcrumb-divider">/</span>
          <a href="#" @click.prevent="$router.push(backToPartsLink)" class="breadcrumb-link">
            <v-icon small class="mr-1">mdi-car</v-icon>
            {{ currentModel ? `${currentModel} Parts` : 'Tamiya TT-02 Parts' }}
          </a>
          <span class="breadcrumb-divider">/</span>
          <span class="breadcrumb-current">
            <v-icon small class="mr-1">mdi-book-open-variant</v-icon>
            {{ breadcrumbText }}
          </span>
        </nav>
      </div>
      
      <v-spacer></v-spacer>
      
      <!-- Navigation Buttons -->
      <v-btn text @click="$router.push(backToPartsLink)" class="mr-2">
        <v-icon left>mdi-arrow-left</v-icon>
        Back to Parts
      </v-btn>
      <v-btn text @click="$router.push('/')">
        <v-icon left>mdi-home</v-icon>
        Back to Home
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="tech-articles-main">
      <v-container class="pa-4">
        <!-- Header Section -->
        <v-row class="mb-4">
          <v-col cols="12" class="text-center">
            <h1 class="display-1 font-weight-bold white--text mb-2">RC Drift Car Technical Guides</h1>
            <p class="subtitle-1 white--text mb-4">Expert knowledge to master your RC drift machine</p>
            
            <!-- Search Field -->
            <v-text-field
              v-model="searchQuery"
              placeholder="Search technical articles..."
              outlined
              dense
              prepend-inner-icon="mdi-magnify"
              class="search-field mx-auto"
              style="max-width: 500px;"
              background-color="white"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Categories Filter -->
        <v-row class="mb-4">
          <v-col cols="12">
            <div class="text-center">
              <v-chip
                v-for="category in categories"
                :key="category"
                :class="['ma-1', { 'primary': selectedCategory === category }]"
                @click="toggleCategory(category)"
                outlined
                large
              >
                {{ category }}
              </v-chip>
            </div>
          </v-col>
        </v-row>

        <!-- Articles Grid -->
        <v-row>
          <v-col 
            v-for="article in filteredArticles" 
            :key="article.slug"
            cols="12" 
            sm="6" 
            md="4"
            class="mb-4"
          >
            <v-card 
              class="article-card"
              @click="navigateToArticle(article.slug)"
              hover
              elevation="2"
            >
              <v-img
                :src="article.image || '/images/article-placeholder.jpg'"
                :alt="article.title"
                height="200"
                class="article-image"
              >
                <v-chip 
                  v-if="article.featured" 
                  color="primary" 
                  small 
                  class="ma-2"
                >
                  Featured
                </v-chip>
              </v-img>
              
              <v-card-text class="pa-3" @click.stop="navigateToArticle(article.slug)">
                <v-chip 
                  small 
                  color="secondary" 
                  class="mb-2"
                >
                  {{ article.category }}
                </v-chip>
                <h3 class="title font-weight-bold mb-2">{{ article.title }}</h3>
                <p class="body-2 text--secondary mb-3">{{ article.description }}</p>
                <div class="d-flex justify-space-between caption text--secondary">
                  <span>{{ article.readingTime }} min read</span>
                  <span>{{ formatDate(article.date) }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-if="filteredArticles.length === 0">
          <v-col cols="12" class="text-center">
            <v-icon size="64" color="white" class="mb-3">mdi-file-document-outline</v-icon>
            <h3 class="white--text mb-2">No articles found</h3>
            <p class="white--text">Try adjusting your search terms or filter categories</p>
          </v-col>
        </v-row>
      </v-container>
     </v-main>
  </v-app>
</template>

<script>
import ModelSelector from '~/components/ModelSelector.vue'

export default {
  components: {
    ModelSelector
  },
  
  async asyncData({ $content }) {
    const articles = await $content('articles')
      .sortBy('date', 'desc')
      .fetch()
    
    // Extract unique categories
    const categories = [...new Set(articles.map(article => article.category))]
    
    return {
      articles,
      categories
    }
  },
  
  data() {
    return {
      searchQuery: '',
      selectedCategory: null,
      currentModel: null
    }
  },
  
  computed: {
    filteredArticles() {
      let filtered = this.articles
      
      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(article => 
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          (typeof article.body === 'string' && article.body.toLowerCase().includes(query))
        )
      }
      
      // Filter by category
      if (this.selectedCategory) {
        filtered = filtered.filter(article => article.category === this.selectedCategory)
      }
      
      // Filter by model if specified
      if (this.currentModel) {
        filtered = filtered.filter(article => {
          const hasModel = article.models && article.models.includes(this.currentModel)
          const isGeneralArticle = !article.models || article.models.length === 0
          return hasModel || isGeneralArticle
        })
      } else {
        // Show only general articles when no model is selected
        filtered = filtered.filter(article => {
          const isGeneralArticle = !article.models || article.models.length === 0
          return isGeneralArticle
        })
      }
      
      return filtered
    },
    
    backToPartsLink() {
      return this.currentModel ? `/parts/${this.currentModel}` : '/parts/tamiya-tt-02'
    },
    
    breadcrumbText() {
      return this.currentModel ? `${this.currentModel} Articles` : 'Technical Guides'
    },
    
    breadcrumbItems() {
      return [
        {
          text: 'Home',
          disabled: false,
          href: '/'
        },
        {
          text: this.currentModel ? `${this.currentModel} Parts` : 'Tamiya TT-02 Parts',
          disabled: false,
          href: this.backToPartsLink
        },
        {
          text: this.breadcrumbText,
          disabled: true
        }
      ]
    }
  },
  
  mounted() {
    // Check for model parameter in URL
    const model = this.$route.query.model
    if (model) {
      this.currentModel = model
    }
  },
  
  methods: {
    toggleCategory(category) {
      this.selectedCategory = this.selectedCategory === category ? null : category
    },
    
    navigateToArticle(slug) {
      console.log('Navigating to article:', slug)
      this.$router.push(`/tech-articles/${slug}`)
    },
    
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    }
  },
  
  head() {
    return {
      title: 'RC Drift Car Technical Guides - Expert Knowledge Base',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Comprehensive RC drift car technical guides covering transmitter setup, battery systems, suspension tuning, and electronics optimization. Expert knowledge for serious drifters.'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'RC drift car technical guides, transmitter setup, battery systems, suspension tuning, electronics optimization, RC drifting tutorials'
        }
      ]
    }
  }
}
</script>

<style scoped>
.tech-articles-main {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.tech-articles-main .v-container {
  max-width: 1200px;
}

.article-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.article-card:hover {
  transform: translateY(-2px);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-button {
  background: #4CAF50;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.search-button:hover {
  background: #45a049;
}

/* Model Selector Section */
.model-selector-section {
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.95);
}

/* Categories Section */
.categories-section {
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.95);
}

.categories {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.category-btn {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.category-btn.active,
.category-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Articles Section */
.articles-section {
  padding: 60px 0;
  background: #f8f9fa;
}

/* Breadcrumb Navigation Styles (统一设计) */
.breadcrumb-nav {
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-size: 0.85rem;
}

.breadcrumb-nav .v-breadcrumbs__item {
  color: rgba(255, 255, 255, 0.7) !important;
}

.breadcrumb-nav .v-breadcrumbs__item:hover {
  color: rgba(255, 255, 255, 0.9) !important;
}

.breadcrumb-nav .v-breadcrumbs__item--disabled {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 600;
}

.breadcrumb-nav .v-breadcrumbs__divider {
  color: rgba(255, 255, 255, 0.5) !important;
}/* 隐藏导航按钮 */
.v-btn {
  display: none !important;
}

/* 隐藏模型选择器 */
.model-selector {
  display: none !important;
}

/* 面包屑导航样式 */
.breadcrumb-container {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: white;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: white;
  text-decoration: underline;
}

.breadcrumb-current {
  display: flex;
  align-items: center;
  color: white;
  font-weight: 500;
}

.breadcrumb-divider {
  margin: 0 8px;
  color: rgba(255, 255, 255, 0.7);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.article-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.article-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.featured-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ff6b6b;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.article-content {
  padding: 25px;
}

.article-category {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.article-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #2d3748;
  line-height: 1.3;
}

.article-description {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #a0aec0;
}

.reading-time {
  font-weight: 600;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.empty-state svg {
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #4a5568;
}

/* Responsive Design */
@media (max-width: 768px) {
  .navigation-bar {
    padding: 12px 0;
  }
  
  .nav-content {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .breadcrumb {
    font-size: 0.9rem;
  }
  
  .nav-buttons {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
  
  .nav-btn {
    justify-content: center;
    font-size: 0.85rem;
    padding: 8px 16px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .categories {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .category-btn {
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  .navigation-bar {
    padding: 10px 0;
  }
  
  .nav-content {
    gap: 8px;
  }
  
  .breadcrumb {
    font-size: 0.85rem;
    gap: 4px;
  }
  
  .breadcrumb-link {
    gap: 4px;
  }
  
  .back-home-btn {
    padding: 5px 10px;
    font-size: 0.8rem;
  }
  
  .hero-section {
    padding: 60px 0 40px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .container {
    padding: 0 15px;
  }
}
</style>