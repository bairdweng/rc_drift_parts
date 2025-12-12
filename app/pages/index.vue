<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="rc-portal">
      <nav class="navbar" :class="{ scrolled: isScrolled }">
        <div class="nav-content">
          <div class="brand">
            <n-icon size="24" color="#2080f0">
              <game-controller-outline />
            </n-icon>
            <span class="brand-text">DRIFT<span class="highlight">DB</span></span>
          </div>
          <div class="nav-menu hidden-mobile">
            <n-button text class="nav-link active">探索</n-button>
            <n-button text class="nav-link" @click="router.push('/models')">车库</n-button>
            <n-button text class="nav-link" @click="router.push('/tech')">实验室</n-button>
          </div>
          <div class="nav-right">
            <n-button size="small" secondary type="primary" round>
              <template #icon><n-icon><logo-github /></n-icon></template>
              贡献数据
            </n-button>
          </div>
        </div>
      </nav>

      <header class="hero-header">
        <div class="hero-bg-pattern"></div>
        <n-flex vertical align="center" justify="center" class="hero-container">
          <n-badge dot type="success" processing>
            <n-tag round :bordered="false" type="primary" size="small" class="version-tag">
              v2.0 数据库已更新
            </n-tag>
          </n-badge>
          
          <h1 class="main-title">RC Drift Parts Wiki</h1>
          <p class="sub-title">不仅是零件列表，更是你的改装蓝图。收录 Tamiya, Yokomo, MST 主流数据。</p>

          <div class="search-box-wrapper">
            <div class="search-box">
              <n-input
                v-model:value="searchQuery"
                size="large"
                placeholder="输入零件编号 (如 54001) 或 车型..."
                class="hero-input"
                @input="handleInput"
                @keyup.enter="performSearch"
              >
                <template #prefix>
                  <n-icon :component="Search" color="#666" />
                </template>
              </n-input>
              <n-button type="primary" size="large" class="hero-btn" @click="performSearch">
                GO
              </n-button>
            </div>

            <transition name="slide-fade">
              <div v-if="showSuggestions" class="search-dropdown">
                <div class="dropdown-label">快速跳转</div>
                <n-list hoverable clickable>
                  <n-list-item v-for="item in searchSuggestions" :key="item.id" @click="selectModel(item)">
                    <n-thing :title="item.name" content-style="margin-top: 0;">
                      <template #avatar>
                        <n-avatar size="small" color="#f0f0f0" style="color: #333">🏎️</n-avatar>
                      </template>
                      <template #description>
                        <n-tag size="tiny" :bordered="false">{{ item.brand }}</n-tag>
                        <span class="suggestion-cat">{{ item.category }}</span>
                      </template>
                    </n-thing>
                  </n-list-item>
                </n-list>
              </div>
            </transition>
          </div>
        </n-flex>
      </header>

      <main class="main-container">
        
        <section class="section-block">
          <div class="section-head">
            <n-h2 prefix="bar" align-text>热门底盘方案</n-h2>
            <n-button text type="primary" @click="router.push('/models')">查看全部 ></n-button>
          </div>
          
          <n-card class="chassis-tabs-card" content-style="padding: 0;">
            <n-tabs type="segment" size="large" animated>
              <n-tab-pane name="tt02" tab="Tamiya TT-02">
                <div class="tab-content">
                  <div class="tab-info">
                    <n-tag type="warning" size="small">入门首选</n-tag>
                    <h3>不论是拉力还是漂移，梦开始的地方。</h3>
                    <p>TT-02 是市场上零件最丰富的底盘。我们整理了从原厂到全OP的完整升级路径。</p>
                    <n-space style="margin-top: 20px;">
                      <n-button type="primary" @click="router.push('/parts/tamiya-tt-02')">浏览零件清单</n-button>
                      <n-button secondary>查看说明书</n-button>
                    </n-space>
                  </div>
                  <div class="tab-visual tt02-bg">
                    <n-icon size="120" color="rgba(0,0,0,0.1)"><CarSport /></n-icon>
                  </div>
                </div>
              </n-tab-pane>
              <n-tab-pane name="yd2" tab="Yokomo YD-2">
                <div class="tab-content">
                  <div class="tab-info">
                    <n-tag type="error" size="small">竞技王者</n-tag>
                    <h3>RWD 漂移的标准制定者。</h3>
                    <p>专为后驱漂移设计，拥有极高的转向角度和完美的重心配置。</p>
                    <n-space style="margin-top: 20px;">
                      <n-button type="primary" disabled>数据录入中</n-button>
                    </n-space>
                  </div>
                  <div class="tab-visual yd2-bg">
                    <n-icon size="120" color="rgba(0,0,0,0.1)"><CarSport /></n-icon>
                  </div>
                </div>
              </n-tab-pane>
            </n-tabs>
          </n-card>
        </section>

        <section class="section-block">
          <n-h2 prefix="bar" align-text>按类别查找</n-h2>
          <n-grid cols="2 s:3 m:6" x-gap="16" y-gap="16" responsive="screen">
            <n-gi v-for="cat in categories" :key="cat.name">
              <n-card hoverable class="category-card" @click="router.push('/parts?cat=' + cat.id)">
                <n-flex vertical align="center">
                  <div class="cat-icon" :style="{ background: cat.color }">
                    <n-icon :size="24" :component="cat.icon" color="white" />
                  </div>
                  <span class="cat-name">{{ cat.name }}</span>
                </n-flex>
              </n-card>
            </n-gi>
          </n-grid>
        </section>

        <section class="section-block">
          <n-card class="stats-banner" :bordered="false">
            <n-grid cols="1 m:3" responsive="screen">
              <n-gi>
                <n-statistic label="已收录零件" :value="1205">
                  <template #prefix><n-icon><HardwareChip /></n-icon></template>
                </n-statistic>
              </n-gi>
              <n-gi>
                <n-statistic label="兼容车型" :value="14">
                  <template #suffix>款</template>
                </n-statistic>
              </n-gi>
              <n-gi>
                <n-statistic label="最近更新" value="24小时内">
                  <template #prefix>🟢</template>
                </n-statistic>
              </n-gi>
            </n-grid>
          </n-card>
        </section>

      </main>

      <footer class="footer">
        <n-text depth="3">© 2024 RC Drift Parts Guide.</n-text>
        <n-divider vertical />
        <n-button text size="small">关于项目</n-button>
        <n-divider vertical />
        <n-button text size="small" tag="a" href="mailto:bairdweng@gmail.com">反馈问题</n-button>
      </footer>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from '#imports'
