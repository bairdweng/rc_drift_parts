<template>
  <div class="tech-articles-page">
    <!-- Navigation Bar -->
    <nav class="navigation-bar">
      <div class="container">
        <div class="nav-content">
          <!-- Breadcrumb Navigation -->
          <div class="breadcrumb">
            <nuxt-link to="/" class="breadcrumb-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="home-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" stroke-width="2"/>
                <path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2"/>
              </svg>
              Home
            </nuxt-link>
            <span class="breadcrumb-separator">/</span>
            <nuxt-link to="/rc-drift-cars" class="breadcrumb-link">RC Drift Cars</nuxt-link>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Technical Guides</span>
          </div>
          
          <!-- Quick Actions -->
          <div class="nav-buttons">
            <nuxt-link to="/rc-drift-cars" class="nav-btn secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16.5v-9l6 4.5-6 4.5z"/>
              </svg>
              RC Drift Cars
            </nuxt-link>
            <nuxt-link to="/" class="nav-btn primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              Back to Home
            </nuxt-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">RC Drift Car Technical Guides</h1>
        <p class="hero-subtitle">Expert knowledge to master your RC drift machine</p>
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search technical articles..."
            class="search-input"
          />
          <button class="search-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Categories Filter -->
    <section class="categories-section">
      <div class="container">
        <div class="categories">
          <button 
            v-for="category in categories" 
            :key="category"
            :class="['category-btn', { active: selectedCategory === category }]"
            @click="toggleCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </section>

    <!-- Articles Grid -->
    <section class="articles-section">
      <div class="container">
        <div class="articles-grid">
          <article 
            v-for="article in filteredArticles" 
            :key="article.slug"
            class="article-card"
            @click="navigateToArticle(article.slug)"
          >
            <div class="article-image">
              <img :src="article.image || '/images/article-placeholder.jpg'" :alt="article.title" />
              <div v-if="article.featured" class="featured-badge">Featured</div>
            </div>
            <div class="article-content">
              <span class="article-category">{{ article.category }}</span>
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-description">{{ article.description }}</p>
              <div class="article-meta">
                <span class="reading-time">{{ article.readingTime }} min read</span>
                <span class="article-date">{{ formatDate(article.date) }}</span>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-if="filteredArticles.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
          </svg>
          <h3>No articles found</h3>
          <p>Try adjusting your search terms or filter categories</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
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
      selectedCategory: null
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
          article.body.toLowerCase().includes(query)
        )
      }
      
      // Filter by category
      if (this.selectedCategory) {
        filtered = filtered.filter(article => article.category === this.selectedCategory)
      }
      
      return filtered
    }
  },
  
  methods: {
    toggleCategory(category) {
      this.selectedCategory = this.selectedCategory === category ? null : category
    },
    
    navigateToArticle(slug) {
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
.tech-articles-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Navigation Bar */
.navigation-bar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4a5568;
  text-decoration: none;
  transition: color 0.3s ease;
  font-weight: 500;
}

.breadcrumb-link:hover {
  color: #667eea;
}

.home-icon {
  color: #667eea;
}

.breadcrumb-separator {
  color: #a0aec0;
  margin: 0 4px;
}

.breadcrumb-current {
  color: #2d3748;
  font-weight: 600;
}

.nav-buttons {
    display: flex;
    gap: 15px;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 0.9rem;
  }

  .nav-btn.primary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .nav-btn.secondary {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.8);
  }

  .nav-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    color: white;
  }

/* Hero Section */
.hero-section {
  padding: 80px 0 60px;
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  padding: 8px;
  backdrop-filter: blur(10px);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 20px;
  color: white;
  font-size: 1rem;
  outline: none;
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