<template>
  <div class="models-page">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb">
      <a href="/" class="breadcrumb-link">Home</a>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">All Models</span>
    </nav>

    <!-- Page Header -->
    <header class="page-header">
      <h1 class="page-title">RC Drift Car Models</h1>
      <p class="page-subtitle">Browse all available RC drift car models and find compatible parts</p>
    </header>

    <!-- Search and Filter Section -->
    <section class="filter-section">
      <div class="search-container">
        <input 
          type="text" 
          placeholder="Search models by brand or name..."
          class="search-input"
          v-model="searchQuery"
        />
        <div class="filter-buttons">
          <button 
            v-for="brand in availableBrands" 
            :key="brand"
            :class="['filter-btn', { active: activeBrand === brand }]"
            @click="toggleBrandFilter(brand)"
          >
            {{ brand }}
          </button>
        </div>
      </div>
    </section>

    <!-- Models Grid -->
    <main class="models-grid">
      <div 
        v-for="model in filteredModels" 
        :key="model.id"
        class="model-card"
        @click="goToModel(model)"
      >
        <div class="model-image">
          <div class="image-placeholder">
            🚗
          </div>
        </div>
        
        <div class="model-info">
          <div class="model-header">
            <h3 class="model-name">{{ model.fullName }}</h3>
            <span class="popularity-badge" :class="getPopularityClass(model.popularity)">
              {{ model.popularity }}% Popular
            </span>
          </div>
          
          <p class="model-description">{{ model.description }}</p>
          
          <div class="model-specs">
            <div class="spec-item">
              <span class="spec-label">Scale:</span>
              <span class="spec-value">{{ model.scale }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Drive:</span>
              <span class="spec-value">{{ model.driveType }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Type:</span>
              <span class="spec-value">{{ model.type }}</span>
            </div>
          </div>
          
          <div class="model-meta">
            <span class="release-year">Released: {{ model.releaseYear }}</span>
            <span class="status-badge" :class="model.status">
              {{ model.status === 'active' ? 'Active' : 'Discontinued' }}
            </span>
          </div>
        </div>
        
        <div class="model-actions">
          <button class="view-parts-btn" @click.stop="goToModel(model)">
            View Parts
          </button>
        </div>
      </div>
    </main>

    <!-- Empty State -->
    <div v-if="filteredModels.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>No models found</h3>
      <p>Try adjusting your search or filter criteria</p>
      <button class="clear-filters-btn" @click="clearFilters">
        Clear All Filters
      </button>
    </div>

    <!-- No Data Dialog -->
    <div v-if="showNoDataDialog" class="dialog-overlay" @click="showNoDataDialog = false">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <h3>Development in Progress</h3>
          <button class="dialog-close" @click="showNoDataDialog = false">×</button>
        </div>
        <div class="dialog-content">
          <div class="dialog-icon">🚧</div>
          <p class="dialog-message">
            Parts database for <strong>{{ selectedModelName }}</strong> is currently under development.
          </p>
          <p class="dialog-submessage">
            We're working hard to add more models to our database. Please check back later!
          </p>
        </div>
        <div class="dialog-actions">
          <button class="dialog-btn primary" @click="showNoDataDialog = false">
            Got it!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $content }) {
    try {
      // Load all model data from data/models directory
      // Since we're using static JSON files, we'll manually import them
      // In a real Nuxt Content setup, you would use $content
      
      // For now, we'll manually import the available models
      const tamiyaTT02 = await import('~/data/models/tamiya-tt-02.json')
      
      // Add placeholder models that don't have data yet
      const placeholderModels = [
        {
          id: 'yokomo-yd2',
          name: 'YD-2',
          fullName: 'Yokomo YD-2',
          brand: 'Yokomo',
          description: 'Competition-grade RWD drift chassis with advanced suspension design.',
          scale: '1/10',
          driveType: 'RWD',
          type: 'Competition',
          releaseYear: 2015,
          popularity: 85,
          status: 'active',
          hasData: false
        },
        {
          id: 'mst-rmx20',
          name: 'RMX 2.0',
          fullName: 'MST RMX 2.0',
          brand: 'MST',
          description: 'Popular RWD drift platform with excellent tuning capabilities.',
          scale: '1/10',
          driveType: 'RWD',
          type: 'RWD Drift',
          releaseYear: 2018,
          popularity: 78,
          status: 'active',
          hasData: false
        },
        {
          id: '3racing-sakura-d5',
          name: 'Sakura D5',
          fullName: '3Racing Sakura D5',
          brand: '3Racing',
          description: 'Budget-friendly RWD drift chassis with good performance.',
          scale: '1/10',
          driveType: 'RWD',
          type: 'Budget Drift',
          releaseYear: 2019,
          popularity: 65,
          status: 'active',
          hasData: false
        }
      ]
      
      // Mark Tamiya TT-02 as having data
      const tamiyaModel = {
        ...(tamiyaTT02.default || tamiyaTT02),
        hasData: true
      }
      
      const models = [tamiyaModel, ...placeholderModels]
      
      // Extract unique brands
      const brands = [...new Set(models.map(model => model.brand))]
      
      return {
        models: models.sort((a, b) => b.popularity - a.popularity),
        availableBrands: brands
      }
    } catch (error) {
      console.error('Error loading models:', error)
      return {
        models: [],
        availableBrands: []
      }
    }
  },
  
  data() {
    return {
      searchQuery: '',
      activeBrand: null,
      showNoDataDialog: false,
      selectedModelName: ''
    }
  },
  
  computed: {
    filteredModels() {
      let filtered = this.models
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(model => 
          model.fullName.toLowerCase().includes(query) ||
          model.brand.toLowerCase().includes(query) ||
          model.name.toLowerCase().includes(query)
        )
      }
      
      // Apply brand filter
      if (this.activeBrand) {
        filtered = filtered.filter(model => model.brand === this.activeBrand)
      }
      
      return filtered
    }
  },
  
  methods: {
    toggleBrandFilter(brand) {
      this.activeBrand = this.activeBrand === brand ? null : brand
    },
    
    goToModel(model) {
      if (!model.hasData) {
        this.selectedModelName = model.fullName
        this.showNoDataDialog = true
        return
      }
      this.$router.push(`/parts/${model.id}`)
    },
    
    getPopularityClass(popularity) {
      if (popularity >= 80) return 'high'
      if (popularity >= 60) return 'medium'
      return 'low'
    },
    
    clearFilters() {
      this.searchQuery = ''
      this.activeBrand = null
    }
  },
  
  head() {
    return {
      title: 'RC Drift Car Models - Browse All Available Models',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Browse our complete collection of RC drift car models. Find parts and upgrades for Tamiya, Yokomo, MST, 3Racing, and more.'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'rc drift car models, tamiya models, yokomo models, mst models, rc car database, drift car catalog'
        }
      ]
    }
  }
}
</script>

