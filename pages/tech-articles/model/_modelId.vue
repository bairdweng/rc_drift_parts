<template>
  <div class="model-articles-page">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb">
      <a href="/">Home</a>
      <span class="separator">/</span>
      <a href="/tech-articles">Technical Articles</a>
      <span class="separator">/</span>
      <span class="current">{{ model ? model.fullName : 'Model Articles' }}</span>
    </nav>

    <!-- Model Header -->
    <div v-if="model" class="model-header">
      <div class="model-info">
        <h1>{{ model.fullName }} Technical Articles</h1>
        <p class="model-description">{{ model.description }}</p>
        <div class="model-specs">
          <span class="spec-item">{{ model.driveType }}</span>
          <span class="spec-item">{{ model.scale }}</span>
          <span class="spec-item">Popularity: {{ model.popularity }}%</span>
        </div>
      </div>
      
      <div class="model-image" v-if="model.images &amp;&amp; model.images.main">
        <img :src="model.images.main" :alt="`${model.fullName} RC Drift Car`" />
      </div>
    </div>

    <!-- Model Selector -->
    <div class="model-selector-section">
      <ModelSelector />
    </div>

    <!-- Articles List -->
    <div class="articles-section">
      <div v-if="filteredArticles.length > 0" class="articles-grid">
        <div 
          v-for="article in filteredArticles" 
          :key="article.slug"
          class="article-card"
        >
          <a :href="`/tech-articles/${article.slug}`" class="article-link">
            <div class="article-image" v-if="article.image">
              <img :src="article.image" :alt="article.title" />
            </div>
            <div class="article-content">
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-description">{{ article.description }}</p>
              <div class="article-meta">
                <span class="read-time">{{ article.readingTime ? article.readingTime.text : '5 min read' }}</span>
                <span class="publish-date" v-if="article.publishedAt">
                  {{ formatDate(article.publishedAt) }}
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
      
      <div v-else class="no-articles">
        <div class="no-articles-content">
          <i class="icon-article">📄</i>
          <h3>No articles found for {{ model ? model.fullName : 'this model' }}</h3>
          <p>We're working on creating technical content for this RC drift car model.</p>
          <a href="/tech-articles" class="browse-all-btn">Browse All Articles</a>
        </div>
      </div>
    </div>

    <!-- Related Models -->
    <div v-if="relatedModels.length > 0" class="related-models">
      <h2>Related Models</h2>
      <div class="models-grid">
        <a 
          v-for="relatedModel in relatedModels" 
          :key="relatedModel.id"
          :href="`/tech-articles/model/${relatedModel.id}`"
          class="model-card"
        >
          <div class="model-card-content">
            <h4>{{ relatedModel.fullName }}</h4>
            <p>{{ relatedModel.driveType }} • {{ relatedModel.scale }}</p>
            <span class="popularity">{{ relatedModel.popularity }}% popularity</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import ModelSelector from '~/components/ModelSelector.vue'

export default {
  components: {
    ModelSelector
  },
  async asyncData({ $content, params, error }) {
    try {
      const modelId = params.modelId
      console.log('Loading articles for model:', modelId)
      
      const { getModelById, scanModels } = await import('~/utils/model-scanner')
      
      const model = await getModelById(modelId)
      
      if (!model) {
        console.log('Model not found:', modelId)
        return { model: null, articles: [], allModels: [] }
      }
      
      // Load all articles
      console.log('Loading all articles...')
      const allArticles = await $content('articles')
        .sortBy('date', 'desc')
        .fetch()
      
      console.log('Total articles loaded:', allArticles.length)
      
      // Filter articles related to this model
      const articles = allArticles.filter(article => {
        const articleModels = article.models || []
        const compatibleModels = article.compatibleModels || []
        
        // 如果文章没有指定任何模型，则视为通用文章，不在模型页面显示
        const isGeneralArticle = articleModels.length === 0 && compatibleModels.length === 0
        
        // 如果文章指定了模型，检查是否包含当前模型
        const hasModel = articleModels.includes(modelId)
        const hasCompatible = compatibleModels.includes(modelId)
        
        if (hasModel || hasCompatible) {
          console.log('Found matching article:', article.title, 'models:', articleModels, 'compatible:', compatibleModels)
        }
        
        // 只显示指定了当前模型的文章，不显示通用文章
        return hasModel || hasCompatible
      })
      
      console.log('Filtered articles count:', articles.length)
      
      // Load all models for related models section
      const allModels = await scanModels()
      
      return {
        model,
        articles,
        allModels
      }
    } catch (err) {
      console.error('Error in asyncData:', err)
      error({ statusCode: 500, message: 'Failed to load model articles' })
      return { model: null, articles: [], allModels: [] }
    }
  },
  
  data() {
    return {
      model: null,
      articles: [],
      allModels: []
    }
  },
  
  computed: {
    filteredArticles() {
      return this.articles
    },
    
    relatedModels() {
      if (!this.model) return []
      
      return this.allModels
        .filter(m => m.id !== this.model.id && m.status === 'active')
        .filter(m => m.brand === this.model.brand || m.driveType === this.model.driveType)
        .slice(0, 3)
    }
  },
  
  methods: {
    navigateToArticle(slug) {
      this.$router.push(`/tech-articles/${slug}`)
    },
    
    navigateToModel(modelId) {
      this.$router.push(`/tech-articles/model/${modelId}`)
    },
    
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    }
  },
  
  head() {
    return {
      title: this.model ? `${this.model.fullName} Technical Articles - RC Drift Parts` : 'Model Articles',
      description: this.model ? `Technical articles and guides specifically for ${this.model.fullName} RC drift car. ${this.model.description}` : 'Technical articles for RC drift car models',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.model ? `${this.model.fullName} Technical Articles` : 'RC Drift Model Articles'
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.model ? `Expert technical content for ${this.model.fullName} RC drift car` : 'Technical guides for RC drift cars'
        },
      ]
    }
  }
}
</script>

<style scoped>
.model-articles-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #666;
}

.breadcrumb a {
  color: #007bff;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb .separator {
  color: #ccc;
}

.breadcrumb .current {
  color: #333;
  font-weight: 600;
}

.model-header {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.model-info h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.model-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 1.5rem;
}

.model-specs {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.spec-item {
  background: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.model-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.model-selector-section {
  margin-bottom: 3rem;
}

.articles-section {
  margin-bottom: 3rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.article-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.article-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.article-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.article-content {
  padding: 1.5rem;
}

.article-title {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
  color: #333;
  line-height: 1.4;
}

.article-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #999;
}

.no-articles {
  text-align: center;
  padding: 4rem 2rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.no-articles-content h3 {
  margin: 1rem 0 0.5rem;
  color: #333;
}

.no-articles-content p {
  color: #666;
  margin-bottom: 2rem;
}

.browse-all-btn {
  background: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
}

.browse-all-btn:hover {
  background: #0056b3;
}

.related-models {
  border-top: 2px solid #f0f0f0;
  padding-top: 3rem;
}

.related-models h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.model-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  border: 2px solid #f0f0f0;
  transition: border-color 0.2s, transform 0.2s;
}

.model-card:hover {
  border-color: #007bff;
  transform: translateY(-2px);
}

.model-card-content h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.model-card-content p {
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.popularity {
  background: #28a745;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .model-header {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .models-grid {
    grid-template-columns: 1fr;
  }
}
</style>