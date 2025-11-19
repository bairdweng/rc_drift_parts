#!/usr/bin/env python3
"""
图片转WebP格式转换脚本
用于将PNG/JPG图片转换为更高效的WebP格式
"""

import os
import sys
from PIL import Image
import argparse
from pathlib import Path

def convert_to_webp(input_path, output_path, quality=75, lossless=False):
    """
    将图片转换为WebP格式
    
    Args:
        input_path: 输入图片路径
        output_path: 输出图片路径
        quality: WebP质量 (0-100)
        lossless: 是否使用无损压缩
    """
    try:
        with Image.open(input_path) as img:
            # 如果是PNG且有透明度，保持RGBA模式
            if img.format == 'PNG' and img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                img = img.convert('RGBA')
            else:
                img = img.convert('RGB')
            
            img.save(output_path, 'WEBP', quality=quality, method=6)
            return True
    except Exception as e:
        print(f"✗ 转换失败 {input_path}: {e}")
        return False

def get_file_size(file_path):
    """获取文件大小（KB）"""
    return os.path.getsize(file_path) / 1024

def convert_images_to_webp(directory, quality=75, backup=True):
    """
    将目录下的图片转换为WebP格式
    
    Args:
        directory: 目标目录
        quality: WebP质量
        backup: 是否备份原文件
    """
    # 创建备份目录
    if backup:
        backup_dir = Path(directory) / 'backup_original'
        backup_dir.mkdir(exist_ok=True)
    
    total_files = 0
    total_saved = 0
    processed_files = []
    
    # 支持的图片格式
    supported_formats = {'.png', '.jpg', '.jpeg'}
    
    # 遍历目录
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = Path(root) / file
            
            # 跳过备份目录和WebP文件
            if 'backup' in str(file_path) or file_path.suffix.lower() == '.webp':
                continue
            
            # 只处理支持的图片格式
            if file_path.suffix.lower() in supported_formats:
                total_files += 1
                original_size = get_file_size(file_path)
                
                # 生成WebP文件名
                webp_path = file_path.with_suffix('.webp')
                
                # 备份原文件
                if backup:
                    backup_path = backup_dir / file_path.relative_to(directory)
                    backup_path.parent.mkdir(parents=True, exist_ok=True)
                    os.rename(file_path, backup_path)
                    input_file = backup_path
                else:
                    input_file = file_path
                
                # 转换为WebP
                if convert_to_webp(input_file, webp_path, quality=quality):
                    
                    compressed_size = get_file_size(webp_path)
                    saved = original_size - compressed_size
                    total_saved += saved
                    
                    processed_files.append({
                        'file': str(file_path.relative_to(directory)),
                        'original_size': round(original_size, 2),
                        'compressed_size': round(compressed_size, 2),
                        'saved': round(saved, 2),
                        'reduction': round((saved / original_size) * 100, 2)
                    })
                    
                    print(f"✓ {file_path.relative_to(directory)}: "
                          f"{original_size:.1f}KB → {compressed_size:.1f}KB "
                          f"(节省 {saved:.1f}KB, {processed_files[-1]['reduction']}%)")
                    
                    # 删除原文件（如果不需要保留）
                    if not backup:
                        os.remove(file_path)
                else:
                    # 转换失败，恢复备份
                    if backup:
                        os.rename(backup_path, file_path)
    
    return processed_files, total_saved, total_files

def main():
    parser = argparse.ArgumentParser(description='PNG转WebP格式转换脚本')
    parser.add_argument('--directory', '-d', 
                       default='static/image/articles',
                       help='要转换的图片目录 (默认: static/image/articles)')
    parser.add_argument('--quality', '-q', 
                       type=int, default=75,
                       help='WebP质量 (0-100, 默认: 75)')
    parser.add_argument('--no-backup', 
                       action='store_true',
                       help='不备份原PNG文件')
    
    args = parser.parse_args()
    
    # 检查目录是否存在
    if not os.path.exists(args.directory):
        print(f"错误: 目录 {args.directory} 不存在")
        sys.exit(1)
    
    print(f"开始转换目录: {args.directory}")
    print(f"WebP质量: {args.quality}")
    print(f"备份原文件: {not args.no_backup}")
    print("-" * 60)
    
    # 执行转换
    processed_files, total_saved, total_files = convert_images_to_webp(
        args.directory,
        quality=args.quality,
        backup=not args.no_backup
    )
    
    print("-" * 60)
    print(f"转换完成!")
    print(f"总共转换文件: {len(processed_files)}/{total_files}")
    print(f"总共节省空间: {total_saved:.2f}KB")
    
    # 显示转换效果最好的文件
    if processed_files:
        print("\n转换效果最好的文件:")
        best_files = sorted(processed_files, key=lambda x: x['reduction'], reverse=True)[:5]
        for file_info in best_files:
            print(f"  {file_info['file']}: {file_info['reduction']}% 节省")

if __name__ == "__main__":
    main()