<style scoped>
.models-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
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
  color: #999;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.filter-section {
  margin-bottom: 40px;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.filter-btn:hover {
  border-color: #007bff;
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.model-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.model-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  border-color: #007bff;
}

.model-image {
  text-align: center;
  margin-bottom: 15px;
}

.image-placeholder {
  font-size: 3rem;
  opacity: 0.7;
}

.model-info {
  flex: 1;
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.model-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.popularity-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.popularity-badge.high {
  background: #d4edda;
  color: #155724;
}

.popularity-badge.medium {
  background: #fff3cd;
  color: #856404;
}

.popularity-badge.low {
  background: #f8d7da;
  color: #721c24;
}

.model-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.model-specs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.spec-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.spec-label {
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 2px;
}

.spec-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.model-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.release-year {
  font-size: 0.9rem;
  color: #666;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.discontinued {
  background: #f8d7da;
  color: #721c24;
}

.model-actions {
  margin-top: auto;
}

.view-parts-btn {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-parts-btn:hover {
  background: #0056b3;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
}

.clear-filters-btn {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clear-filters-btn:hover {
  background: #545b62;
}

/* Dialog Styles */
.dialog-overlay {
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

.dialog {
  background: white;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: dialogSlideIn 0.3s ease-out;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0 20px;
  border-bottom: 1px solid #e0e0e0;
}

.dialog-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.dialog-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-close:hover {
  color: #333;
}

.dialog-content {
  padding: 20px;
  text-align: center;
}

.dialog-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.dialog-message {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.4;
}

.dialog-submessage {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.dialog-actions {
  padding: 0 20px 20px 20px;
  text-align: center;
}

.dialog-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.dialog-btn.primary {
  background: #007bff;
  color: white;
}

.dialog-btn.primary:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .models-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .model-specs {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>