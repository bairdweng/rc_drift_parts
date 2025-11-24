<template>
  <div class="model-selector">
    <div class="selector-container">
      <label for="model-select" class="selector-label">
        <i class="icon-car"></i>
        Select RC Drift Car Model:
      </label>
      
      <div class="dropdown-wrapper">
        <input
          id="model-search"
          v-model="searchQuery"
          type="text"
          placeholder="Search models..."
          class="search-input"
          @focus="showDropdown = true"
          @input="handleSearch"
        />
        
        <button 
          class="dropdown-toggle"
          @click="showDropdown = !showDropdown"
          :class="{ active: showDropdown }"
        >
          <span>{{ selectedModel ? selectedModel.fullName : 'Choose a model' }}</span>
          <i class="dropdown-arrow">▼</i>
        </button>
        
        <div v-if="showDropdown" class="dropdown-menu">
          <div v-if="filteredModels.length === 0" class="no-results">
            No models found
          </div>
          
          <div v-else>
            <div 
              v-for="model in filteredModels" 
              :key="model.id"
              class="model-option"
              :class="{ selected: selectedModel && selectedModel.id === model.id }"
              @click="selectModel(model)"
            >
              <div class="model-brand">{{ model.brand }}</div>
              <div class="model-name">{{ model.name }}</div>
              <div class="model-type">{{ model.driveType }} • {{ model.scale }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        v-if="selectedModel" 
        class="view-articles-btn"
        @click="navigateToModelArticles"
      >
        View Articles for {{ selectedModel.name }}
        <i class="icon-arrow">→</i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { scanModels } from '~/utils/model-scanner'

const models = ref([])
const selectedModel = ref(null)
const searchQuery = ref('')
const showDropdown = ref(false)

// Load models on component mount
onMounted(async () => {
  models.value = await scanModels()
})

// Filter models based on search query
const filteredModels = computed(() => {
  if (!searchQuery.value) {
    return models.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return models.value.filter(model => 
    model.name.toLowerCase().includes(query) ||
    model.brand.toLowerCase().includes(query) ||
    model.fullName.toLowerCase().includes(query)
  )
})

// Handle search input
const handleSearch = () => {
  showDropdown.value = true
}

// Select a model
const selectModel = (model) => {
  selectedModel.value = model
  searchQuery.value = ''
  showDropdown.value = false
}

// Navigate to model-specific articles
const navigateToModelArticles = () => {
  if (selectedModel.value) {
    window.location.href = `/tech-articles/model/${selectedModel.value.id}`
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.dropdown-wrapper')) {
    showDropdown.value = false
  }
}

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.model-selector {
  margin: 2rem 0;
}

.selector-container {
  max-width: 500px;
  margin: 0 auto;
}

.selector-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
}

.selector-label i {
  margin-right: 0.5rem;
  color: #007bff;
}

.dropdown-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.dropdown-toggle {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.2s;
}

.dropdown-toggle:hover,
.dropdown-toggle.active {
  border-color: #007bff;
}

.dropdown-arrow {
  transition: transform 0.2s;
}

.dropdown-toggle.active .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.model-option {
  padding: 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.model-option:hover {
  background-color: #f8f9fa;
}

.model-option.selected {
  background-color: #e3f2fd;
  border-left: 4px solid #007bff;
}

.model-brand {
  font-weight: 600;
  color: #007bff;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.model-name {
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.model-type {
  font-size: 0.85rem;
  color: #666;
}

.no-results {
  padding: 1rem;
  text-align: center;
  color: #666;
  font-style: italic;
}

.view-articles-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.view-articles-btn:hover {
  background: #0056b3;
}

.view-articles-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.icon-arrow {
  font-size: 0.9rem;
}
</style>