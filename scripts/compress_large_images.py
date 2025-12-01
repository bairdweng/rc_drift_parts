#!/usr/bin/env python3
"""
专门压缩大图片文件的脚本
针对超过200KB的图片进行更激进的压缩
"""

import os
import sys
from PIL import Image
from pathlib import Path

def compress_large_images(directory, max_size_kb=200, quality=60):
    """
    压缩指定目录下超过指定大小的图片
    
    Args:
        directory: 目标目录
        max_size_kb: 最大文件大小阈值（KB）
        quality: 压缩质量 (0-100)
    """
    supported_formats = {'.jpg', '.jpeg', '.png', '.webp'}
    
    print(f"搜索目录: {directory}")
    print(f"目标文件: 大于 {max_size_kb}KB 的图片")
    print(f"压缩质量: {quality}")
    print("-" * 60)
    
    large_files = []
    total_saved = 0
    
    # 查找大文件
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = Path(root) / file
            file_ext = file_path.suffix.lower()
            
            # 跳过备份目录
            if 'backup' in str(file_path):
                continue
            
            # 检查文件格式
            if file_ext in supported_formats:
                file_size_kb = os.path.getsize(file_path) / 1024
                
                if file_size_kb > max_size_kb:
                    large_files.append((file_path, file_size_kb))
    
    if not large_files:
        print("未找到超过指定大小的图片文件")
        return
    
    print(f"找到 {len(large_files)} 个超过 {max_size_kb}KB 的图片文件:")
    for file_path, size_kb in large_files:
        print(f"  - {file_path.relative_to(directory)}: {size_kb:.1f}KB")
    
    print("-" * 60)
    print("开始压缩...")
    
    # 压缩大文件
    for file_path, original_size in large_files:
        try:
            # 创建临时文件
            temp_path = file_path.with_suffix('.temp' + file_path.suffix)
            
            # 压缩图片
            with Image.open(file_path) as img:
                format = img.format
                
                if format.upper() in ['PNG', 'WEBP']:
                    img.save(temp_path, format=format, optimize=True, quality=quality)
                else:
                    img.save(temp_path, format=format, quality=quality, optimize=True)
            
            # 获取压缩后大小
            compressed_size = os.path.getsize(temp_path) / 1024
            saved = original_size - compressed_size
            reduction = (saved / original_size) * 100
            
            # 替换原文件
            os.replace(temp_path, file_path)
            
            total_saved += saved
            
            print(f"✓ {file_path.relative_to(directory)}: "
                  f"{original_size:.1f}KB → {compressed_size:.1f}KB "
                  f"(节省 {saved:.1f}KB, {reduction:.2f}%)")
            
        except Exception as e:
            print(f"✗ 压缩失败 {file_path.relative_to(directory)}: {e}")
            # 删除临时文件
            if temp_path.exists():
                temp_path.unlink()
    
    print("-" * 60)
    print(f"压缩完成!")
    print(f"总共处理文件: {len(large_files)}")
    print(f"总共节省空间: {total_saved:.2f}KB")

def main():
    """主函数"""
    directory = 'static/image'
    max_size_kb = 200  # 超过200KB的文件
    quality = 60       # 更激进的压缩质量
    
    # 检查目录是否存在
    if not os.path.exists(directory):
        print(f"错误: 目录 {directory} 不存在")
        sys.exit(1)
    
    compress_large_images(directory, max_size_kb, quality)

if __name__ == "__main__":
    main()