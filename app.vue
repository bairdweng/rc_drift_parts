<template>
  <n-config-provider>
    <n-message-provider>
      <n-dialog-provider>
        <!-- Nuxt 4 使用 NuxtPage 组件渲染页面 -->
        <NuxtPage />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
// 在Nuxt 4中，app.vue是根组件
// 导入Naive UI组件
import { NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui'
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#__nuxt {
  min-height: 100vh;
}
</style>