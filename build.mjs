import fs from 'fs/promises';
import path from 'path';

import Ajv2020 from 'ajv/dist/2020.js';

const appsDirectory = path.join(process.cwd(), 'apps');
const serviceSchema = JSON.parse(await fs.readFile(path.join(appsDirectory, 'service.schema.json'), 'utf-8'));
const validateService = new Ajv2020({ allErrors: true }).compile(serviceSchema);

// Read and validate every app before replacing the last successful build.
const appsIndex = {};
const apps = await fs.readdir(appsDirectory, { withFileTypes: true });

for (const app of apps) {
  if (!app.isDirectory() || app.name.startsWith('.')) continue;

  const appId = app.name;
  const appFile = path.join(appsDirectory, appId, `${appId}.json`);
  let appJson;

  try {
    appJson = JSON.parse(await fs.readFile(appFile, 'utf-8'));
  } catch (error) {
    throw new Error(`Unable to parse apps/${appId}/${appId}.json: ${error.message}`);
  }

  if (!validateService(appJson)) {
    const errors = validateService.errors
      .map(error => `  ${error.instancePath || '/'} ${error.message}`)
      .join('\n');
    throw new Error(`Schema validation failed for apps/${appId}/${appId}.json:\n${errors}`);
  }

  appsIndex[appId] = appJson;
}

// Ensure ./build
await fs.rm(path.join(process.cwd(), 'build'), { recursive: true, force: true });
await fs.mkdir(path.join(process.cwd(), 'build'), { recursive: true });

// Build Apps
await fs.mkdir(path.join(process.cwd(), 'build', 'apps'), { recursive: true });
await fs.copyFile(path.join(appsDirectory, 'service.schema.json'), path.join(process.cwd(), 'build', 'apps', 'service.schema.json'));

for (const appId of Object.keys(appsIndex)) {
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
