#!/usr/bin/env python3
"""
Burn watermark into gallery images.
Usage: python3 watermark.py

- Reads from images/gallery_original/ (untouched originals)
- Writes watermarked + resized images to images/gallery/
- Watermark: "© Xueyi Ke" centered, semi-transparent white with shadow
- Max dimension: 1600px, JPEG quality 85
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ORIGINAL_DIR = os.path.join(os.path.dirname(__file__), '..', 'images', 'gallery_original')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'images', 'gallery')
WATERMARK_TEXT = '© Xueyi Ke'
MAX_SIZE = 1600
JPEG_QUALITY = 85
OPACITY = 40  # 0-255, lower = more subtle


def add_watermark(img):
    """Add centered semi-transparent watermark with shadow."""
    watermark = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(watermark)

    # Scale font size relative to image width
    font_size = max(16, img.width // 30)
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', font_size)
    except (OSError, IOError):
        try:
            font = ImageFont.truetype('/System/Library/Fonts/SFNSMono.ttf', font_size)
        except (OSError, IOError):
            font = ImageFont.load_default()

    # Get text bounding box
    bbox = draw.textbbox((0, 0), WATERMARK_TEXT, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (img.width - text_w) // 2
    y = (img.height - text_h) // 2

    # Draw shadow
    draw.text((x + 1, y + 1), WATERMARK_TEXT, font=font, fill=(0, 0, 0, OPACITY // 2))
    # Draw watermark text
    draw.text((x, y), WATERMARK_TEXT, font=font, fill=(255, 255, 255, OPACITY))

    # Composite
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    watermarked = Image.alpha_composite(img, watermark)
    return watermarked.convert('RGB')


def process_image(filename):
    """Resize and watermark a single image."""
    src = os.path.join(ORIGINAL_DIR, filename)
    dst = os.path.join(OUTPUT_DIR, filename)

    img = Image.open(src)

    # Preserve EXIF orientation
    try:
        from PIL import ImageOps
        img = ImageOps.exif_transpose(img)
    except Exception:
        pass

    # Resize if larger than MAX_SIZE
    if max(img.width, img.height) > MAX_SIZE:
        img.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)

    # Add watermark
    img = add_watermark(img)

    # Determine output format
    ext = os.path.splitext(filename)[1].lower()
    if ext in ('.jpg', '.jpeg'):
        img.save(dst, 'JPEG', quality=JPEG_QUALITY, optimize=True)
    elif ext == '.png':
        img.save(dst, 'PNG', optimize=True)
    else:
        img.save(dst, 'JPEG', quality=JPEG_QUALITY, optimize=True)

    src_size = os.path.getsize(src) / 1024
    dst_size = os.path.getsize(dst) / 1024
    print(f'  {filename}: {src_size:.0f}KB → {dst_size:.0f}KB')


def main():
    if not os.path.exists(ORIGINAL_DIR):
        print(f'Error: {ORIGINAL_DIR} not found. Put originals there first.')
        return

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    all_files = [f for f in os.listdir(ORIGINAL_DIR)
                 if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

    # Only process images that don't already exist in output
    new_files = [f for f in all_files
                 if not os.path.exists(os.path.join(OUTPUT_DIR, f))]

    if not new_files:
        print('No new images to process. All originals already have watermarked versions.')
        print('Tip: delete an image from images/gallery/ to re-process it.')
        return

    print(f'Found {len(new_files)} new images (skipping {len(all_files) - len(new_files)} existing)...\n')

    for f in sorted(new_files):
        process_image(f)

    print(f'\nDone! Watermarked images saved to {OUTPUT_DIR}')


if __name__ == '__main__':
    main()
