#!/usr/bin/env python3
"""
Image optimization script for the website
This script will compress images to reduce file sizes while maintaining quality
"""

import os
from PIL import Image
import shutil

def optimize_image(input_path, output_path, quality=85, max_width=1200):
    """
    Optimize an image by reducing quality and resizing if necessary
    """
    with Image.open(input_path) as img:
        # Convert to RGB if necessary (for JPEG)
        if img.mode in ('RGBA', 'LA', 'P'):
            # Create a white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Resize if too wide
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        
        # Save with optimization
        if output_path.lower().endswith('.jpg') or output_path.lower().endswith('.jpeg'):
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
        else:
            img.save(output_path, 'PNG', optimize=True)

def main():
    images_dir = "static/images"
    backup_dir = "static/images_backup"
    
    # Create backup directory
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        print(f"Created backup directory: {backup_dir}")
    
    # List of images to optimize with their target sizes
    optimizations = {
        "neuron_classifier.jpg": {"quality": 80, "max_width": 1000},
        "AoA.jpg": {"quality": 85, "max_width": 800},
        "bio_infant.png": {"quality": 85, "max_width": 600},
        "comp_model.png": {"quality": 85, "max_width": 600},
        "net-dissection.png": {"quality": 85, "max_width": 800},
        "clip-dissect.png": {"quality": 85, "max_width": 600},
        "iv_oov.png": {"quality": 85, "max_width": 600},
        "cka.png": {"quality": 85, "max_width": 800},
        "resutls_table.png": {"quality": 85, "max_width": 800}
    }
    
    for filename, settings in optimizations.items():
        input_path = os.path.join(images_dir, filename)
        backup_path = os.path.join(backup_dir, filename)
        
        if os.path.exists(input_path):
            # Create backup
            shutil.copy2(input_path, backup_path)
            print(f"Backed up: {filename}")
            
            # Get original size
            original_size = os.path.getsize(input_path)
            
            # Optimize
            optimize_image(input_path, input_path, 
                         quality=settings["quality"], 
                         max_width=settings["max_width"])
            
            # Get new size
            new_size = os.path.getsize(input_path)
            reduction = ((original_size - new_size) / original_size) * 100
            
            print(f"Optimized {filename}: {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB ({reduction:.1f}% reduction)")
        else:
            print(f"File not found: {input_path}")

if __name__ == "__main__":
    main()
