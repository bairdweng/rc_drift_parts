<template>
  <v-app>
    <v-main>
      <!-- 搜索工具界面 -->
      <v-container fluid>
        <!-- 顶部应用栏 -->
        <v-app-bar color="primary" dark flat dense app>
          <v-toolbar-title class="text-h6 font-weight-bold">
            RC Drift Parts Finder
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-app-bar>

        <!-- 主内容区域 -->
        <v-container class="pa-4 mt-8">
          <v-row dense>
            <v-col cols="12">
              <!-- 搜索卡片 -->
              <v-card class="mb-4" elevation="4" rounded="lg">
                <v-card-text class="pa-4">
                  <div class="text-center mb-4">
                    <v-icon color="primary" size="48" class="mb-2">mdi-car-sports</v-icon>
                    <h2 class="text-h5 font-weight-bold primary--text mb-2">Find RC Drift Car Parts</h2>
                    <p class="text-body-2 grey--text">Search for parts by model, category, or keyword</p>
                  </div>
                  
                  <v-text-field
                    v-model="searchQuery"
                    placeholder="Search parts, models, or keywords..."
                    outlined
                    dense
                    hide-details
                    @input="handleInput"
                    @keyup.enter="performSearch"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon color="primary">mdi-magnify</v-icon>
                    </template>
                    <template v-slot:append>
                      <v-btn
                        small
                        depressed
                        color="primary"
                        @click="performSearch"
                        class="ml-2"
                      >
                        Search
                      </v-btn>
                    </template>
                  </v-text-field>
                  
                  <!-- 搜索建议 -->
                  <v-card v-if="showSuggestions && searchSuggestions.length > 0" class="mt-2" elevation="2">
                    <v-list dense class="pa-0">
                      <v-list-item
                        v-for="(model, index) in searchSuggestions"
                        :key="model.id"
                        @click="selectSuggestion(model)"
                        :class="{ 'active': index === activeSuggestionIndex }"
                        class="px-2"
                      >
                        <v-list-item-content class="py-1">
                          <v-list-item-title class="text-caption font-weight-medium">
                            {{ model.brand }}
                          </v-list-item-title>
                          <v-list-item-subtitle class="text-caption">
                            {{ model.name }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-card-text>
              </v-card>

              <!-- 快速访问区域 -->
              <v-card class="mb-4" elevation="2" rounded="lg">
                <v-card-text class="pa-3">
                  <div class="d-flex align-center justify-space-between mb-3">
                    <span class="text-body-1 font-weight-medium">Quick Access</span>
                    <v-chip small color="primary" text-color="white">
                      {{ popularModels.length }} models
                    </v-chip>
                  </div>
                  
                  <!-- 热门车型网格 -->
                  <v-row dense>
                    <v-col
                      v-for="model in popularModels"
                      :key="model.id"
                      cols="6"
                      sm="4"
                      md="3"
                    >
                      <v-card
                        class="text-center pa-3"
                        outlined
                        @click="selectModel(model)"
                        hover
                      >
                        <v-card-text class="pa-1">
                          <v-icon small color="primary" class="mb-2">mdi-car</v-icon>
                          <div class="text-caption font-weight-medium">{{ model.name }}</div>
                          <div class="text-caption grey--text">{{ model.category }}</div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- 专题卡片 -->
              <v-card class="mb-4" color="info" dark elevation="2" rounded="lg">
                <v-card-text class="pa-3">
                  <v-row align="center" dense>
                    <v-col cols="auto">
                      <v-icon color="white" size="32">mdi-star-circle</v-icon>
                    </v-col>
                    <v-col>
                      <div class="text-body-1 font-weight-bold">Tamiya TT-02 Collection</div>
                      <div class="text-caption">Popular model with extensive parts selection</div>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                        small
                        depressed
                        color="white"
                        @click="navigateToTT02"
                        class="text-info font-weight-bold"
                        style="color: #2196f3 !important;"
                      >
                        Explore
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- 统计信息 -->
              <v-card class="mb-4" elevation="2" rounded="lg">
                <v-card-text class="pa-3">
                  <v-row dense align="center">
                    <v-col cols="6" class="text-center">
                      <div class="text-h5 font-weight-bold primary--text">50+</div>
                      <div class="text-caption">Part Categories</div>
                    </v-col>
                    <v-col cols="6" class="text-center">
                      <div class="text-h5 font-weight-bold primary--text">1000+</div>
                      <div class="text-caption">Part Models</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- 联系卡片 -->
              <v-card elevation="2" rounded="lg">
                <v-card-text class="pa-3 text-center">
                  <v-icon color="primary" class="mb-2">mdi-email</v-icon>
                  <div class="text-body-2 font-weight-medium mb-1">Need Help?</div>
                  <div class="text-caption grey--text mb-2">Contact us for support</div>
                  <v-btn
                    small
                    text
                    color="primary"
                    href="mailto:bairdweng@gmail.com"
                    class="text-caption"
                  >
                    bairdweng@gmail.com
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      searchQuery: '',
      showSuggestions: false,
      activeSuggestionIndex: -1,
      searchSuggestions: [],
      popularModels: [
        {
          id: 1,
          name: 'Tamiya TT-02',
          brand: 'Tamiya',
          category: 'Drift Car'
        },
        {
          id: 2,
          name: 'Yokomo YD-2',
          brand: 'Yokomo',
          category: 'Competition'
        },
        {
          id: 3,
          name: 'MST RMX 2.0',
          brand: 'MST',
          category: 'RWD Drift'
        },
        {
          id: 4,
          name: '3Racing Sakura D5',
          brand: '3Racing',
          category: 'Budget Drift'
        }
      ]
    }
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim() === '') {
        this.showSuggestions = false
        this.searchSuggestions = []
        return
      }
      
      // 模拟搜索建议
      this.searchSuggestions = this.popularModels.filter(model => 
        model.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        model.brand.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      
      this.showSuggestions = this.searchSuggestions.length > 0
      this.activeSuggestionIndex = -1
    },
    
    handleInput() {
      if (this.searchQuery.length > 1) {
        this.showSuggestions = true
        this.searchSuggestions = this.popularModels.filter(model =>
          model.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          model.brand.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      } else {
        this.showSuggestions = false
        this.searchSuggestions = []
      }
    },
    
    selectSuggestion(model) {
      this.searchQuery = `${model.brand} ${model.name}`
      this.showSuggestions = false
      this.performSearch()
    },
    
    selectModel(model) {
      this.searchQuery = `${model.brand} ${model.name}`
      this.performSearch()
    },
    
    performSearch() {
      if (this.searchQuery.trim()) {
        console.log('Search query:', this.searchQuery)
        this.showSuggestions = false
        
        // 检查是否是Tamiya TT-02相关搜索
        const query = this.searchQuery.toLowerCase()
        if (query.includes('tt-02') || query.includes('tamiya tt-02') || query.includes('tt02')) {
          // 导航到Tamiya TT-02零件页面
          this.$router.push('/parts/tamiya-tt-02')
        } else if (query.includes('yd-2') || query.includes('yokomo')) {
          // 可以添加其他车型的导航逻辑
          console.log('Yokomo YD-2 search detected')
        } else if (query.includes('rmx') || query.includes('mst')) {
          console.log('MST RMX search detected')
        } else if (query.includes('sakura') || query.includes('3racing')) {
          console.log('3Racing Sakura search detected')
        } else {
          // 通用搜索，导航到搜索结果页面或显示当前页面的结果
          console.log('Generic search - implement search results page')
        }
      }
    },
    
    navigateToTT02() {
      // 直接导航到Tamiya TT-02零件页面
      this.$router.push('/parts/tamiya-tt-02')
    }
  },
  head() {
    return {
      title: 'RC Drift Car Parts - Find Compatible Upgrades',
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
/* 使用Vuetify自带样式，移除自定义CSS */
</style>