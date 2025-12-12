<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <n-h1 class="text-center mb-8">
        <n-gradient-text type="info">
          Naive UI + Vue 3 测试页面
        </n-gradient-text>
      </n-h1>
      
      <!-- 卡片网格 -->
      <n-grid :cols="3" :x-gap="16" :y-gap="16">
        <!-- 按钮测试 -->
        <n-gi>
          <n-card title="按钮组件" hoverable>
            <n-space vertical>
              <n-button type="primary">主要按钮</n-button>
              <n-button type="info">信息按钮</n-button>
              <n-button type="success">成功按钮</n-button>
              <n-button type="warning">警告按钮</n-button>
              <n-button type="error">错误按钮</n-button>
            </n-space>
          </n-card>
        </n-gi>
        
        <!-- 输入框测试 -->
        <n-gi>
          <n-card title="表单组件" hoverable>
            <n-space vertical>
              <n-input v-model:value="inputValue" placeholder="请输入内容" />
              <n-input-number v-model:value="numberValue" placeholder="请输入数字" />
              <n-select v-model:value="selectValue" :options="options" placeholder="请选择" />
            </n-space>
          </n-card>
        </n-gi>
        
        <!-- 消息提示测试 -->
        <n-gi>
          <n-card title="反馈组件" hoverable>
            <n-space vertical>
              <n-button @click="showSuccess">成功提示</n-button>
              <n-button @click="showWarning">警告提示</n-button>
              <n-button @click="showError">错误提示</n-button>
              <n-button @click="showInfo">信息提示</n-button>
            </n-space>
          </n-card>
        </n-gi>
      </n-grid>
      
      <!-- 数据表格测试 -->
      <n-card title="数据表格" class="mt-8" hoverable>
        <n-data-table
          :columns="columns"
          :data="data"
          :pagination="pagination"
        />
      </n-card>
      
      <!-- 进度条测试 -->
      <n-card title="进度指示器" class="mt-8" hoverable>
        <n-space vertical>
          <n-progress type="line" :percentage="percentage" />
          <n-progress type="circle" :percentage="percentage" />
          <n-slider v-model:value="percentage" :step="10" />
        </n-space>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { NButton, useMessage } from 'naive-ui'

// 响应式数据
const inputValue = ref('')
const numberValue = ref(0)
const selectValue = ref(null)
const percentage = ref(50)

// 消息提示
const message = useMessage()

const showSuccess = () => {
  message.success('这是一个成功提示')
}

const showWarning = () => {
  message.warning('这是一个警告提示')
}

const showError = () => {
  message.error('这是一个错误提示')
}

const showInfo = () => {
  message.info('这是一个信息提示')
}

// 选择框选项
const options = [
  {
    label: '选项1',
    value: 'option1'
  },
  {
    label: '选项2',
    value: 'option2'
  },
  {
    label: '选项3',
    value: 'option3'
  }
]

// 表格列定义
const columns = [
  {
    title: '零件名称',
    key: 'name'
  },
  {
    title: '价格',
    key: 'price'
  },
  {
    title: '库存',
    key: 'stock'
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(
        NButton,
        {
          size: 'small',
          onClick: () => message.info(`点击了 ${row.name}`)
        },
        { default: () => '查看' }
      )
    }
  }
]

// 表格数据
const data = [
  {
    key: 1,
    name: '漂移轮胎',
    price: '¥89',
    stock: '有货'
  },
  {
    key: 2,
    name: '转向套件',
    price: '¥156',
    stock: '有货'
  },
  {
    key: 3,
    name: '避震器',
    price: '¥238',
    stock: '缺货'
  }
]

// 分页配置
const pagination = {
  pageSize: 10
}
</script>

<style scoped>
/* 自定义样式 */
.n-card {
  border-radius: 12px;
}

.n-button {
  border-radius: 6px;
}
</style>