<template>
  <div class="drift-parts-homepage">
    <!-- 搜索区域 - 60%视觉权重 -->
    <main class="search-section">
      <div class="hero-text">
        <h1 class="hero-title">Your RC Drift Car Parts Search Starts Here</h1>
        <p class="hero-subtitle">Search for perfect parts for your RC drift car, starting with Tamiya TT-02</p>
      </div>

      <!-- 搜索框 -->
      <div class="search-container">
        <div class="search-input-wrapper">
          <input 
            ref="searchInput"
            type="text" 
            placeholder="Search RC drift car models (e.g., Tamiya TT-02)"
            class="search-input"
            v-model="searchQuery"
            @input="handleInput"
            @keydown="handleKeydown"
            @focus="showSuggestions = true"
            @blur="handleBlur"
          />
          <!-- 搜索建议 -->
          <div 
            v-if="showSuggestions && searchSuggestions.length > 0" 
            class="suggestions-dropdown"
            @mousedown="preventBlur"
          >
            <div 
              v-for="(model, index) in searchSuggestions" 
              :key="model.id"
              class="suggestion-item"
              :class="{ active: index === activeSuggestionIndex }"
              @mousedown="selectSuggestion(model)"
            >
              <span class="suggestion-brand">{{ model.brand }}</span>
              <span class="suggestion-name">{{ model.name }}</span>
            </div>
          </div>
        </div>

        <!-- 热门车型 -->
        <div class="popular-models">
          <div class="model-tags">
            <span class="model-tag tt02-quick-entry" @click="searchModel('Tamiya TT-02')">Tamiya TT-02</span>
          </div>
          <p class="expansion-hint">More popular RC drift car models coming soon</p>
        </div>
      </div>

      <!-- TT-02专题入口 - 30%视觉权重 -->
      <div class="tt02-feature-section">
        <div class="tt02-card">
          <h2 class="tt02-title">Tamiya TT-02 - Most Popular Entry-Level Drift Car</h2>
          <div class="tt02-highlights">
            <span class="highlight-badge">300+ Compatible Parts</span>
            <span class="highlight-badge">Detailed Specifications Comparison</span>
          </div>
          <button class="tt02-action-btn" @click="navigateToTT02">
            View TT-02 Parts →
          </button>
        </div>
      </div>

      <!-- 漂移车简单介绍 - 8%视觉权重 -->
      <div class="drift-intro-section">
        <p class="drift-intro-text">
          RC drift cars require professional suspension, power systems, and tires to achieve optimal handling performance. 
          Finding the right parts is essential for creating the perfect RC drift car setup.
        </p>
      </div>

      <!-- 未来扩展提示 - 2%视觉权重 -->
      <div class="future-expansion-section">
        <p class="future-hint">
          More popular drift car models in development: Yokomo YD-2, MST RMX, etc.
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import { searchModels } from '~/utils/models'

export default {
  data() {
    return {
      searchQuery: '',
      searchSuggestions: [],
      showSuggestions: false,
      activeSuggestionIndex: -1,
      searchTimeout: null
    }
  },
  methods: {
    handleInput() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      
      this.searchTimeout = setTimeout(() => {
        this.performSearch()
      }, 300)
    },
    
    performSearch() {
      if (!this.searchQuery.trim()) {
        this.searchSuggestions = []
        this.showSuggestions = false
        return
      }
      
      this.searchSuggestions = searchModels(this.searchQuery)
      this.showSuggestions = true
      this.activeSuggestionIndex = -1
    },
    
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
    
    confirmSelection() {
      if (this.activeSuggestionIndex >= 0 && this.activeSuggestionIndex < this.searchSuggestions.length) {
        this.selectSuggestion(this.searchSuggestions[this.activeSuggestionIndex])
      } else {
        this.handleSearch()
      }
    },
    
    selectSuggestion(model) {
      this.searchQuery = model.fullName
      this.showSuggestions = false
      this.navigateToModel(model.id)
    },
    
    handleSearch() {
      this.showSuggestions = false
      
      if (!this.searchQuery.trim()) {
        return
      }
      
      const results = searchModels(this.searchQuery)
      
      if (results.length === 0) {
        // 极简风格不显示无结果提示
        return
      } else if (results.length === 1) {
        this.navigateToModel(results[0].id)
      } else {
        // 多个结果时选择第一个
        this.navigateToModel(results[0].id)
      }
    },
    
    handleBlur() {
      setTimeout(() => {
        this.showSuggestions = false
      }, 150)
    },
    
    preventBlur(event) {
      event.preventDefault()
    },
    
    searchModel(modelName) {
      this.searchQuery = modelName
      this.handleSearch()
    },
    
    navigateToModel(modelId) {
      this.$router.push(`/parts/${modelId}`)
    },
    
    navigateToTT02() {
      this.$router.push('/parts/tamiya-tt-02')
    }
  },
  head() {
    return {
      title: 'RC Drift Cars Parts - Find Compatible Upgrades',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Search for perfect parts for your RC drift car, starting with Tamiya TT-02. Quickly find compatible suspension, power, and tire upgrade parts.'
        }
      ]
    }
  }
}
</script>

