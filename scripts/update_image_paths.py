#!/usr/bin/env python3
"""
更新图片路径脚本
用于将数据文件中的JPG路径更新为WebP路径
"""

import json
import re
from pathlib import Path

def update_image_paths_in_file(file_path):
    """更新文件中的图片路径"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 使用正则表达式替换所有.jpg为.webp
        updated_content = re.sub(r'\.jpg"', '.webp"', content)
        
        # 检查是否有变化
        if content != updated_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            
            # 统计替换的数量
            changes = len(re.findall(r'\.jpg"', content)) - len(re.findall(r'\.jpg"', updated_content))
            return changes
        else:
            return 0
            
    except Exception as e:
        print(f"✗ 更新文件失败 {file_path}: {e}")
        return 0

def main():
    # 需要更新的数据文件
    data_files = [
        "data/parts/tamiya-tt-02-parts.json",
        "data/models/tamiya-tt-02.json"
    ]
    
    total_changes = 0
    
    for file_path in data_files:
        if Path(file_path).exists():
            changes = update_image_paths_in_file(file_path)
            total_changes += changes
            if changes > 0:
                print(f"✓ {file_path}: 更新了 {changes} 个图片路径")
        else:
            print(f"⚠ {file_path}: 文件不存在")
    
    print(f"\n总共更新了 {total_changes} 个图片路径")

if __name__ == "__main__":
    main()