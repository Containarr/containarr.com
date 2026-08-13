import fs from 'fs/promises';
import path from 'path';

// Ensure ./build
await fs.rm(path.join(process.cwd(), 'build'), { recursive: true, force: true });
await fs.mkdir(path.join(process.cwd(), 'build'), { recursive: true });

// Build Apps
const appsIndex = {};
const apps = await fs.readdir(path.join(process.cwd(), 'apps'));
await fs.mkdir(path.join(process.cwd(), 'build', 'apps'), { recursive: true });

for (const appId of apps) {
  if (appId.startsWith('.')) continue; // Skip hidden files

  const appJson = JSON.parse(await fs.readFile(path.join(process.cwd(), 'apps', appId, `${appId}.json`), 'utf-8'));
  appsIndex[appId] = appJson;

  await fs.copyFile(path.join(process.cwd(), 'apps', appId, `${appId}.png`), path.join(process.cwd(), 'build', 'apps', `${appId}.png`));
}

await fs.writeFile(path.join(process.cwd(), 'build', 'apps', 'index.json'), JSON.stringify(appsIndex, null, 2), 'utf-8');

// Build Website (Copy all files from ./www to ./build)
const wwwFiles = await fs.readdir(path.join(process.cwd(), 'www'));
for (const file of wwwFiles) {
  if (file.startsWith('.')) continue; // Skip hidden files
  const srcPath = path.join(process.cwd(), 'www', file);
  const destPath = path.join(process.cwd(), 'build', file);

  const stat = await fs.stat(srcPath);
  if (stat.isDirectory()) {
    await fs.cp(srcPath, destPath, { recursive: true });
  } else {
    await fs.copyFile(srcPath, destPath);
  }
}