<style scoped>
.drift-parts-homepage {
  min-height: 100vh;
  background: #f8fafc;
  color: #1e293b;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.search-section {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

.hero-text {
  margin-bottom: 20px;
}

.hero-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: #1e293b;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  font-weight: 400;
  line-height: 1.4;
}

.search-container {
  width: 100%;
  margin-bottom: 20px;
}

.search-input-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 18px 24px;
  border: 3px solid #e2e8f0;
  border-radius: 16px;
  background: white;
  color: #1e293b;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-weight: 500;
}

.search-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 8px;
}

.suggestion-item {
  padding: 14px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
  display: flex;
  flex-direction: column;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover,
.suggestion-item.active {
  background: #f8fafc;
}

.suggestion-brand {
  font-weight: 600;
  color: #1e293b;
  font-size: 15px;
  margin-bottom: 4px;
}

.suggestion-name {
  color: #64748b;
  font-size: 14px;
}

.popular-models {
  margin-top: 16px;
}

.model-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.model-tag {
  padding: 10px 20px;
  background: #f1f5f9;
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #475569;
  font-weight: 500;
}

.model-tag:hover {
  background: #e2e8f0;
  color: #334155;
  transform: translateY(-2px);
}

.tt02-quick-entry {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-color: #3b82f6;
  font-weight: 600;
}

.tt02-quick-entry:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.expansion-hint {
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 0;
  font-style: italic;
}

/* TT-02专题入口 - 30%视觉权重 */
.tt02-feature-section {
  margin: 15px auto;
  max-width: 500px;
}

.tt02-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  text-align: center;
}

.tt02-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px;
  line-height: 1.3;
}

.tt02-highlights {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.highlight-badge {
  background: #f0f9ff;
  color: #0369a1;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid #bae6fd;
}

.tt02-action-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.tt02-action-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

/* 漂移车简单介绍 - 8%视觉权重 */
.drift-intro-section {
  max-width: 500px;
  margin: 10px auto;
  text-align: center;
}

.drift-intro-text {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  font-weight: 400;
}

/* 未来扩展提示 - 2%视觉权重 */
.future-expansion-section {
  max-width: 500px;
  margin: 8px auto;
  text-align: center;
}

.future-hint {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .drift-parts-homepage {
    padding: 30px 16px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .search-input {
    padding: 16px 20px;
    font-size: 1rem;
  }
  
  .tt02-card {
    padding: 24px;
    margin: 30px auto;
  }
  
  .tt02-title {
    font-size: 1.3rem;
  }
  
  .tt02-highlights {
    flex-direction: column;
    align-items: center;
  }
  
  .tt02-action-btn {
    padding: 12px 24px;
    font-size: 1rem;
  }
  
  .drift-intro-text {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .search-input {
    padding: 14px 18px;
  }
  
  .tt02-card {
    padding: 20px;
  }
  
  .tt02-title {
    font-size: 1.2rem;
  }
}
</style>