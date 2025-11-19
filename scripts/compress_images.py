#!/usr/bin/env python3
"""
图片批量压缩脚本
用于压缩 static/image/ 目录下的图片文件
支持 JPG, PNG, WebP 格式
"""

import os
import sys
from PIL import Image
import argparse
from pathlib import Path

def compress_image(input_path, output_path, quality=85, optimize=True, format=None):
    """
    压缩单张图片
    
    Args:
        input_path: 输入图片路径
        output_path: 输出图片路径
        quality: 压缩质量 (0-100)
        optimize: 是否优化
        format: 输出格式 (None 表示保持原格式)
    """
    try:
        with Image.open(input_path) as img:
            # 获取图片格式
            if format is None:
                format = img.format
            
            # 如果是 PNG 格式，使用 optimize 参数
            if format.upper() in ['PNG', 'WEBP']:
                img.save(output_path, format=format, optimize=optimize, quality=quality)
            else:
                # JPG 格式使用 quality 参数
                img.save(output_path, format=format, quality=quality, optimize=optimize)
            
            return True
    except Exception as e:
        print(f"压缩失败 {input_path}: {e}")
        return False

def get_file_size(file_path):
    """获取文件大小（KB）"""
    return os.path.getsize(file_path) / 1024

def compress_images_in_directory(directory, quality=85, backup=True, recursive=True):
    """
    压缩目录下的所有图片
    
    Args:
        directory: 目标目录
        quality: 压缩质量
        backup: 是否备份原文件
        recursive: 是否递归处理子目录
    """
    supported_formats = {'.jpg', '.jpeg', '.png', '.webp'}
    
    # 创建备份目录
    if backup:
        backup_dir = Path(directory) / 'backup'
        backup_dir.mkdir(exist_ok=True)
    
    total_files = 0
    total_saved = 0
    processed_files = []
    
    # 遍历目录
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = Path(root) / file
            file_ext = file_path.suffix.lower()
            
            # 跳过备份目录
            if 'backup' in str(file_path):
                continue
            
            # 检查文件格式
            if file_ext in supported_formats:
                total_files += 1
                original_size = get_file_size(file_path)
                
                # 备份原文件
                if backup:
                    backup_path = backup_dir / file_path.relative_to(directory)
                    backup_path.parent.mkdir(parents=True, exist_ok=True)
                    os.rename(file_path, backup_path)
                    temp_path = file_path
                else:
                    temp_path = file_path.with_suffix('.temp' + file_ext)
                
                # 压缩图片
                if compress_image(backup_path if backup else file_path, 
                                temp_path if not backup else file_path, 
                                quality=quality):
                    
                    compressed_size = get_file_size(temp_path if not backup else file_path)
                    
                    if not backup:
                        os.replace(temp_path, file_path)
                    
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
                else:
                    # 压缩失败，恢复备份
                    if backup:
                        os.rename(backup_path, file_path)
        
        # 如果不递归处理子目录，则退出
        if not recursive:
            break
    
    return processed_files, total_saved, total_files

def main():
    parser = argparse.ArgumentParser(description='批量压缩图片脚本')
    parser.add_argument('--directory', '-d', 
                       default='static/image',
                       help='要压缩的图片目录 (默认: static/image)')
    parser.add_argument('--quality', '-q', 
                       type=int, default=85,
                       help='压缩质量 (0-100, 默认: 85)')
    parser.add_argument('--no-backup', 
                       action='store_true',
                       help='不备份原文件')
    parser.add_argument('--no-recursive', 
                       action='store_true',
                       help='不递归处理子目录')
    
    args = parser.parse_args()
    
    # 检查目录是否存在
    if not os.path.exists(args.directory):
        print(f"错误: 目录 {args.directory} 不存在")
        sys.exit(1)
    
    print(f"开始压缩目录: {args.directory}")
    print(f"压缩质量: {args.quality}")
    print(f"备份原文件: {not args.no_backup}")
    print(f"递归处理: {not args.no_recursive}")
    print("-" * 60)
    
    # 执行压缩
    processed_files, total_saved, total_files = compress_images_in_directory(
        args.directory,
        quality=args.quality,
        backup=not args.no_backup,
        recursive=not args.no_recursive
    )
    
    print("-" * 60)
    print(f"处理完成!")
    print(f"总共处理文件: {len(processed_files)}/{total_files}")
    print(f"总共节省空间: {total_saved:.2f}KB")
    
    # 显示压缩效果最好的文件
    if processed_files:
        print("\n压缩效果最好的文件:")
        best_files = sorted(processed_files, key=lambda x: x['reduction'], reverse=True)[:5]
        for file_info in best_files:
            print(f"  {file_info['file']}: {file_info['reduction']}% 节省")

if __name__ == "__main__":
    main()