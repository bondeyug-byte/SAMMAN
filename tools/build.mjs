// Builds SAMMAN from source.
//   shell/  Home, Guide (safe routes), Emergency and the app frame
//   app/    Learn (React + TypeScript), built with Vite into one HTML file
// Outputs (repo root, served as static files by Vercel or GitHub Pages):
//   index.html               the SAMMAN app; loads Learn from learn.html
//   learn.html               the Learn app on its own (also used inside index.html)
//   SAMMAN-single-file.html  everything in one file, for sharing or offline use
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Tooling lives in tools/ so the repo root has no package.json: Vercel and GitHub Pages
// then publish the ready-built HTML files as they are, with no build step on their side.
const toolsDir = dirname(fileURLToPath(import.meta.url));
process.chdir(join(toolsDir, '..'));

const skipApp = process.argv.includes('--skip-app');
if (!skipApp) execSync('npm run build', { cwd: 'app', stdio: 'inherit' });

const read = (p) => readFileSync(p, 'utf8');
const leafletDir = join(toolsDir, 'node_modules/leaflet/dist');
if (!existsSync(leafletDir)) throw new Error('Run "npm install" inside tools/ first (needs leaflet).');

// Guard against "</script>" inside inlined code ending the tag early.
const safeJs = (code) => code.replace(/<\/script/gi, '<\\/script');
const script = (code, label) => `  <script>/* ===== ${label} ===== */\n${safeJs(code)}\n</script>`;

const styles = `  <style>\n/* ===== leaflet.css 1.9.4 (bundled so the map never depends on a CDN) ===== */\n${read(`${leafletDir}/leaflet.css`)}\n${read('shell/styles.css')}</style>`;
const commonScripts = [
  script(read(`${leafletDir}/leaflet.js`), 'leaflet.js 1.9.4 (bundled)'),
  script(read('shell/config.js'), 'config.js'),
  script(read('shell/sample-data.js'), 'sample-data.js'),
  script(read('shell/scoring.js'), 'scoring.js'),
];
const app = script(read('shell/app.js'), 'app.js');
const learnHtml = readFileSync('app/dist/index.html');

const page = (scripts) =>
  read('shell/index.html').replace('  <!-- @@STYLES@@ -->', styles).replace('  <!-- @@SCRIPTS@@ -->', scripts.join('\n'));

writeFileSync('index.html', page([...commonScripts, app]));
writeFileSync('learn.html', learnHtml);
const packed = script(`const LEARN_B64 = "${learnHtml.toString('base64')}";`, 'learn.html, packed');
writeFileSync('SAMMAN-single-file.html', page([...commonScripts, packed, app]));

const kb = (p) => `${Math.round(readFileSync(p).length / 1024)} KB`;
console.log(`index.html ${kb('index.html')} · learn.html ${kb('learn.html')} · SAMMAN-single-file.html ${kb('SAMMAN-single-file.html')}`);
