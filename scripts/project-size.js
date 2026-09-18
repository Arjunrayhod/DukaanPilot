const fs = require('fs');
const path = require('path');

function getDirectorySize(dirPath) {
  let totalSize = 0;
  if (!fs.existsSync(dirPath)) return 0;
  
  try {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      try {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          totalSize += getDirectorySize(fullPath);
        } else {
          totalSize += stats.size;
        }
      } catch (err) {
        // ignore
      }
    }
  } catch (err) {
    // ignore
  }
  return totalSize;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0.00 MB';
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) {
    return mb.toFixed(2) + ' MB';
  }
  const gb = mb / 1024;
  return gb.toFixed(2) + ' GB';
}

const rootDir = path.resolve(__dirname, '..');

const categories = {
  Source: ['packages', 'services', 'apps', 'docs', 'scripts', 'infrastructure'],
  Dependencies: ['node_modules', 'packages/shared/node_modules', 'packages/database/node_modules', 'services/api/node_modules', 'apps/web/node_modules'],
  Docker: ['infrastructure/docker'],
  Database: ['packages/database/prisma/dev.db', 'packages/database/prisma/dev.db-journal', 'data'],
  Models: ['models', '.cache/models'],
  Dataset: ['datasets', 'data/synthetic'],
  Logs: ['logs', 'services/api/logs'],
  Cache: ['.cache', '.turbo', 'apps/web/dist', 'services/api/dist']
};

console.log('\n============================================================');
console.log('DukaanPilot Storage Footprint Report (Budget <= 15.00 GB)');
console.log('============================================================\n');

let totalBytes = 0;

for (const [catName, paths] of Object.entries(categories)) {
  let catBytes = 0;
  for (const relPath of paths) {
    const full = path.join(rootDir, relPath);
    if (fs.existsSync(full)) {
      const stats = fs.statSync(full);
      if (stats.isDirectory()) {
        if (catName === 'Source') {
          const getCleanSourceSize = (p) => {
            let s = 0;
            const items = fs.readdirSync(p);
            for (const item of items) {
              if (item === 'node_modules' || item === 'dist' || item === '.cache') continue;
              const fp = path.join(p, item);
              const st = fs.statSync(fp);
              if (st.isDirectory()) s += getCleanSourceSize(fp);
              else s += st.size;
            }
            return s;
          };
          catBytes += getCleanSourceSize(full);
        } else {
          catBytes += getDirectorySize(full);
        }
      } else {
        catBytes += stats.size;
      }
    }
  }
  totalBytes += catBytes;
  console.log('  ' + catName.padEnd(16) + ' : ' + formatBytes(catBytes).padStart(12));
}

console.log('------------------------------------------------------------');
console.log('  Total Usage      : ' + formatBytes(totalBytes).padStart(12) + ' / 15.00 GB');

const pct = ((totalBytes / (15 * 1024 * 1024 * 1024)) * 100).toFixed(4);
const freeGb = (15 - (totalBytes / (1024 * 1024 * 1024))).toFixed(2);
console.log('  Storage Budget   : ' + pct + '% used (' + freeGb + ' GB free)');
console.log('============================================================\n');
