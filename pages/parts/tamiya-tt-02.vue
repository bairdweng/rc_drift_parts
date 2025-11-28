<template>
  <v-app>
    <!-- Top Navigation Bar with Breadcrumb -->
    <v-app-bar color="primary" dark flat dense app>
      <!-- Breadcrumb Navigation inside Navigation Bar -->
      <div class="breadcrumb-nav" style="display: flex; align-items: center; margin-left: 16px;">
        <nav class="breadcrumb-container" style="display: flex; align-items: center;">
          <a href="/" class="breadcrumb-link" style="color: white; text-decoration: none; display: flex; align-items: center;">
            <v-icon small class="mr-1" style="color: white;">mdi-home</v-icon>
            <span style="color: white;">Home</span>
          </a>
          <span class="breadcrumb-divider" style="color: white; margin: 0 8px;">/</span>
          <span class="breadcrumb-current" style="color: white; display: flex; align-items: center;">
            <v-icon small class="mr-1" style="color: white;">mdi-car</v-icon>
            <span style="color: white;">Tamiya TT-02 Parts</span>
          </span>
        </nav>
      </div>
      
      <v-spacer></v-spacer>
      
      <!-- Main Navigation Buttons -->
      <v-btn icon @click="$router.push('/')" class="mr-2" style="display: none;">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-toolbar-title class="text-h6 font-weight-bold" style="display: none;">
        RC Drift Parts Finder
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
      <!-- Articles Buttons - Integrated in Navigation Bar -->
      <v-btn text @click="$router.push('/tech-articles')" class="mr-2 articles-nav-btn">
        <v-icon left small>mdi-book-open-variant</v-icon>
        General Articles
      </v-btn>
      <v-btn text @click="$router.push('/tech-articles/model/tamiya-tt-02')" class="mr-2 articles-nav-btn">
        <v-icon left small>mdi-car-sports</v-icon>
        TT-02 Articles
      </v-btn>
    </v-app-bar>

    <!-- Enhanced Model Header -->
    <v-container class="enhanced-header-container" fluid style="margin-top: 80px;">
      <v-row justify="center">
        <v-col cols="12" lg="10" xl="8">
          <v-card class="enhanced-header-card" elevation="2" rounded="lg">
            <v-card-text class="pa-6">
              <v-row align="center">
                <v-col cols="12" md="8">
                  <h1 class="text-h4 font-weight-bold primary--text mb-2">Tamiya TT-02 Parts Library</h1>
                  <p class="text-body-1 grey--text mb-4">Discover high-performance drift parts designed specifically for the legendary TT-02 chassis</p>
                  
                  <v-row class="specs-grid">
                    <v-col cols="12" sm="4">
                      <div class="spec-item d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-car-shift-pattern</v-icon>
                        <div>
                          <div class="text-caption grey--text">Drive Type</div>
                          <div class="text-body-2 font-weight-medium">4WD</div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <div class="spec-item d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-ruler</v-icon>
                        <div>
                          <div class="text-caption grey--text">Scale</div>
                          <div class="text-body-2 font-weight-medium">1/10</div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <div class="spec-item d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-account-star</v-icon>
                        <div>
                          <div class="text-caption grey--text">Skill Level</div>
                          <div class="text-body-2 font-weight-medium">Beginner to Intermediate</div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                
                <v-col cols="12" md="4" class="text-center">
                  <div class="quick-actions-section">
                    <v-btn 
                      outlined 
                      @click="$router.push('/tech-articles/model/tamiya-tt-02')"
                      class="mb-2 action-btn"
                      block
                    >
                      <v-icon left>mdi-book-open-variant</v-icon>
                      TT-02 Guides
                    </v-btn>
                    <v-btn 
                      outlined 
                      @click="$router.push('/tech-articles')"
                      class="action-btn"
                      block
                    >
                      <v-icon left>mdi-library</v-icon>
                      All Articles
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Enhanced Search and Filter Section -->
    <v-container class="enhanced-search-section" fluid>
       <v-row justify="center">
         <v-col cols="12" lg="10" xl="8">
           <v-row class="mb-6">
             <v-col cols="12">
               <!-- Smart Search Card -->
               <v-card class="smart-search-card" elevation="2" rounded="lg">
                 <v-card-text class="pa-4">
                   <v-row align="center" class="mb-4">
                     <v-col cols="auto">
                       <v-icon color="primary" size="32">mdi-magnify</v-icon>
                     </v-col>
                     <v-col>
                       <h2 class="text-h5 font-weight-bold primary--text">Find Your Perfect Parts</h2>
                       <p class="text-body-2 grey--text mb-0">Search by part name, function, or specifications</p>
                     </v-col>
                     <v-col cols="auto">
                       <span class="text-caption grey--text">{{ parts.length }} parts available</span>
                     </v-col>
                   </v-row>
                   
                   <v-text-field
                     ref="searchInput"
                     v-model="searchQuery"
                     placeholder="Search by part name, function, or specifications..."
                     outlined
                     dense
                     hide-details
                     @input="handleInput"
                     @keydown="handleKeydown"
                     @focus="showSuggestions = true"
                     @blur="handleBlur"
                   >
                     <template v-slot:prepend-inner>
                       <v-icon color="primary">mdi-magnify</v-icon>
                     </template>
                     <template v-slot:append>
                       <v-btn
                         small
                         depressed
                         color="primary"
                         @click="handleSearch"
                       >
                         Search
                       </v-btn>
                     </template>
                   </v-text-field>
                   
                   <!-- Enhanced Search Suggestions -->
                   <v-card v-if="showSuggestions && searchSuggestions.length > 0" class="mt-2" elevation="4">
                     <v-list dense class="pa-0">
                       <v-list-item
                         v-for="(part, index) in searchSuggestions"
                         :key="part.id"
                         @click="selectSuggestion(part)"
                         :class="{ 'v-list-item--active': index === activeSuggestionIndex }"
                         class="px-2"
                       >
                         <v-list-item-avatar size="40" class="mr-3">
                           <v-icon :color="getCategoryColor(part.category)" size="24">
                             {{ getCategoryIcon(part.category) }}
                           </v-icon>
                         </v-list-item-avatar>
                         <v-list-item-content class="py-1">
                           <v-list-item-title class="text-caption font-weight-medium">
                             {{ part.name }}
                           </v-list-item-title>
                           <v-list-item-subtitle class="text-caption">
                             <v-chip 
                               small 
                               :color="getCategoryColor(part.category)" 
                               text-color="white"
                               class="mr-1"
                             >
                               {{ part.category }}
                             </v-chip>
                             {{ part.function }}
                           </v-list-item-subtitle>
                         </v-list-item-content>
                       </v-list-item>
                     </v-list>
                   </v-card>
                 </v-card-text>
               </v-card>
             </v-col>
           </v-row>
           
           <!-- Enhanced Category Filter -->
           <v-row>
             <v-col cols="12">
               <v-card class="enhanced-filter-card" elevation="2" rounded="lg">
                 <v-card-title>
                   <v-icon color="primary" class="mr-2">mdi-filter</v-icon>
                   <span class="text-h6">Browse by Function</span>
                   <v-spacer></v-spacer>
                   <div v-if="selectedCategory">
                     <span class="text-caption grey--text mr-2">Active Filter:</span>
                     <v-chip 
                       :color="getCategoryColor(selectedCategory)" 
                       text-color="white"
                       class="mr-2"
                     >
                       {{ selectedCategory }}
                     </v-chip>
                     <v-btn 
                       small 
                       text 
                       color="primary" 
                       @click="clearCategoryFilter"
                     >
                       Clear
                     </v-btn>
                   </div>
                 </v-card-title>
                 
                 <v-card-text>
                   <v-row>
                     <v-col 
                       v-for="category in availableCategories"
                       :key="category.id"
                       cols="12"
                       sm="6"
                       md="4"
                     >
                       <v-card
                         :class="['category-card', { 'active': selectedCategory === category.name }]"
                         @click="toggleCategoryFilter(category.name)"
                         :style="{ borderLeft: `4px solid ${getCategoryColor(category.name)}` }"
                         elevation="1"
                         hover
                       >
                         <v-card-text class="pa-3">
                           <v-row align="center" no-gutters>
                             <v-col cols="auto">
                               <v-icon :color="getCategoryColor(category.name)" size="28" class="mr-3">
                                 {{ getCategoryIcon(category.name) }}
                               </v-icon>
                             </v-col>
                             <v-col>
                               <h4 class="text-body-1 font-weight-medium mb-1">{{ category.name }}</h4>
                               <p class="text-caption grey--text mb-1">{{ category.description }}</p>
                               <span class="text-caption font-weight-medium">{{ getCategoryCount(category.name) }} parts</span>
                             </v-col>
                           </v-row>
                         </v-card-text>
                       </v-card>
                     </v-col>
                   </v-row>
                 </v-card-text>
               </v-card>
             </v-col>
           </v-row>
         </v-col>
       </v-row>
     </v-container>

     <!-- Enhanced Parts List -->
     <v-container class="enhanced-parts-section" fluid>
       <v-row justify="center">
         <v-col cols="12" lg="10" xl="8">
           <!-- Results Header -->
           <v-row class="mb-4">
             <v-col cols="12">
               <v-card elevation="1" class="pa-4">
                 <v-row align="center">
                   <v-col>
                     <h3 class="text-h6 font-weight-medium">
                       <span class="primary--text font-weight-bold">{{ filteredParts.length }}</span>
                       <span class="grey--text"> parts found</span>
                       <span v-if="selectedCategory" class="ml-2">
                         in <v-chip 
                           :color="getCategoryColor(selectedCategory)" 
                           text-color="white"
                           small
                         >
                           {{ selectedCategory }}
                         </v-chip>
                       </span>
                     </h3>
                     <p class="text-caption grey--text mb-0">Browse through our collection of high-quality RC drift parts</p>
                   </v-col>
                   <v-col cols="auto">
                     <v-btn 
                       small 
                       outlined 
                       color="primary" 
                       @click="clearFilters"
                     >
                       Clear All Filters
                     </v-btn>
                   </v-col>
                 </v-row>
               </v-card>
             </v-col>
           </v-row>

           <!-- Enhanced Parts Grid -->
           <v-row>
             <v-col
               v-for="part in filteredParts"
               :key="part.id"
               cols="12"
               sm="6"
               md="4"
               lg="3"
             >
               <v-card
                 class="enhanced-part-card"
                 @click="showPartDetails(part)"
                 elevation="2"
                 hover
               >
                 <v-card-text class="part-card-content pa-4">
                   <!-- Part Header -->
                   <div class="part-header mb-3">
                     <div class="part-image-section">
                       <div class="image-container">
                         <v-img
                           v-if="part.image"
                           :src="part.image"
                           :alt="part.name"
                           class="part-image"
                           cover
                         >
                           <template v-slot:placeholder>
                             <div class="image-placeholder">
                               <v-icon large color="grey lighten-1">mdi-cog</v-icon>
                             </div>
                           </template>
                         </v-img>
                         <div v-else class="image-placeholder">
                           <v-icon large color="grey lighten-1">mdi-cog</v-icon>
                         </div>
                         <div class="image-overlay">
                           <v-icon color="white" large>mdi-eye</v-icon>
                         </div>
                       </div>
                     </div>
                     
                     <div class="part-title-section">
                       <h4 class="text-body-1 font-weight-bold mb-1">{{ part.name }}</h4>
                       <div class="part-id-category">
                         <v-chip small color="grey lighten-3" class="mr-2">
                           <v-icon x-small left>mdi-tag</v-icon>
                           {{ part.id }}
                         </v-chip>
                         <v-chip small :color="getCategoryColor(part.category)" text-color="white">
                           {{ part.category }}
                         </v-chip>
                       </div>
                     </div>
                   </div>

                   <!-- Function Section -->
                   <div class="function-section mb-3">
                     <div class="section-header">
                       <v-icon small color="primary" class="mr-1">mdi-function</v-icon>
                       <span class="text-caption font-weight-bold primary--text">FUNCTION</span>
                     </div>
                     <p class="text-body-2 mb-0 function-text">{{ part.function }}</p>
                   </div>

                   <!-- Specs Section -->
                   <div class="specs-section mb-3">
                     <div class="section-header">
                       <v-icon small color="green" class="mr-1">mdi-wrench</v-icon>
                       <span class="text-caption font-weight-bold green--text">SPECIFICATIONS</span>
                     </div>
                     <p class="text-body-2 mb-0 specs-text">{{ part.specs }}</p>
                   </div>

                   <!-- Compatibility Section -->
                   <div class="compatibility-section">
                     <div class="section-header">
                       <v-icon small color="orange" class="mr-1">mdi-car</v-icon>
                       <span class="text-caption font-weight-bold orange--text">COMPATIBILITY</span>
                     </div>
                     <div class="compatibility-chips">
                       <v-chip
                         v-for="model in part.compatibility"
                         :key="model"
                         x-small
                         color="orange lighten-4"
                         text-color="orange darken-3"
                         class="mr-1 mb-1"
                       >
                         {{ model }}
                       </v-chip>
                     </div>
                   </div>
                 </v-card-text>
               </v-card>
             </v-col>
           </v-row>
         </v-col>
       </v-row>
     </v-container>

     <!-- Part Details Modal -->
     <v-dialog v-model="showPartModal" max-width="800" persistent>
       <v-card>
         <v-card-title class="headline primary white--text">
           <v-icon left>mdi-package-variant</v-icon>
           {{ selectedPart ? selectedPart.name : 'No Part Selected' }}
           <v-spacer></v-spacer>
           <v-btn icon @click="showPartModal = false" class="white--text">
             <v-icon>mdi-close</v-icon>
           </v-btn>
         </v-card-title>
         

         
         <v-card-text class="pa-4">
           <v-row>
             <!-- Part Image -->
             <v-col cols="12" md="4">
               <v-img 
                 :src="selectedPart ? selectedPart.image : ''" 
                 :alt="selectedPart ? selectedPart.name : ''"
                 height="200"
                 contain
                 class="mb-4 rounded"
               />
             </v-col>
             
             <!-- Part Details -->
             <v-col cols="12" md="8">
               <v-list dense class="transparent">
                 <v-list-item>
                   <v-list-item-icon>
                     <v-icon color="primary">mdi-tag</v-icon>
                   </v-list-item-icon>
                   <v-list-item-content>
                     <v-list-item-title>Category</v-list-item-title>
                     <v-list-item-subtitle class="text--primary">{{ selectedPart ? selectedPart.category : '' }}</v-list-item-subtitle>
                   </v-list-item-content>
                 </v-list-item>
                 
                 <v-list-item>
                   <v-list-item-icon>
                     <v-icon color="primary">mdi-label</v-icon>
                   </v-list-item-icon>
                   <v-list-item-content>
                     <v-list-item-title>Subcategory</v-list-item-title>
                     <v-list-item-subtitle class="text--primary">{{ selectedPart ? selectedPart.subcategory || 'N/A' : 'N/A' }}</v-list-item-subtitle>
                   </v-list-item-content>
                 </v-list-item>
               </v-list>
             </v-col>
           </v-row>
           
           <!-- Specifications -->
           <v-divider class="my-4"></v-divider>
           
           <v-row>
             <v-col cols="12" md="6">
               <h3 class="subtitle-1 primary--text mb-2">
                 <v-icon left color="primary">mdi-wrench</v-icon>
                 Specifications
               </h3>
               <p class="body-2">{{ selectedPart ? selectedPart.specs : '' }}</p>
             </v-col>
             
             <v-col cols="12" md="6">
               <h3 class="subtitle-1 primary--text mb-2">
                 <v-icon left color="primary">mdi-function</v-icon>
                 Function
               </h3>
               <p class="body-2">{{ selectedPart ? selectedPart.function : '' }}</p>
             </v-col>
           </v-row>
           
           <!-- Compatibility -->
           <v-divider class="my-4"></v-divider>
           
           <h3 class="subtitle-1 primary--text mb-2">
             <v-icon left color="primary">mdi-car</v-icon>
             Compatibility
           </h3>
           <div class="d-flex flex-wrap gap-2">
             <v-chip 
               v-for="model in (selectedPart ? selectedPart.compatibility : [])" 
               :key="model"
               color="secondary"
               small
             >
               {{ model }}
             </v-chip>
           </div>
         </v-card-text>
         
         <v-card-actions class="pa-4">
           <v-spacer></v-spacer>
           <v-btn color="primary" @click="showPartModal = false">Close</v-btn>
         </v-card-actions>
       </v-card>
     </v-dialog>

     <!-- Image Viewing Modal -->
     <v-dialog v-model="selectedImagePart" max-width="800" persistent>
       <v-card>
         <v-card-title class="headline secondary white--text">
           {{ selectedImagePart ? selectedImagePart.name : '' }}
           <v-spacer></v-spacer>
           <v-btn icon @click="closeImageModal" class="white--text">
             <v-icon>mdi-close</v-icon>
           </v-btn>
         </v-card-title>
         <v-card-subtitle class="pa-4 pb-0">
           <v-chip color="primary" small>{{ selectedImagePart ? selectedImagePart.category : '' }}</v-chip>
         </v-card-subtitle>
         <v-card-text class="pa-4 text-center">
           <v-img 
             :src="selectedImagePart ? selectedImagePart.image : ''" 
             :alt="selectedImagePart ? selectedImagePart.name : ''"
             max-height="400"
             contain
             class="mb-4"
           />
           <p class="body-2">{{ selectedImagePart ? selectedImagePart.specs : '' }}</p>
         </v-card-text>
         <v-card-actions class="pa-4">
           <v-spacer></v-spacer>
           <v-btn color="primary" @click="closeImageModal">Close</v-btn>
         </v-card-actions>
       </v-card>
     </v-dialog>
   </v-app>
