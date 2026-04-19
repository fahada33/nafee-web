import sharp from './node_modules/sharp/lib/index.js';

const size = 1024;

const svg = Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="180" fill="#2d7b33"/>
  <g transform="translate(996, 230) scale(-0.995, 0.995)">
    <polygon fill="white" points="966.87 92.16 882.18 92.16 966.87 176.85 966.87 92.16"/>
    <polygon fill="white" points="605.58 84.69 605.58 0 520.89 0 605.58 84.69"/>
    <polygon fill="white" points="966.87 343.61 876.87 252.83 876.87 420.86 744.58 420.86 744.58 92.16 654.58 92.16 654.58 510.86 966.87 510.86 966.87 343.61"/>
    <path fill="white" d="M405.78,99.62c-44.97,13.49-81.4,46.93-98.97,90-7.33,17.98-11.37,37.64-11.37,58.23,0,85.31,69.4,154.71,154.71,154.71h65.43v18.3H197.73l-11.73-11.83h116.07l-90-90h-51.51c-35.68,0-64.71-29.02-64.71-64.7s29.03-64.71,64.71-64.71h103.78c11.11-35.4,32.09-66.48,59.69-90h-163.47C75.25,99.62,5.85,169.02,5.85,254.33c0,42.83,17.5,81.65,45.72,109.7-28.22,28.05-45.72,66.87-45.72,109.71v37.12h90v-37.12c0-26.58,16.11-49.46,39.08-59.41l6.47,6.53h-.77l90,90h374.95V93.14h-155.43c-15.42,0-30.31,2.27-44.37,6.48ZM515.58,312.56h-65.43c-35.68,0-64.71-29.03-64.71-64.71,0-25.57,14.91-47.73,36.5-58.23,1.31-.64,2.64-1.23,3.99-1.77,7.49-3.04,15.66-4.71,24.22-4.71h65.43v129.42Z"/>
  </g>
</svg>`);

const sizes = [
  { name: 'Icon-App-1024x1024@1x.png', size: 1024 },
  { name: 'Icon-App-20x20@1x.png',     size: 20  },
  { name: 'Icon-App-20x20@2x.png',     size: 40  },
  { name: 'Icon-App-20x20@3x.png',     size: 60  },
  { name: 'Icon-App-29x29@1x.png',     size: 29  },
  { name: 'Icon-App-29x29@2x.png',     size: 58  },
  { name: 'Icon-App-29x29@3x.png',     size: 87  },
  { name: 'Icon-App-40x40@1x.png',     size: 40  },
  { name: 'Icon-App-40x40@2x.png',     size: 80  },
  { name: 'Icon-App-40x40@3x.png',     size: 120 },
  { name: 'Icon-App-60x60@2x.png',     size: 120 },
  { name: 'Icon-App-60x60@3x.png',     size: 180 },
  { name: 'Icon-App-76x76@1x.png',     size: 76  },
  { name: 'Icon-App-76x76@2x.png',     size: 152 },
  { name: 'Icon-App-83.5x83.5@2x.png', size: 167 },
];

const outDir = './src/app/flutter_application_1/ios/Runner/Assets.xcassets/AppIcon.appiconset/';

for (const { name, size: s } of sizes) {
  await sharp(svg)
    .resize(s, s)
    .png({ compressionLevel: 9 })
    .flatten({ background: { r: 45, g: 123, b: 51 } })
    .toFile(outDir + name);
  console.log(`✓ ${name}`);
}

// Android icon
await sharp(svg).resize(192, 192).png()
  .toFile('./src/app/flutter_application_1/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png');

console.log('All icons generated!');
