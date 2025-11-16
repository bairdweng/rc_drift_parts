<template>
  <div class="parts-page">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb">
      <a href="/" class="breadcrumb-link">Home</a>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">Tamiya TT-02 Parts</span>
    </nav>

    <!-- Model Header Information -->
    <header class="model-header">
      <div class="model-info">
        <h1 class="model-title">Tamiya TT-02</h1>
        <p class="model-description">The legendary entry-level 4WD touring car chassis, perfect for drift conversions</p>
        
        <div class="model-specs">
          <div class="spec-item">
            <span class="spec-label">Drive Type:</span>
            <span class="spec-value">4WD</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Scale:</span>
            <span class="spec-value">1/10</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Skill Level:</span>
            <span class="spec-value">Beginner to Intermediate</span>
          </div>
        </div>
      </div>
      
      <div class="model-image">
        <div class="image-placeholder">
          🚗 Tamiya TT-02 Image
        </div>
      </div>
    </header>

    <!-- Parts Search Box -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Search parts by name..."
            @input="handleInput"
            @keydown="handleKeydown"
            @focus="showSuggestions = true"
            @blur="handleBlur"
          />
          <button class="search-btn" @click="handleSearch">
            🔍 Search
          </button>
        </div>
        
        <!-- Search Suggestions Dropdown -->
        <div v-if="showSuggestions && searchSuggestions.length > 0" class="search-suggestions">
          <div
            v-for="(part, index) in searchSuggestions"
            :key="part.id"
            :class="['suggestion-item', { active: activeSuggestionIndex === index }]"
            @mousedown="preventBlur"
            @click="selectSuggestion(part)"
          >
            <span class="suggestion-name">{{ part.name }}</span>
            <span class="suggestion-description">{{ part.description }}</span>
          </div>
        </div>
        
        <!-- Search Results Statistics -->
        <div v-if="searchQuery" class="search-stats">
          <span class="results-count">{{ filteredParts.length }} parts found</span>
          <span v-if="searchQuery" class="search-query">for "{{ searchQuery }}"</span>
        </div>
      </div>
    </div>

    <!-- Parts List -->
    <main class="parts-main">
      <!-- No Results Message -->
      <div v-if="searchQuery && filteredParts.length === 0" class="no-results">
        <div class="no-results-icon">🔍</div>
        <div class="no-results-text">
          <p>No parts found for "{{ searchQuery }}"</p>
          <p class="no-results-suggestion">Try searching with different keywords or browse all parts below</p>
        </div>
      </div>
      
      <!-- Parts Grid -->
      <div v-else class="parts-grid">
        <div 
          v-for="part in filteredParts" 
          :key="part.id"
          class="part-card"
        >
          <!-- Part Image -->
          <div class="part-image">
            <div class="image-placeholder-small">📷</div>
          </div>
          
          <!-- Core Information -->
        <div class="part-info">
          <!-- Name -->
          <div class="part-header">
            <h3 class="part-name">{{ part.name }}</h3>
          </div>
          
          <!-- Category -->
          <div class="part-category">
            <span class="category-label">Category:</span>
            <span class="category-value">{{ part.category }}</span>
          </div>
          
          <!-- Specifications as Text -->
          <div class="part-specs-text">
            <div class="spec-item">
              <span class="spec-label">Specifications:</span>
              <span class="spec-value">{{ part.specs }}</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </main>

    <!-- 安装指南模态框 -->
    <div v-if="selectedPart" class="modal-overlay" @click="selectedPart = null">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="selectedPart = null">×</button>
        <h2>{{ selectedPart.name }} Installation Guide</h2>
        <div class="guide-content">
          <p>{{ selectedPart.guide }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import partsData from '~/data/parts/tamiya-tt-02-parts.json'

export default {
  data() {
    return {
      searchQuery: '',
      searchSuggestions: [],
      showSuggestions: false,
      activeSuggestionIndex: -1,
      searchTimeout: null,
      selectedPart: null,
      parts: partsData
    }
  },
  computed: {
    filteredParts() {
      if (!this.searchQuery.trim()) {
        return this.parts
      }
      
      const searchTerm = this.searchQuery.toLowerCase().trim()
      return this.parts.filter(part => 
        part.name.toLowerCase().includes(searchTerm) ||
        part.category.toLowerCase().includes(searchTerm) ||
        (part.specs && part.specs.toLowerCase().includes(searchTerm))
      )
    }
  },
  methods: {
    // 输入处理（带防抖）
    handleInput() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      
      this.searchTimeout = setTimeout(() => {
        this.performSearch()
      }, 300)
    },
    
    // 执行实时搜索
    performSearch() {
      if (!this.searchQuery.trim()) {
        this.searchSuggestions = []
        this.showSuggestions = false
        return
      }
      
      const searchTerm = this.searchQuery.toLowerCase().trim()
      this.searchSuggestions = this.parts.filter(part => 
        part.name.toLowerCase().includes(searchTerm) ||
        part.category.toLowerCase().includes(searchTerm) ||
        (part.specs && part.specs.toLowerCase().includes(searchTerm))
      ).slice(0, 5) // Limit to 5 suggestions
      
      this.showSuggestions = true
      this.activeSuggestionIndex = -1
    },
    
    // Keyboard event handling
    handleKeydown(event) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          this.navigateSuggestions(1)
          break
        case 'ArrowUp':
          event.preventDefault()
          this.navigateSuggestions(-1)
          break
        case 'Enter':
          event.preventDefault()
          this.confirmSelection()
          break
        case 'Escape':
          this.showSuggestions = false
          break
      }
    },
    
    // Navigate suggestions list
    navigateSuggestions(direction) {
      if (!this.showSuggestions || this.searchSuggestions.length === 0) {
        return
      }
      
      this.activeSuggestionIndex += direction
      
      if (this.activeSuggestionIndex < 0) {
        this.activeSuggestionIndex = this.searchSuggestions.length - 1
      } else if (this.activeSuggestionIndex >= this.searchSuggestions.length) {
        this.activeSuggestionIndex = 0
      }
    },
    
    // Confirm selection
    confirmSelection() {
      if (this.activeSuggestionIndex >= 0 && this.activeSuggestionIndex < this.searchSuggestions.length) {
        this.selectSuggestion(this.searchSuggestions[this.activeSuggestionIndex])
      } else {
        this.handleSearch()
      }
    },
    
    // Select suggestion
    selectSuggestion(part) {
      this.searchQuery = part.name
      this.showSuggestions = false
    },
    
    // Handle search button click
    handleSearch() {
      this.showSuggestions = false
    },
    
    // Handle input blur
    handleBlur() {
      setTimeout(() => {
        this.showSuggestions = false
      }, 150)
    },
    
    // Prevent blur when clicking dropdown
    preventBlur(event) {
      event.preventDefault()
    },
    

    searchEbay(part) {
      const searchQuery = encodeURIComponent(`Tamiya TT-02 ${part.name}`)
      window.open(`https://www.ebay.com/sch/i.html?_nkw=${searchQuery}`, '_blank')
    },
    showGuide(part) {
      this.selectedPart = part
    }
  },
  head() {
    return {
      title: 'Tamiya TT-02 Parts - 100% Compatible Upgrade Components',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Find guaranteed compatible parts for Tamiya TT-02. Aluminum upgrades, brushless systems, suspension components, and more. Expert installation guides included.'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'tamiya tt-02 parts, tt02 upgrades, tamiya drift parts, tt02 aluminum chassis, brushless motor tt02, tt02 suspension upgrades'
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
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  font-size: 0.9rem;
  color: #666;
}

.breadcrumb-link {
  color: #667eea;
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
  color: #333;
  margin: 0 0 16px;
  font-weight: 700;
}

.model-description {
  font-size: 1.2rem;
  color: #666;
  margin: 0 0 24px;
  line-height: 1.5;
}

.model-specs {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.spec-item {
  display: flex;
  flex-direction: column;
}

.spec-label {
  font-size: 0.9rem;
  color: #999;
  margin-bottom: 4px;
}

.spec-value {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.model-image {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  color: #666;
}

.image-placeholder {
  font-size: 1.5rem;
}

/* 搜索区域样式 */
.search-section {
  margin-bottom: 40px;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 16px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-btn {
  padding: 16px 32px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

/* 搜索建议下拉列表 */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  animation: slideDown 0.2s ease;
  margin-top: 8px;
}

.suggestion-item {
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover,
.suggestion-item.active {
  background: #f8fafc;
  border-left: 4px solid #667eea;
}

.suggestion-name {
  font-weight: 500;
  color: #333;
}

.suggestion-description {
  font-size: 0.9rem;
  color: #666;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 搜索结果统计 */
.search-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: #666;
}

.results-count {
  font-weight: 500;
  color: #333;
}

.search-query {
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
  font-style: italic;
}

/* 无结果提示 */
.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 40px 20px;
  margin: 40px 0;
}

.no-results-icon {
  font-size: 3rem;
  margin-right: 20px;
  opacity: 0.7;
}

.no-results-text p {
  margin: 0 0 8px;
  color: #64748b;
}

.no-results-text p:last-child {
  margin-bottom: 0;
}

.no-results-suggestion {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 零件网格 */
.parts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.part-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  display: flex;
  gap: 12px;
  height: 120px;
}

.part-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.part-image {
  flex-shrink: 0;
}

.image-placeholder-small {
  width: 60px;
  height: 60px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #666;
}

.part-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.part-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.part-name {
  font-size: 1rem;
  color: #333;
  margin: 0;
  font-weight: 600;
  line-height: 1.3;
  flex: 1;
}

.part-header {
  margin-bottom: 8px;
}

.part-name {
  font-size: 1rem;
  color: #333;
  margin: 0;
  font-weight: 600;
  line-height: 1.3;
}

/* 零件类别 */
.part-category {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-label {
  font-size: 0.7rem;
  color: #999;
  font-weight: 500;
}

.category-value {
  font-size: 0.8rem;
  color: #667eea;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

/* 文本格式规格参数 */
.part-specs-text {
  margin-top: auto;
}

.part-specs-text .spec-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.part-specs-text .spec-label {
  font-size: 0.7rem;
  color: #999;
  white-space: nowrap;
  flex-shrink: 0;
}

.part-specs-text .spec-value {
  font-size: 0.75rem;
  color: #333;
  font-weight: 500;
  line-height: 1.3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
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

.modal-content h2 {
  margin: 0 0 20px;
  color: #333;
}

.guide-content {
  line-height: 1.6;
  color: #666;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .model-header {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .model-title {
    font-size: 2rem;
  }
  
  .search-input-wrapper {
    flex-direction: column;
  }
  
  .parts-grid {
    grid-template-columns: 1fr;
  }
  
  .part-card {
    flex-direction: column;
  }
  
  .part-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .part-actions {
    flex-direction: column;
  }
}
</style>