<template>
  <div class="minimal-homepage">
    <!-- 极简搜索区域 -->
    <main class="search-section">
      <div class="hero-text">
        <h1 class="hero-title">RC Parts Finder</h1>
        <p class="hero-subtitle">Find compatible parts for your RC car model</p>
      </div>

      <!-- 搜索框 -->
      <div class="search-container">
        <div class="search-input-wrapper">
          <input 
            ref="searchInput"
            type="text" 
            placeholder="Search by model name..."
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
            <span class="model-tag" @click="searchModel('Tamiya TT-02')">Tamiya TT-02</span>
            <!-- <span class="model-tag" @click="searchModel('Yokomo YD-2')">Yokomo YD-2</span>
            <span class="model-tag" @click="searchModel('MST RMX')">MST RMX</span>
            <span class="model-tag" @click="searchModel('3Racing Sakura')">3Racing Sakura</span> -->
          </div>
        </div>
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
    }
  },
  head() {
    return {
      title: 'RC Parts Finder',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Find compatible parts for your RC car model'
        }
      ]
    }
  }
}
</script>

<style scoped>
.minimal-homepage {
  min-height: 100vh;
  background: #f8fafc;
  color: #1e293b;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.search-section {
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.hero-text {
  margin-bottom: 40px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 12px;
  color: #1e293b;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

.search-container {
  width: 100%;
}

.search-input-wrapper {
  position: relative;
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #1e293b;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 4px;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.1s ease;
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
  font-size: 14px;
  margin-bottom: 2px;
}

.suggestion-name {
  color: #64748b;
  font-size: 13px;
}

.popular-models {
  margin-top: 24px;
}

.model-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.model-tag {
  padding: 8px 16px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569;
}

.model-tag:hover {
  background: #e2e8f0;
  color: #334155;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .search-input {
    padding: 14px 16px;
  }
  
  .model-tags {
    gap: 6px;
  }
  
  .model-tag {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}
</style>