<template>
  <v-dialog v-model="showModal" max-width="800">
    <v-card>
      <!-- Fixed Header -->
      <v-card-title class="headline primary white--text" style="position: sticky; top: 0; z-index: 100;">
        <v-icon left>mdi-package-variant</v-icon>
        {{ part ? part.name : 'No Part Selected' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="closeModal" class="white--text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-card-text class="pa-4">
        <v-row>
          <!-- Part Image -->
          <v-col cols="12" md="4">
            <v-img 
              :src="part ? part.image : ''" 
              :alt="part ? part.name : ''"
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
                  <v-list-item-subtitle class="text--primary">{{ part ? part.category : '' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-label</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Subcategory</v-list-item-title>
                  <v-list-item-subtitle class="text--primary">{{ part ? part.subcategory || 'N/A' : 'N/A' }}</v-list-item-subtitle>
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
            <p class="body-2">{{ part ? part.specs : '' }}</p>
          </v-col>
          
          <v-col cols="12" md="6">
            <h3 class="subtitle-1 primary--text mb-2">
              <v-icon left color="primary">mdi-function</v-icon>
              Function
            </h3>
            <p class="body-2">{{ part ? part.function : '' }}</p>
          </v-col>
        </v-row>
        
        <!-- Compatibility -->
        <v-divider class="my-4"></v-divider>
        
        <h3 class="subtitle-1 primary--text mb-2">
          <v-icon left color="primary">mdi-car</v-icon>
          Compatibility
        </h3>
        <div class="d-flex flex-wrap" style="gap: 8px;">
          <v-chip 
            v-for="model in (part ? part.compatibility : [])" 
            :key="model"
            color="secondary"
            small
            class="ma-1"
          >
            {{ model }}
          </v-chip>
        </div>
        
        <!-- Related Articles -->
        <v-divider class="my-4"></v-divider>
        
        <h3 class="subtitle-1 primary--text mb-2">
          <v-icon left color="primary">mdi-book-open-variant</v-icon>
          Related Articles
        </h3>
        <div class="related-articles-section">
          <v-card 
            v-for="article in getRelatedArticles(part)" 
            :key="article.slug"
            class="mb-2"
            outlined
            @click="navigateToArticle(article.slug)"
            style="cursor: pointer; transition: all 0.3s ease;"
          >
            <v-card-text class="pa-3">
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-3">mdi-file-document</v-icon>
                <div>
                  <div class="body-2 font-weight-medium">{{ article.title }}</div>
                  <div class="caption text--secondary">{{ article.description }}</div>
                </div>
                <v-spacer></v-spacer>
                <v-icon color="primary">mdi-chevron-right</v-icon>
              </div>
            </v-card-text>
          </v-card>
          
          <!-- No articles message -->
          <div v-if="getRelatedArticles(part).length === 0" class="text-center py-4">
            <v-icon color="grey" size="48" class="mb-2">mdi-book-remove</v-icon>
            <div class="body-2 text--secondary">No related articles available</div>
            <div class="caption text--secondary">Check back later for new content</div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PartDetailModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    part: {
      type: Object,
      default: () => (null)
    }
  },
  computed: {
    showModal: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit('update:show', value)
      }
    }
  },
  methods: {
    closeModal() {
      this.showModal = false
    },
    
    // 获取相关文章
    getRelatedArticles(part) {
      if (!part) return []
      
      // 使用预处理数据中的relatedArticles字段
      if (part.relatedArticles && Array.isArray(part.relatedArticles) && part.relatedArticles.length > 0) {
        return part.relatedArticles
      }
      
      // 如果没有预处理数据，使用备用方案
      return []
    },
    
    // 导航到文章页面
    navigateToArticle(slug) {
      this.$router.push(`/tech-articles/${slug}`)
    }
  }
}
</script>

<style scoped>
.related-articles-section .v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}
</style>