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
        <img 
          v-if="model.images && model.images.main" 
          :src="model.images.main" 
          :alt="model.fullName || model.name"
          class="model-image-real"
        />
        <div v-else class="image-placeholder">
          🚗 Tamiya TT-02 Image
        </div>
      </div>
    </header>

    <!-- Search and Filter Section -->
    <div class="search-filter-section">
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

      <!-- Category Filter Section -->
      <div class="filter-section">
        <div class="filter-container">
          <div class="filter-header">
            <h3 class="filter-title">Filter by Category</h3>
            <div class="filter-stats">
              <span v-if="selectedCategory" class="active-filter">
                Showing: {{ selectedCategory }}
                <button class="clear-filter" @click="clearCategoryFilter">× Clear</button>
              </span>
              <span v-else class="total-count">{{ parts.length }} parts total</span>
            </div>
          </div>
          
          <div class="category-filters">
            <button
              v-for="category in categories"
              :key="category.id"
              :class="['category-filter-btn', { active: selectedCategory === category.name }]"
              @click="toggleCategoryFilter(category.name)"
            >
              <span class="category-name">{{ category.name }}</span>
              <span class="category-count">{{ getCategoryCount(category.name) }}</span>
            </button>
          </div>
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
            <img 
              v-if="part.image" 
              :src="part.image" 
              :alt="part.name"
              class="part-image-real"
              @click="openImageModal(part)"
            />
            <div v-else class="image-placeholder-small">📷</div>
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

    <!-- 图片查看模态框 -->
    <div v-if="selectedImagePart" class="modal-overlay image-modal-overlay" @click="closeImageModal" @keydown="handleKeydownModal">
      <div class="modal-content image-modal-content" @click.stop>
        <button class="modal-close image-modal-close" @click="closeImageModal">×</button>
        <div class="image-modal-header">
          <h2>{{ selectedImagePart.name }}</h2>
          <p class="image-modal-category">{{ selectedImagePart.category }}</p>
        </div>
        <div class="image-modal-body">
          <img 
            :src="selectedImagePart.image" 
            :alt="selectedImagePart.name"
            class="image-modal-image"
          />
        </div>
        <div class="image-modal-footer">
          <p class="image-modal-specs">{{ selectedImagePart.specs }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 使用异步数据加载，减少初始包大小
export default {
  async asyncData({ $fetch }) {
    try {
      // 加载零件数据
      const partsData = require('~/data/parts/tamiya-tt-02-parts.json')
      // 加载模型数据
      const modelData = require('~/data/models/tamiya-tt-02.json')
      return {
        parts: partsData,
        model: modelData
      }
    } catch (error) {
      console.error('加载数据失败:', error)
      return {
        parts: [],
        model: {}
      }
    }
  },
  
  data() {
    return {
      searchQuery: '',
      searchSuggestions: [],
      showSuggestions: false,
      activeSuggestionIndex: -1,
      searchTimeout: null,
      selectedPart: null,
      selectedImagePart: null,
      selectedCategory: null
    }
  },
  computed: {
    categories() {
      // 从categories.json获取标准分类
      return [
        { id: 'chassis', name: 'Chassis' },
        { id: 'drivetrain', name: 'Drivetrain' },
        { id: 'suspension', name: 'Suspension' },
        { id: 'steering', name: 'Steering' },
        { id: 'motor', name: 'Motor / Motor Mount' },
        { id: 'wheels_tires', name: 'Wheels & Tires' },
        { id: 'hardware', name: 'Hardware' },
        { id: 'body', name: 'body' },
        { id: 'electronics', name: 'electronics' }
      ]
    },
    
    filteredParts() {
      let filtered = this.parts
      
      // 应用分类筛选
      if (this.selectedCategory) {
        filtered = filtered.filter(part => part.category === this.selectedCategory)
      }
      
      // 应用搜索筛选
      if (this.searchQuery.trim()) {
        const searchTerm = this.searchQuery.toLowerCase().trim()
        filtered = filtered.filter(part => 
          part.name.toLowerCase().includes(searchTerm) ||
          part.category.toLowerCase().includes(searchTerm) ||
          (part.specs && part.specs.toLowerCase().includes(searchTerm))
        )
      }
      
      return filtered
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
    
    // Category filter methods
    toggleCategoryFilter(categoryName) {
      if (this.selectedCategory === categoryName) {
        this.selectedCategory = null
      } else {
        this.selectedCategory = categoryName
      }
      // 清除搜索查询，避免冲突
      this.searchQuery = ''
      this.showSuggestions = false
    },
    
    clearCategoryFilter() {
      this.selectedCategory = null
    },
    
    getCategoryCount(categoryName) {
      return this.parts.filter(part => part.category === categoryName).length
    },
    

    searchEbay(part) {
      const searchQuery = encodeURIComponent(`Tamiya TT-02 ${part.name}`)
      window.open(`https://www.ebay.com/sch/i.html?_nkw=${searchQuery}`, '_blank')
    },
    showGuide(part) {
      this.selectedPart = part
    },
    
    // 打开图片查看模态框
    openImageModal(part) {
      this.selectedImagePart = part
    },
    
    // 关闭图片查看模态框
    closeImageModal() {
      this.selectedImagePart = null
    },
    
    // 键盘事件处理（ESC键关闭模态框）
    handleKeydownModal(event) {
      if (event.key === 'Escape' && this.selectedImagePart) {
        this.closeImageModal()
      }
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
  padding: 20px;
  text-align: center;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
}

.model-image-real {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.model-image-real:hover {
  transform: scale(1.02);
}

.image-placeholder {
  font-size: 1.5rem;
}

/* 搜索和筛选区域布局 */
.search-filter-section {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 搜索区域样式 */
.search-section {
  margin-bottom: 0;
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

/* 分类筛选区域样式 */
.filter-section {
  margin-bottom: 40px;
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
}

.filter-container {
  max-width: 100%;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-title {
  font-size: 1.3rem;
  color: #333;
  margin: 0;
  font-weight: 600;
}

.filter-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.active-filter {
  background: #667eea;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  line-height: 1;
}

.clear-filter {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  border-radius: 20px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  line-height: 1;
  margin: 0;
  position: relative;
  white-space: nowrap;
}

.clear-filter:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.total-count {
  color: #666;
  font-size: 0.9rem;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 0;
  padding: 0;
}

.category-filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  margin: 0;
  white-space: nowrap;
}

.category-filter-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.category-filter-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.category-name {
  font-weight: 500;
}

.category-count {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.category-filter-btn.active .category-count {
  background: rgba(255, 255, 255, 0.3);
  color: white;
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
  min-height: 120px;
  height: auto;
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

.part-image-real {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
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
  display: none; /* 隐藏分类信息 */
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

/* 文本格式规格参数 - 突出显示 */
.part-specs-text {
  margin-top: auto;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 8px;
  padding: 8px 12px;
  border-left: 4px solid #667eea;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.part-specs-text .spec-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
}

.part-specs-text .spec-label {
  font-size: 0.7rem;
  color: #667eea;
  white-space: nowrap;
  flex-shrink: 0;
  font-weight: 600;
  background: rgba(102, 126, 234, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 2px;
}

.part-specs-text .spec-value {
  font-size: 0.8rem;
  color: #2d3748;
  font-weight: 600;
  line-height: 1.4;
  flex: 1;
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
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

/* 图片查看模态框样式 */
.image-modal-overlay {
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(5px);
}

.image-modal-content {
  max-width: 800px;
  width: 95%;
  max-height: 90vh;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.image-modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0,0,0,0.7);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 10;
  transition: all 0.3s ease;
}

.image-modal-close:hover {
  background: rgba(0,0,0,0.9);
  transform: scale(1.1);
}

.image-modal-header {
  padding: 30px 30px 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.image-modal-header h2 {
  margin: 0 0 8px;
  font-size: 1.5rem;
  color: #333;
}

.image-modal-category {
  margin: 0;
  color: #667eea;
  font-size: 0.9rem;
  font-weight: 500;
}

.image-modal-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background: #f8f9fa;
  overflow: hidden;
}

.image-modal-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.image-modal-image:hover {
  transform: scale(1.02);
}

.image-modal-footer {
  padding: 20px 30px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.image-modal-specs {
  margin: 0;
  color: #2d3748;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 600;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* 为小图片添加点击提示 */
.part-image-real {
  cursor: pointer;
  transition: all 0.3s ease;
}

.part-image-real:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
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