import { 
  GameControllerOutline, 
  Search, 
  LogoGithub, 
  CarSport, 
  HardwareChip, 
  Construct,
  Flash,
  Disc,
  Settings
} from '@vicons/ionicons5'


// --- Naive UI 主题配置 ---
const themeOverrides = {
  common: {
    primaryColor: '#2080f0',
    primaryColorHover: '#4098fc',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  Card: {
    borderRadius: '12px'
  }
}

// --- 逻辑部分 ---
const router = useRouter()
const searchQuery = ref('')
const showSuggestions = ref(false)
const isScrolled = ref(false)

// 模拟数据
const categories = [
  { name: '动力系统', id: 'power', icon: Flash, color: '#f5a623' },
  { name: '悬挂摆臂', id: 'suspension', icon: Construct, color: '#1890ff' },
  { name: '轮毂轮胎', id: 'wheels', icon: Disc, color: '#52c41a' },
  { name: '电子设备', id: 'electronics', icon: HardwareChip, color: '#722ed1' },
  { name: '车壳配件', id: 'body', icon: CarSport, color: '#eb2f96' },
  { name: '通用螺丝', id: 'screws', icon: Settings, color: '#595959' },
]

const searchSuggestions = ref([
  { id: 1, name: 'TT-02 Type-S', brand: 'Tamiya', category: 'Chassis' },
  { id: 2, name: 'YD-2 Z', brand: 'Yokomo', category: 'Chassis' },
  { id: 3, name: '54001 避震器', brand: 'Tamiya', category: 'Parts' }
])

// 滚动监听 (用于导航栏变色)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

// 交互方法
const handleInput = () => {
  showSuggestions.value = searchQuery.value.length > 0
}

const selectModel = (item: any) => {
  searchQuery.value = item.name
  showSuggestions.value = false
  performSearch()
}

const performSearch = () => {
  if (!searchQuery.value) return
  // 简单的路由逻辑
  if (searchQuery.value.toLowerCase().includes('tt')) {
    router.push('/parts/tamiya-tt-02')
  } else {
    console.log('Search:', searchQuery.value)
  }
}
</script>

<style scoped>
/* 全局容器 */
.rc-portal {
  min-height: 100vh;
  background-color: #f5f7fa;
  color: #333;
}

/* 1. 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  z-index: 100;
  transition: all 0.3s ease;
  background: transparent;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 24px;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 20px;
  color: #333;
}

.brand-text .highlight {
  color: #2080f0;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.nav-link {
  font-weight: 500;
  font-size: 15px;
}

/* 2. Hero 区域 (视觉中心) */
.hero-header {
  position: relative;
  height: 500px;
  background: #001529;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 40px;
}

/* 复杂的背景网格效果 */
.hero-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
}

