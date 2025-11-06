# PWA Icons Setup

## Required Icon Sizes

For a complete PWA experience, you need the following icon sizes:

- **192x192** - Standard Android home screen icon
- **512x512** - High-res Android splash screen and Chrome Web Store

## Current Icons

The project currently has placeholder SVG icons. For production, you should:

1. **Create PNG versions** of the icons:
   - Use a tool like [Figma](https://figma.com), [Canva](https://canva.com), or [ImageMagick](https://imagemagick.org/)
   - Export as PNG with transparent background
   - Sizes: 192x192px and 512x512px

2. **Icon Design Guidelines**:
   - Use the brand colors: Primary #059669, Accent #047857
   - Include a recognizable symbol (mountain, tree, route)
   - Ensure good contrast for visibility
   - Test on both light and dark backgrounds
   - Keep it simple - icons are small

3. **Maskable Icons**:
   - Create a "maskable" version with 20% safe zone padding
   - This ensures the icon looks good on all Android devices
   - Use [Maskable.app](https://maskable.app) to test

## Quick Icon Generation

### Option 1: Use an Online Tool
- [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
- [Real Favicon Generator](https://realfavicongenerator.net/)

### Option 2: Use ImageMagick (CLI)
```bash
# Convert SVG to PNG (requires ImageMagick)
magick icon-192x192.svg icon-192x192.png
magick icon-512x512.svg icon-512x512.png
```

### Option 3: Use Figma/Canva
1. Create a 512x512px frame
2. Design your icon with ROOTSnROUTES branding
3. Export as PNG at 1x (512x512) and 0.375x (192x192)

## Testing Your Icons

1. **Local Testing**:
   - Run `npm run dev`
   - Open Chrome DevTools > Application > Manifest
   - Check if icons load correctly

2. **Maskable Testing**:
   - Visit [Maskable.app](https://maskable.app)
   - Upload your 512x512 icon
   - Adjust safe zone if needed

3. **Installation Testing**:
   - Deploy to Vercel
   - Install PWA on mobile device
   - Check home screen icon appearance

## Current Setup

The project uses:
- `icon-192x192.svg` - Placeholder small icon
- `icon-512x512.svg` - Placeholder large icon
- `apple-touch-icon.png` - iOS home screen (180x180)
- `favicon.svg` - Browser favicon

Replace the SVG files with proper PNG files for production.
