<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- 导航栏 -->
    <nav class="bg-blue-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <span class="text-xl font-bold">RC Drift Parts</span>
          </div>
          <div class="flex items-center space-x-4">
            <button class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              首页
            </button>
            <button class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              零件搜索
            </button>
            <button class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              技术文章
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto mt-8">
      <!-- 搜索框 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center space-x-4">
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="搜索零件或型号..." 
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            搜索
          </button>
        </div>
      </div>

      <!-- 零件卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="h-48 bg-gray-200 flex items-center justify-center">
            <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-gray-900">转向控制套件 {{ i }}</h3>
              <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">有货</span>
            </div>
            <p class="text-gray-600 text-sm mb-4">适用于Tamiya TT-02的高性能转向升级</p>
            <div class="flex justify-between items-center">
              <span class="text-blue-600 font-bold">¥128.00</span>
              <button class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-blue-600">24</div>
          <div class="text-gray-600">技术文章</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-green-600">9</div>
          <div class="text-gray-600">零件型号</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl font-bold text-purple-600">9</div>
          <div class="text-gray-600">关联文章</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'TailwindTest'
}
</script>

<style>
/* 无需额外CSS，所有样式通过Tailwind类实现 */
</style>