.hero-container {
  position: relative;
  z-index: 10;
  width: 100%;
  padding: 0 20px;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 900;
  color: white;
  margin: 16px 0 8px;
  text-align: center;
  letter-spacing: -1px;
}

.sub-title {
  color: rgba(255,255,255,0.6);
  font-size: 1.1rem;
  margin-bottom: 40px;
  text-align: center;
}

/* 搜索框组件 */
.search-box-wrapper {
  position: relative;
  width: 100%;
  max-width: 680px;
}

.search-box {
  display: flex;
  background: white;
  padding: 6px;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.hero-input {
  flex: 1;
}

.hero-input :deep(.n-input__border),
.hero-input :deep(.n-input__state-border) {
  border: none !important;
  box-shadow: none !important;
}

.hero-btn {
  border-radius: 8px !important;
  font-weight: bold;
  padding: 0 32px;
}

/* 搜索下拉 */
.search-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  padding: 8px 0;
  z-index: 20;
}

.dropdown-label {
  padding: 8px 16px;
  font-size: 12px;
  color: #999;
}

.suggestion-cat {
  margin-left: 8px;
  color: #999;
  font-size: 12px;
}

/* 3. 内容区 */
.main-container {
  max-width: 1100px;
  margin: -60px auto 0; /* 负边距让内容重叠Hero */
  padding: 0 20px 60px;
  position: relative;
  z-index: 20;
}

.section-block {
  margin-bottom: 48px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

/* Chassis Tabs */
.chassis-tabs-card {
  border: none;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  overflow: hidden;
}

.tab-content {
  display: flex;
  flex-direction: column-reverse;
  gap: 20px;
  padding: 40px;
  background: white;
}

@media (min-width: 768px) {
  .tab-content {
    flex-direction: row;
    align-items: center;
  }
}

.tab-info {
  flex: 1;
}

.tab-info h3 {
  font-size: 24px;
  margin: 12px 0;
}

.tab-info p {
  color: #666;
  line-height: 1.6;
}

.tab-visual {
  flex: 1;
  height: 200px;
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 分类 Grid */
.category-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
  border: none;
  background: white;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
}

.cat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.cat-name {
  font-weight: 600;
  font-size: 14px;
}

/* 统计条 */
.stats-banner {
  background: #2080f0;
  color: white;
  border-radius: 16px;
}

.stats-banner :deep(.n-statistic__label) {
  color: rgba(255,255,255,0.8);
}
.stats-banner :deep(.n-statistic__value) {
  color: white;
}

/* 页脚 */
.footer {
  text-align: center;
  padding-bottom: 40px;
}

/* 响应式微调 */
@media (max-width: 600px) {
  .main-title { font-size: 2rem; }
  .nav-menu { display: none; }
  .search-box { padding: 4px; }
  .tab-content { padding: 20px; }
}

/* 动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>