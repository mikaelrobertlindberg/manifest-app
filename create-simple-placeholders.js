#!/usr/bin/env node
/**
 * SIMPLE PLACEHOLDER GENERATOR
 * Creates basic PNG placeholders without external dependencies
 */

const fs = require('fs');
const path = require('path');

function createSimplePNG(width, height, color, filename) {
  // Create a simple PNG file programmatically
  // This creates a minimal PNG with solid color
  
  const header = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,  // PNG signature
    0x00, 0x00, 0x00, 0x0D,                            // IHDR chunk size
    0x49, 0x48, 0x44, 0x52,                            // IHDR
    0x00, 0x00, 0x01, 0x00,                            // Width: 256
    0x00, 0x00, 0x01, 0x00,                            // Height: 256  
    0x08, 0x02, 0x00, 0x00, 0x00,                      // Bit depth, color type, etc.
    0x90, 0x91, 0x68, 0x36                             // CRC
  ]);
  
  // Simple colored square data
  const data = Buffer.alloc(width * height * 3); // RGB data
  
  // Parse hex color
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Fill with color
  for (let i = 0; i < data.length; i += 3) {
    data[i] = r;     // Red
    data[i + 1] = g; // Green  
    data[i + 2] = b; // Blue
  }
  
  // For simplicity, just create a basic colored file
  // In practice, we'd need proper PNG encoding
  
  // Instead, create SVG which is simpler and works everywhere
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${color}"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="${Math.min(width, height) / 10}" fill="#2F5F8F">
    ${path.basename(filename, '.png').replace(/-/g, ' ')}
  </text>
</svg>`;
  
  fs.writeFileSync(filename.replace('.png', '.svg'), svg);
  
  // Also create a basic PNG-like file with minimal header for compatibility
  const simplePNG = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47]), // PNG magic
    Buffer.alloc(64, 0xFF) // Dummy data
  ]);
  
  fs.writeFileSync(filename, simplePNG);
}

function generateSimplePlaceholders(outputDir) {
  const graphics = [
    { name: 'app-icon', size: [1024, 1024], color: '#7FB069' },
    { name: 'little-bear-meditation', size: [1024, 1024], color: '#8B4513' },
    { name: 'little-bear-welcome', size: [1024, 1024], color: '#FF8A65' },
    { name: 'primary-button', size: [1024, 256], color: '#5B9BD5' },
    { name: 'navigation-icons', size: [1024, 256], color: '#7FB069' }
  ];
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  graphics.forEach(graphic => {
    const filename = path.join(outputDir, `${graphic.name}.png`);
    const svgname = path.join(outputDir, `${graphic.name}.svg`);
    
    // Create SVG (which works better for integration)
    const [width, height] = graphic.size;
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${graphic.name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${graphic.color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#E8F4FD;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad-${graphic.name})"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" 
        font-size="${Math.min(width, height) / 15}" fill="#2F5F8F" font-weight="bold">
    ${graphic.name.replace(/-/g, ' ').toUpperCase()}
  </text>
</svg>`;
    
    fs.writeFileSync(svgname, svg);
    
    // Create minimal PNG placeholder
    const pngPlaceholder = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(filename, pngPlaceholder);
    
    console.log(`✅ Created: ${graphic.name}.svg + .png`);
  });
}

if (require.main === module) {
  const outputDir = process.argv[2] || path.join(__dirname, 'generated-graphics');
  generateSimplePlaceholders(outputDir);
  console.log('✅ Simple placeholders created!');
}

module.exports = { generateSimplePlaceholders };