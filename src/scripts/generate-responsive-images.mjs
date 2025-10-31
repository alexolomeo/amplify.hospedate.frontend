/* eslint-env node */
/**
 * Script to generate responsive image sizes
 * Run this script to create multiple sizes of images for srcset
 *
 * Usage:
 *   node scripts/generate-responsive-images.mjs [image-path]
 *   node scripts/generate-responsive-images.mjs public/images/hero.webp
 *
 * Or generate all:
 *   node scripts/generate-responsive-images.mjs --all
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default sizes to generate
const DEFAULT_SIZES = [320, 640, 1024, 1920];

// Check if sharp is available
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error(
    '\n⚠️  sharp is not installed. Please run: npm install -D sharp\n'
  );
  process.exit(1);
}

/**
 * Generate responsive versions of an image
 */
async function generateResponsiveImages(imagePath, sizes = DEFAULT_SIZES) {
  if (!fs.existsSync(imagePath)) {
    console.error(`Error: File not found: ${imagePath}`);
    return;
  }

  const ext = path.extname(imagePath);
  const baseName = path.basename(imagePath, ext);
  const dir = path.dirname(imagePath);

  console.log(`\n📸 Processing: ${baseName}${ext}`);

  // Get original image metadata
  const metadata = await sharp(imagePath).metadata();
  console.log(
    `   Original size: ${metadata.width}x${metadata.height} (${Math.round(fs.statSync(imagePath).size / 1024)}KB)`
  );

  for (const width of sizes) {
    // Skip if size is larger than original
    if (metadata.width && width > metadata.width) {
      console.log(`   ⏭️  Skipping ${width}w (larger than original)`);
      continue;
    }

    const outputPath = path.join(dir, `${baseName}-${width}w${ext}`);

    // Skip if file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`   ⏭️  Skipping ${width}w (already exists)`);
      continue;
    }

    try {
      await sharp(imagePath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({ quality: 85 })
        .toFile(outputPath);

      const size = Math.round(fs.statSync(outputPath).size / 1024);
      console.log(`   ✅ Generated ${width}w (${size}KB)`);
    } catch (error) {
      console.error(`   ❌ Error generating ${width}w:`, error.message);
    }
  }
}

/**
 * Generate blur placeholder
 */
async function generateBlurPlaceholder(imagePath) {
  const ext = path.extname(imagePath);
  const baseName = path.basename(imagePath, ext);
  const dir = path.dirname(imagePath);

  const placeholderPath = path.join(dir, `${baseName}-blur${ext}`);

  try {
    await sharp(imagePath)
      .resize(20, 20, {
        fit: 'inside',
      })
      .blur(10)
      .webp({ quality: 20 })
      .toFile(placeholderPath);

    console.log(`   ✅ Generated blur placeholder`);
  } catch (error) {
    console.error(`   ❌ Error generating blur placeholder:`, error.message);
  }
}

/**
 * Process all images in a directory
 */
async function processDirectory(dir, recursive = false) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && recursive) {
      await processDirectory(filePath, recursive);
    } else if (
      stat.isFile() &&
      /\.(webp|jpg|jpeg|png)$/i.test(file) &&
      !/-\d+w\.(webp|jpg|jpeg|png)$/i.test(file) && // Skip already generated sizes
      !/-blur\.(webp|jpg|jpeg|png)$/i.test(file) // Skip blur placeholders
    ) {
      await generateResponsiveImages(filePath);
      await generateBlurPlaceholder(filePath);
    }
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help') {
  console.log(`
Usage:
  node scripts/generate-responsive-images.mjs [image-path]
  node scripts/generate-responsive-images.mjs --all

Examples:
  node scripts/generate-responsive-images.mjs public/images/hero.webp
  node scripts/generate-responsive-images.mjs --all
  `);
  process.exit(0);
}

if (args[0] === '--all') {
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  console.log(`\n🚀 Processing all images in: ${imagesDir}\n`);
  await processDirectory(imagesDir, true);
  console.log('\n✨ Done!\n');
} else {
  const imagePath = path.resolve(args[0]);
  await generateResponsiveImages(imagePath);
  await generateBlurPlaceholder(imagePath);
  console.log('\n✨ Done!\n');
}
