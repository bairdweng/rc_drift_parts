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

      <!-- No Data Dialog -->
      <div v-if="showNoDataDialog" class="dialog-overlay" @click="showNoDataDialog = false">
        <div class="dialog" @click.stop>
          <div class="dialog-header">
            <v-icon color="warning" class="mr-2">mdi-tools</v-icon>
            <span class="dialog-title">Development in Progress</span>
            <v-btn icon small @click="showNoDataDialog = false" class="close-btn">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <div class="dialog-content">
            <v-icon color="info" size="48" class="mb-3">mdi-hammer-wrench</v-icon>
            <h3 class="dialog-model-name">{{ selectedModelName }}</h3>
            <p class="dialog-message">
              This model is currently under development. We're working hard to add parts data for {{ selectedModelName }}.
              Please check back soon for updates!
            </p>
          </div>
          <div class="dialog-actions">
            <v-btn
              color="primary"
              depressed
              @click="showNoDataDialog = false"
              class="dialog-btn"
            >
              Got it
            </v-btn>
          </div>
        </div>
      </div>
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
          category: 'Drift Car',
          hasData: true
        },
        {
          id: 2,
          name: 'Yokomo YD-2',
          brand: 'Yokomo',
          category: 'Competition',
          hasData: false
        },
        {
          id: 3,
          name: 'MST RMX 2.0',
          brand: 'MST',
          category: 'RWD Drift',
          hasData: false
        },
        {
          id: 4,
          name: '3Racing Sakura D5',
          brand: '3Racing',
          category: 'Budget Drift',
          hasData: false
        }
      ],
      showNoDataDialog: false,
      selectedModelName: ''
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
      
      // 检查模型是否有数据
      if (model.hasData) {
        this.performSearch()
      } else {
        // 显示开发提示对话框
        this.selectedModelName = model.name
        this.showNoDataDialog = true
      }
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

/* No Data Dialog Styles */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.dialog {
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: dialogSlideIn 0.3s ease;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
}

.dialog-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  flex: 1;
  display: flex;
  align-items: center;
}

.close-btn {
  margin-left: 8px;
}

.dialog-content {
  padding: 24px;
  text-align: center;
}

.dialog-model-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1976d2;
  margin: 0 0 16px 0;
}

.dialog-message {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #666;
  margin: 0;
}

.dialog-actions {
  padding: 16px 24px 24px;
  text-align: center;
  border-top: 1px solid #e0e0e0;
}

.dialog-btn {
  min-width: 120px;
  font-weight: 600;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>