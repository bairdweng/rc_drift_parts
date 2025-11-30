#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Nuxt.js 缓存清理脚本
 * 自动清理 .nuxt 和 .hardsource 缓存目录
 */

const cacheDirs = [
  '.nuxt',
  '.hardsource'
];

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
    console.log(`✅ 已删除目录: ${folderPath}`);
  } else {
    console.log(`ℹ️  目录不存在: ${folderPath}`);
  }
}

function cleanCache() {
  console.log('🧹 开始清理 Nuxt.js 缓存...\n');
  
  let cleanedCount = 0;
  
  cacheDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      deleteFolderRecursive(dir);
      cleanedCount++;
    }
  });
  
  console.log(`\n🎉 缓存清理完成！共清理了 ${cleanedCount} 个缓存目录`);
  console.log('💡 现在可以运行: npm run dev 重新启动开发服务器');
}

// 执行清理
cleanCache();