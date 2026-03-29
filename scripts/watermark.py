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
MAX_SIZE = 1600
JPEG_QUALITY = 95
TILE_OPACITY = 35     # 0-255, subtle tiled layer for anti-removal
CENTER_OPACITY = 70   # 0-255, visible centered watermark as deterrent

# Cache for downloaded font
FONT_DIR = os.path.join(os.path.dirname(__file__), '.fonts')
NUNITO_PATH = os.path.join(FONT_DIR, 'Nunito-Regular.ttf')
NUNITO_URL = 'https://github.com/googlefonts/nunito/raw/main/fonts/variable/Nunito%5Bwght%5D.ttf'


def ensure_nunito():
    """Download Nunito font if not cached."""
    if os.path.exists(NUNITO_PATH):
        return NUNITO_PATH
    os.makedirs(FONT_DIR, exist_ok=True)
    print('Downloading Nunito font...')
    import urllib.request
    urllib.request.urlretrieve(NUNITO_URL, NUNITO_PATH)
    return NUNITO_PATH


def get_font(size):
    """Use Nunito to match site font, fall back to system rounded fonts."""
    try:
        return ImageFont.truetype(NUNITO_PATH, size)
    except (OSError, IOError):
        pass
    for path in ['/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf',
                 '/System/Library/Fonts/Supplemental/Avenir Next.ttc',
                 '/System/Library/Fonts/Helvetica.ttc']:
        try:
            return ImageFont.truetype(path, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def add_watermark(img):
    """Add subtle adaptive tiled watermark + visible centered watermark."""
    ref = max(img.width, img.height)
    tile_font_size = max(10, ref // 90)
    tile_font = get_font(tile_font_size)

    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    # --- Layer 1: Subtle adaptive tiled watermark (anti-removal) ---
    temp = ImageDraw.Draw(Image.new('RGBA', (1, 1)))
    bbox = temp.textbbox((0, 0), CENTER_TEXT, font=tile_font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    gap_x = tw * 2.5
    gap_y = th * 8

    diag = int((img.width ** 2 + img.height ** 2) ** 0.5) + 200
    white_tile = Image.new('RGBA', (diag, diag), (0, 0, 0, 0))
    black_tile = Image.new('RGBA', (diag, diag), (0, 0, 0, 0))
    wd = ImageDraw.Draw(white_tile)
    bd = ImageDraw.Draw(black_tile)

    y = 0
    row = 0
    while y < diag:
        x = int(-gap_x / 2) if row % 2 else 0
        while x < diag:
            wd.text((x + 1, y + 1), CENTER_TEXT, font=tile_font,
                    fill=(0, 0, 0, TILE_OPACITY // 3))
            wd.text((x, y), CENTER_TEXT, font=tile_font,
                    fill=(255, 255, 255, TILE_OPACITY))
            bd.text((x + 1, y + 1), CENTER_TEXT, font=tile_font,
                    fill=(255, 255, 255, TILE_OPACITY // 4))
            bd.text((x, y), CENTER_TEXT, font=tile_font,
                    fill=(0, 0, 0, TILE_OPACITY))
            x += int(gap_x)
        y += int(gap_y)
        row += 1

    white_tile = white_tile.rotate(35, resample=Image.BICUBIC, expand=False)
    black_tile = black_tile.rotate(35, resample=Image.BICUBIC, expand=False)
    crop_x = (white_tile.width - img.width) // 2
    crop_y = (white_tile.height - img.height) // 2
    white_tile = white_tile.crop((crop_x, crop_y, crop_x + img.width, crop_y + img.height))
    black_tile = black_tile.crop((crop_x, crop_y, crop_x + img.width, crop_y + img.height))

    blur_radius = max(20, ref // 40)
    mask = img.convert('L').filter(ImageFilter.GaussianBlur(blur_radius))
    adaptive_wm = Image.composite(black_tile, white_tile, mask)
    img = Image.alpha_composite(img, adaptive_wm)

    # --- Layer 2: Visible centered watermark (deterrent) ---
    center_size = max(14, ref // 50)
    center_font = get_font(center_size)
    center_layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    cd = ImageDraw.Draw(center_layer)

    bbox = cd.textbbox((0, 0), CENTER_TEXT, font=center_font)
    ctw, cth = bbox[2] - bbox[0], bbox[3] - bbox[1]
    cx = (img.width - ctw) // 2
    cy = (img.height - cth) // 2

    cd.text((cx + 1, cy + 1), CENTER_TEXT, font=center_font,
            fill=(0, 0, 0, CENTER_OPACITY // 2))
    cd.text((cx, cy), CENTER_TEXT, font=center_font,
            fill=(255, 255, 255, CENTER_OPACITY))

    img = Image.alpha_composite(img, center_layer)
    return img.convert('RGB')


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
    ensure_nunito()

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
