// Builds SAMMAN from app/ (React + TypeScript, Vite) into one self-contained file
// and copies it to the repo root as index.html, which Vercel and GitHub Pages serve as is.
// Tooling lives in tools/ so the repo root has no package.json: hosts then publish the
// committed index.html directly, with no build step on their side.
import { execSync } from 'node:child_process';
import { copyFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
execSync('npm run build', { cwd: join(root, 'app'), stdio: 'inherit' });
copyFileSync(join(root, 'app/dist/index.html'), join(root, 'index.html'));
console.log(`index.html ${Math.round(readFileSync(join(root, 'index.html')).length / 1024)} KB`);
