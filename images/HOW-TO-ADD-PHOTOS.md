# Adding New Gallery Photos

## Steps

1. **Put originals** into `images/gallery_original/`

2. **Run watermark script**
   ```bash
   python3 scripts/watermark.py
   ```
   Only new images are processed (existing ones are skipped). Output goes to `images/gallery/`.

3. **Register in gallery** — add an entry to the `images` array in `js/gallery.js`:
   ```js
   { src: 'images/gallery/YOUR_FILE.jpg', title: 'Title', location: 'Location' },
   ```

4. **Commit & push**

## Notes

- Supported formats: `.jpg`, `.jpeg`, `.png`
- Images are auto-resized to max 1600px and compressed (JPEG quality 85)
- To re-process an image, delete it from `images/gallery/` and re-run the script
- `images/gallery_original/` contains untouched originals — do not delete them
