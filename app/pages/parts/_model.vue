<template>
  <div class="parts-page">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb">
      <a href="#" @click.prevent="$router.push('/')" class="breadcrumb-link">Home</a>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">{{ modelData.fullName }} Parts</span>
    </nav>

    <!-- Model Header Information -->
    <header class="model-header">
      <div class="model-info">
        <h1 class="model-title">{{ modelData.fullName }}</h1>
        <p class="model-description">{{ modelData.description }}</p>
        
        <div class="model-specs">
          <div class="spec-item">
            <span class="spec-label">Drive Type:</span>
            <span class="spec-value">{{ modelData.driveType }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Scale:</span>
            <span class="spec-value">{{ modelData.scale }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Chassis Material:</span>
            <span class="spec-value">{{ modelData.specifications.chassisMaterial }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Wheelbase:</span>
            <span class="spec-value">{{ modelData.specifications.wheelbase }}</span>
          </div>
        </div>
      </div>
      
      <div class="model-image">
        <div class="image-placeholder">
          🚗 {{ modelData.fullName }} Image
        </div>
      </div>
    </header>

    <!-- Model Selector for Article Navigation -->
    <div class="model-selector-section">
      <div class="selector-container">
        <h3 class="selector-title">Browse Technical Articles</h3>
        <p class="selector-description">Find installation guides and technical articles for this model</p>
        <ModelSelector />
      </div>
    </div>

    <!-- Parts Category Navigation -->
    <nav class="parts-nav">
      <button 
        v-for="category in categories" 
        :key="category.id"
        :class="['nav-btn', { active: activeCategory === category.id }]"
        @click="activeCategory = category.id"
      >
        {{ category.name }}
      </button>
    </nav>

    <!-- Parts List -->
    <main class="parts-main">
      <div class="parts-grid">
        <div 
          v-for="part in filteredParts" 
          :key="part.id"
          class="part-card"
        >
          <div class="part-image">
            <div class="image-placeholder-small">📷</div>
          </div>
          <div class="part-info">
            <h3 class="part-name">{{ part.name }}</h3>
            <p class="part-description">{{ part.description }}</p>
            
            <div class="part-specs">
              <span class="compatibility-badge">✅ 100% Compatible</span>
              <span class="difficulty-badge" :class="part.installation.difficulty">
                {{ getDifficultyText(part.installation.difficulty) }}
              </span>
            </div>
            
            <div class="part-pricing">
              <span class="price">${{ part.pricing.retail }}</span>
              <span class="availability" :class="part.pricing.availability">
                {{ part.pricing.availability === 'in_stock' ? 'In Stock' : 'Out of Stock' }}
              </span>
            </div>
            
            <div class="part-actions">
              <button class="buy-btn" @click="searchVendor(part)">
                🔍 Find Online
              </button>
              <button class="guide-btn" @click="showGuide(part)">
                📖 Installation Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Installation Guide Modal -->
    <div v-if="selectedPart" class="modal-overlay" @click="selectedPart = null">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="selectedPart = null">×</button>
        <h2>{{ selectedPart.name }} Installation Guide</h2>
        <div class="guide-content">
          <h3>Tools Required:</h3>
          <ul>
            <li v-for="tool in selectedPart.installation.toolsRequired" :key="tool">
              {{ tool }}
            </li>
          </ul>
          <h3>Estimated Time: {{ selectedPart.installation.timeEstimate }}</h3>
          <p>Difficulty Level: {{ selectedPart.installation.difficulty }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import categoriesData from '~/data/categories.json'
import ModelSelector from '~/components/ModelSelector.vue'

export default {
  components: {
    ModelSelector
  },
  async asyncData({ params }) {
    try {
      // Load model data based on route parameter
      const modelData = await import(`~/data/models/${params.model}.json`)
      
      // Load parts data for this model
      const partsData = await import(`~/data/parts/${params.model}-parts.json`)
      
      return {
        modelData: modelData.default || modelData,
        parts: partsData.default || partsData,
        categories: categoriesData
      }
    } catch (error) {
      console.error('Error loading model data:', error)
      // Redirect to 404 if model not found
      throw { statusCode: 404, message: 'Model not found' }
    }
  },
  
  data() {
    return {
      activeCategory: 'chassis',
      selectedPart: null
    }
  },
  
  computed: {
    filteredParts() {
      return this.parts.filter(part => part.category === this.activeCategory)
    }
  },
  
  methods: {
    getDifficultyText(difficulty) {
      const difficultyMap = {
        'beginner': '🟢 Beginner',
        'intermediate': '🟡 Intermediate',
        'advanced': '🔴 Advanced'
      }
      return difficultyMap[difficulty] || '🟡 Intermediate'
    },
    
    searchVendor(part) {
      if (part.vendors && part.vendors.length > 0) {
        window.open(part.vendors[0].url, '_blank')
      } else {
        // Fallback search
        const searchQuery = encodeURIComponent(`${part.name} ${this.modelData.fullName}`)
        window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank')
      }
    },
    
    showGuide(part) {
      this.selectedPart = part
    }
  },
  
  head() {
    return {
      title: this.modelData.seo.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.modelData.seo.description
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.modelData.seo.keywords.join(', ')
        }
      ]
    }
  }
}
</script>

<style scoped>
.parts-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  font-size: 14px;
  color: #666;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 10px;
}

.breadcrumb-current {
  color: #333;
  font-weight: 500;
}

.model-header {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  align-items: start;
}

.model-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
}

.model-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.model-specs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.spec-label {
  font-weight: 600;
  color: #555;
}

.spec-value {
  color: #333;
}

.model-image {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}

.model-selector-section {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
}

.selector-container {
  max-width: 600px;
  margin: 0 auto;
}

.selector-title {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 8px;
  font-weight: 600;
}

.selector-description {
  color: #666;
  margin: 0 0 16px;
  font-size: 0.95rem;
}

.parts-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 10px 20px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-btn:hover {
  border-color: #007bff;
  color: #007bff;
}

.nav-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.parts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.part-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  background: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.part-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.part-image {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  margin-bottom: 15px;
  font-size: 2rem;
}

.part-name {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.part-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.part-specs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.compatibility-badge {
  background: #d4edda;
  color: #155724;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.difficulty-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.difficulty-badge.beginner {
  background: #d4edda;
  color: #155724;
}

.difficulty-badge.intermediate {
  background: #fff3cd;
  color: #856404;
}

.difficulty-badge.advanced {
  background: #f8d7da;
  color: #721c24;
}

.part-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.price {
  font-size: 1.3rem;
  font-weight: 600;
  color: #28a745;
}

.availability {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.availability.in_stock {
  background: #d4edda;
  color: #155724;
}

.availability.out_of_stock {
  background: #f8d7da;
  color: #721c24;
}

.part-actions {
  display: flex;
  gap: 10px;
}

.buy-btn, .guide-btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.buy-btn {
  background: #007bff;
  color: white;
}

.buy-btn:hover {
  background: #0056b3;
}

.guide-btn {
  background: #6c757d;
  color: white;
}

.guide-btn:hover {
  background: #545b62;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-close:hover {
  color: #333;
}

.guide-content h3 {
  margin-top: 15px;
  margin-bottom: 10px;
  color: #333;
}

.guide-content ul {
  margin-left: 20px;
  margin-bottom: 15px;
}

.guide-content li {
  margin-bottom: 5px;
}

@media (max-width: 768px) {
  .model-header {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .parts-grid {
    grid-template-columns: 1fr;
  }
  
  .part-actions {
    flex-direction: column;
  }
}
</style>