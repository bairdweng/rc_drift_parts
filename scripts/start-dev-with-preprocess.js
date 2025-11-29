#!/usr/bin/env node

/**
 * 开发环境启动脚本
 * 同时启动预处理监听和Nuxt开发服务器
 */

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🚀 启动开发环境...')
console.log('📝 正在启动预处理监听...')

// 启动预处理监听
const preprocessProcess = spawn('node', ['scripts/preprocess-articles.js', '--watch'], {
  stdio: 'inherit',
  cwd: process.cwd()
})

// 等待预处理监听启动
setTimeout(() => {
  console.log('🌐 启动Nuxt开发服务器...')
  
  // 启动Nuxt开发服务器
  const nuxtProcess = spawn('npx', ['nuxt', 'dev'], {
    stdio: 'inherit',
    cwd: process.cwd()
  })
  
  // 处理进程退出
  nuxtProcess.on('close', (code) => {
    console.log(`❌ Nuxt开发服务器退出，代码: ${code}`)
    preprocessProcess.kill()
    process.exit(code)
  })
  
  preprocessProcess.on('close', (code) => {
    console.log(`❌ 预处理监听退出，代码: ${code}`)
    nuxtProcess.kill()
    process.exit(code)
  })
  
  // 处理Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭开发环境...')
    preprocessProcess.kill()
    nuxtProcess.kill()
    process.exit(0)
  })
  
}, 2000) // 等待2秒让预处理监听启动