</template>

<script>
import ModelSelector from '~/components/ModelSelector.vue'

// 使用异步数据加载，减少初始包大小
export default {
  components: {
    ModelSelector
  },
  async asyncData({ $fetch }) {
    try {
      // 加载零件数据
      const partsData = require('~/data/parts/tamiya-tt-02-parts.json')
      // 加载分类数据
      const categoriesData = require('~/data/categories.json')
      // 加载模型数据
      const modelData = require('~/data/models/tamiya-tt-02.json')
      
      // 将零件数据与分类数据关联
      const partsWithCategoryNames = partsData.map(part => {
        const category = categoriesData.categories.find(cat => cat.id === part.category_id)
        const processedPart = {
          ...part,
          category: category ? category.name : 'Unknown',
          category_description: category ? category.description : ''
        }
        return processedPart
      })
      
      return {
        parts: partsWithCategoryNames,
        categories: categoriesData.categories,
        model: modelData
      }
    } catch (error) {
      console.error('加载数据失败:', error)
      return {
        parts: [],
        categories: [],
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
      selectedCategory: null,
      showPartModal: false
    }
  },
  computed: {
    availableCategories() {
      // 使用从categories.json加载的标准分类
      return this.$data.categories || []
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
          (part.specs && part.specs.toLowerCase().includes(searchTerm)) ||
          (part.function && part.function.toLowerCase().includes(searchTerm)) ||
          (part.subcategory && part.subcategory.toLowerCase().includes(searchTerm))
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
        (part.specs && part.specs.toLowerCase().includes(searchTerm)) ||
        (part.function && part.function.toLowerCase().includes(searchTerm)) ||
        (part.subcategory && part.subcategory.toLowerCase().includes(searchTerm))
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
    
    // 获取分类颜色
    getCategoryColor(categoryName) {
      const colorMap = {
        'Steering & Control': 'purple',
        'Drivetrain & Smoothness': 'green',
        'Suspension & Handling': 'orange',
        'Motor & Electronics': 'red',
        'Wheels & Tires': 'teal',
        'Hardware & Mounts': 'grey',
        'Stabilizers & Controllers': 'indigo',
        'Body & Accessories': 'brown'
      }
      return colorMap[categoryName] || 'grey'
    },
    
    // 获取分类图标
    getCategoryIcon(categoryName) {
      const iconMap = {
        'Steering & Control': 'mdi-steering',
        'Drivetrain & Smoothness': 'mdi-cog',
        'Suspension & Handling': 'mdi-car-suspension',
        'Motor & Electronics': 'mdi-engine',
        'Wheels & Tires': 'mdi-car-tire-alert',
        'Hardware & Mounts': 'mdi-wrench',
        'Stabilizers & Controllers': 'mdi-chip',
        'Body & Accessories': 'mdi-car-body'
      }
      return iconMap[categoryName] || 'mdi-cog'
    },

    searchEbay(part) {
      const searchQuery = encodeURIComponent(`Tamiya TT-02 ${part.name}`)
      window.open(`https://www.ebay.com/sch/i.html?_nkw=${searchQuery}`, '_blank')
    },
    
    // Show part details
    showPartDetails(part) {
      this.selectedPart = part
      this.showPartModal = true
    },
    
    // Clear all filters
    clearFilters() {
      this.searchQuery = ''
      this.selectedCategory = null
      this.showSuggestions = false
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
    },
    
    // 导航到文章页面
    navigateToArticle(slug) {
      this.$router.push(`/tech-articles/${slug}`)
    },
    
    // 导航到文章列表页面
    navigateToArticleList(type) {
      if (type === 'general') {
        this.$router.push('/tech-articles')
      } else if (type === 'tt02') {
        this.$router.push('/tech-articles?model=tamiya-tt-02')
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
/* Enhanced Page Layout */
.enhanced-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Enhanced Model Header */
.enhanced-model-header {
  padding: 60px 0 40px;
  color: white;
  text-align: center;
}

/* Enhanced Parts Section */
.enhanced-parts-section {
  background: #f8f9fa;
  padding: 40px 0;
}

/* Enhanced Part Card Styles */
.enhanced-part-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.enhanced-part-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.part-card-header {
  border-bottom: 1px solid #e0e0e0;
}

.part-card-content {
  display: flex;
  flex-direction: column;
}

.part-image-section {
  position: relative;
  overflow: hidden;
}

.image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
}

.part-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-container:hover .image-overlay {
  opacity: 1;
}

.image-container:hover .part-image {
  transform: scale(1.05);
}

/* New Part Card Layout Styles */
.part-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.part-image-section {
  flex-shrink: 0;
  width: 80px;
}

.part-image-section .image-container {
  height: 80px;
  width: 80px;
}

.part-title-section {
  flex: 1;
}

.part-id-category {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* Section Styles */
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #f0f0f0;
}

.function-section {
  background: linear-gradient(135deg, #f8fbff 0%, #e3f2fd 100%);
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
}

.function-text {
  line-height: 1.4;
  color: #1565c0;
}

.specs-section {
  background: linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%);
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.specs-text {
  line-height: 1.4;
  color: #2e7d32;
}

.compatibility-section {
  background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%);
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #ff9800;
}

.compatibility-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.part-info-section {
  flex: 1;
}

.part-specs {
  border-top: 1px solid #f0f0f0;
  padding-top: 0.75rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.spec-item:last-child {
  border-bottom: none;
}

/* Category Card Styles */
.category-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.category-card.active {
  background-color: #f8f9fa !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .enhanced-model-header {
    padding: 40px 0 20px;
  }
  
  .enhanced-parts-section {
    padding: 20px 0;
  }
  
  .image-container {
    height: 150px;
  }
}

/* Modal Styles */
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
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 1.5rem;
}

.modal-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  margin-bottom: 1rem;
}

.modal-specs {
  margin-bottom: 1rem;
}

.modal-spec-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.modal-spec-item:last-child {
  border-bottom: none;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-actions .v-btn {
  flex: 1;
}
</style>