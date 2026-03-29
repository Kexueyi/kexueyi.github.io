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
CENTER_TEXT = '© Xueyi Ke'
BOTTOM_TEXT = '© 2026 Xueyi Ke. All rights reserved.'
MAX_SIZE = 1600
JPEG_QUALITY = 85
CENTER_OPACITY = 40   # 0-255, subtle centered watermark
BOTTOM_OPACITY = 110  # slightly more visible, like the old CSS rgba(255,255,255,0.5)


def get_font(size):
    """Try system fonts, fall back to default."""
    for path in ['/System/Library/Fonts/Helvetica.ttc',
                 '/System/Library/Fonts/SFNSMono.ttf']:
        try:
            return ImageFont.truetype(path, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def add_watermark(img):
    """Add centered watermark + bottom copyright line."""
    watermark = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(watermark)

    # --- Centered watermark ---
    center_size = max(16, img.width // 30)
    center_font = get_font(center_size)

    bbox = draw.textbbox((0, 0), CENTER_TEXT, font=center_font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    cx = (img.width - tw) // 2
    cy = (img.height - th) // 2

    draw.text((cx + 1, cy + 1), CENTER_TEXT, font=center_font,
              fill=(0, 0, 0, CENTER_OPACITY // 2))
    draw.text((cx, cy), CENTER_TEXT, font=center_font,
              fill=(255, 255, 255, CENTER_OPACITY))

    # --- Bottom copyright line ---
    bottom_size = max(11, img.width // 80)
    bottom_font = get_font(bottom_size)

    bbox = draw.textbbox((0, 0), BOTTOM_TEXT, font=bottom_font)
    bw, bh = bbox[2] - bbox[0], bbox[3] - bbox[1]
    bx = (img.width - bw) // 2
    by = img.height - bh - max(8, img.height // 80)

    draw.text((bx + 1, by + 1), BOTTOM_TEXT, font=bottom_font,
              fill=(0, 0, 0, BOTTOM_OPACITY // 2))
    draw.text((bx, by), BOTTOM_TEXT, font=bottom_font,
              fill=(255, 255, 255, BOTTOM_OPACITY))

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
