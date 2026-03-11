const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf-8');

// Replace :root block completely
const lightTheme = `:root {
  --bg-primary: #e6f0ef;
  --bg-secondary: rgba(255, 255, 255, 0.6);
  --bg-card: rgba(255, 255, 255, 0.45);
  --bg-hover: rgba(255, 255, 255, 0.8);
  --border: rgba(46, 96, 79, 0.15);
  --border-light: rgba(46, 96, 79, 0.08);
  --text-primary: #1f3b30;
  --text-secondary: #426356;
  --text-muted: #708a80;
  --accent: #2c5949;
  --accent-hover: #1f4236;
  --accent-glow: rgba(44, 89, 73, 0.15);
  --success: #059669;
  --warning: #f59e0b;
  --danger: #ef4444;
  --verified: #2c5949;
  --text-gradient-start: #1f3b30;
  --hero-bg: transparent;
  --pulse-bg: transparent;
  --ambient-bg: rgba(255, 255, 255, 0.6);
  --ambient-opacity: 0.8;
  --grid-color: rgba(46, 96, 79, 0.05);
  --grid-mask: white;
  --nav-scrolled: rgba(255, 255, 255, 0.8);
  --glass-bg: rgba(255, 255, 255, 0.3);
  --glass-border: rgba(255, 255, 255, 0.5);
  --glass-shadow: 0 4px 24px rgba(0, 0, 0, 0.03);
  --glass-bg-hover: rgba(255, 255, 255, 0.6);
  --glass-border-hover: rgba(46, 96, 79, 0.3);
  --glass-shadow-hover: 0 8px 32px rgba(46, 96, 79, 0.08), inset 0 0 20px rgba(255, 255, 255, 0.5);
  --input-bg: rgba(255, 255, 255, 0.7);
  --input-bg-focus: #ffffff;
  --input-border: transparent;
  --code-bg: #11221b;
  --code-border: rgba(46, 96, 79, 0.2);
  --code-text: #d8e6dd;
  --sidebar-bg: rgba(255, 255, 255, 0.4);
  --filter-pill-bg: rgba(255, 255, 255, 0.5);
  --tag-bg: 46, 96, 79;
  --tag-bg-blue: 56, 189, 248;
  --logo-bg: #ffffff;
  --body-bg: radial-gradient(circle at 50% 50%, #f6fbfc 0%, #dbe8e4 100%);
  --hero-layer-bg: radial-gradient(circle at 50% 50%, transparent 20%, #e6f0ef 80%);
  --hero-4d-opacity: 0.05;
  --hero-4d-saturate: 0.5;
  --toast-success-bg: rgba(5, 150, 105, 0.15);
  --toast-error-bg: rgba(239, 68, 68, 0.15);
  --skeleton-grad: linear-gradient(90deg, rgba(255,255,255,0.4) 25%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.4) 75%);
  --prof-border: rgba(46, 96, 79, 0.3);
  --shadow-color: rgba(46, 96, 79, 0.15);
  --border-shadow-color: rgba(46, 96, 79, 0.1);
  --monitor-bg: rgba(255,255,255,0.4);
  --gradient-text-start: var(--accent);
  --gradient-text-end: #1f3b30;
  --font-family: var(--font-quicksand), var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --btn-radius: 4px;
}

.dark {
  --bg-primary: #000000;
  --bg-secondary: #0f0f0f;
  --bg-card: #111111;
  --bg-hover: #1a1a1a;
  --border: #2f2f2f;
  --border-light: #1f1f1f;
  --text-primary: #e7e9ea;
  --text-secondary: #71767b;
  --text-muted: #4e5055;
  --accent: #6c63ff;
  --accent-hover: #5a52e0;
  --accent-glow: rgba(108, 99, 255, 0.15);
  --success: #00ba7c;
  --warning: #ffd400;
  --danger: #f4212e;
  --verified: #6c63ff;
  --text-gradient-start: #fff;
  --hero-bg: #000;
  --pulse-bg: #020202;
  --ambient-bg: var(--accent-glow);
  --ambient-opacity: 0.1;
  --grid-color: rgba(255, 255, 255, 0.02);
  --grid-mask: black;
  --nav-scrolled: rgba(0,0,0,0.8);
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.05);
  --glass-shadow: none;
  --glass-bg-hover: rgba(255, 255, 255, 0.03);
  --glass-border-hover: rgba(108, 99, 255, 0.4);
  --glass-shadow-hover: 0 0 40px rgba(108, 99, 255, 0.15), inset 0 0 20px rgba(108, 99, 255, 0.05);
  --input-bg: var(--bg-secondary);
  --input-bg-focus: var(--bg-secondary);
  --input-border: var(--border);
  --code-bg: #0d1117;
  --code-border: #30363d;
  --code-text: #e6edf3;
  --sidebar-bg: transparent;
  --filter-pill-bg: transparent;
  --tag-bg: 168, 85, 247;
  --tag-bg-blue: 56, 189, 248;
  --logo-bg: #000000;
  --body-bg: var(--bg-primary);
  --hero-layer-bg: radial-gradient(circle at 50% 50%, transparent 20%, #000 80%);
  --hero-4d-opacity: 0.15;
  --hero-4d-saturate: 1.5;
  --toast-success-bg: rgba(0, 186, 124, 0.15);
  --toast-error-bg: rgba(244, 33, 46, 0.15);
  --skeleton-grad: linear-gradient(90deg, var(--bg-card) 25%, var(--bg-hover) 50%, var(--bg-card) 75%);
  --prof-border: rgba(168, 85, 247, 0.3);
  --shadow-color: rgba(0,0,0,0.8);
  --border-shadow-color: rgba(255,255,255,0.08);
  --monitor-bg: rgba(0,0,0,0.3);
  --gradient-text-start: #fff;
  --gradient-text-end: #a855f7;
  --font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --btn-radius: 9999px;
}`;

css = css.replace(/:root\s*\{[\s\S]*?\n\}\n/, lightTheme + '\n\n');

// Specific replacements:
// 1. body
css = css.replace(/body\s*\{[\s\S]*?\}/, `body {
  background: var(--body-bg);
  background-attachment: fixed;
  color: var(--text-primary);
  font-family: var(--font-family);
  min-height: 100vh;
  line-height: 1.5;
}`);

// 2. .glass
css = css.replace(/\.glass\s*\{[\s\S]*?\}/, `.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}`);

// 3. .glow-card:hover
css = css.replace(/\.glow-card:hover\s*\{[\s\S]*?\}/, `.glow-card:hover {
  background: var(--glass-bg-hover) !important;
  border-color: var(--glass-border-hover) !important;
  box-shadow: var(--glass-shadow-hover);
}`);

css = css.replace(/\.hero-4d-bg\s*\{[\s\S]*?\}/, `.hero-4d-bg {
  position: absolute;
  inset: 0;
  background: url('/assets/hero_tech_visual_4d.png') no-repeat center center;
  background-size: cover;
  opacity: var(--hero-4d-opacity);
  filter: blur(20px) saturate(var(--hero-4d-saturate));
  pointer-events: none;
  z-index: -1;
}`);

css = css.replace(/\.hero-layer\s*\{[\s\S]*?\}/, `.hero-layer {
  position: absolute;
  inset: 0;
  background: var(--hero-layer-bg);
  pointer-events: none;
  z-index: -1;
}`);

css = css.replace(/\.gradient-text\s*\{[\s\S]*?\}/, `.gradient-text {
  background: linear-gradient(135deg, var(--gradient-text-start), var(--gradient-text-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`);

css = css.replace(/\.btn\s*\{[\s\S]*?\}/, `.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.6rem 1.75rem;
  border-radius: var(--btn-radius);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  white-space: nowrap;
}`);

css = css.replace(/\.card\s*\{[\s\S]*?\}/, `.card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  overflow: hidden;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--glass-shadow);
  transition: all 0.2s ease;
}`);

css = css.replace(/\.card:hover\s*\{[\s\S]*?\}/, `.card:hover {
  border-color: var(--border);
  box-shadow: var(--card-shadow-hover);
}`);

css = css.replace(/\.input\s*\{[\s\S]*?\}/, `.input {
  width: 100%;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 4px;
  padding: 0.8rem 1rem;
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02) inset;
  transition: all 0.2s ease;
  font-family: inherit;
  resize: vertical;
}`);

css = css.replace(/\.input:focus\s*\{[\s\S]*?\}/, `.input:focus {
  background: var(--input-bg-focus);
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}`);

css = css.replace(/\.tag\s*\{[\s\S]*?\}/, `.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.65rem;
  border-radius: var(--btn-radius);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}`);

css = css.replace(/\.filter-pill\s*\{[\s\S]*?\}/, `.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.85rem;
  border-radius: var(--btn-radius);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--filter-pill-bg);
  color: var(--text-secondary);
  transition: all 0.2s ease;
  white-space: nowrap;
}`);

css = css.replace(/\.code-block\s*\{[\s\S]*?\}/, `.code-block {
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: 8px;
  padding: 1rem;
  font-family: 'Fira Code', 'Cascadia Code', 'Monaco', monospace;
  font-size: 0.82rem;
  color: var(--code-text);
  overflow-x: auto;
  white-space: pre;
  line-height: 1.6;
  margin-top: 0.75rem;
}`);

css = css.replace(/\.toast-success\s*\{[\s\S]*?\}/, `.toast-success {
  background: var(--toast-success-bg);
  border: 1px solid var(--success);
  color: var(--success);
}`);

css = css.replace(/\.toast-error\s*\{[\s\S]*?\}/, `.toast-error {
  background: var(--toast-error-bg);
  border: 1px solid var(--danger);
  color: var(--danger);
}`);

css = css.replace(/\.sidebar\s*\{[\s\S]*?\}/, `.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  border-right: 1px solid var(--border-light);
  background: var(--sidebar-bg);
  backdrop-filter: blur(12px);
}`);

css = css.replace(/\.skeleton\s*\{[\s\S]*?\}/, `.skeleton {
  background: var(--skeleton-grad);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}`);

css = css.replace(/\.grid-bg\s*\{[\s\S]*?\}/, `.grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(circle at 50% 50%, var(--grid-mask) 30%, transparent 80%);
  pointer-events: none;
  z-index: 0;
}`);

css = css.replace(/\.ambient-orb\s*\{[\s\S]*?\}/, `.ambient-orb {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--ambient-bg) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(60px);
  opacity: var(--ambient-opacity);
  animation: float-slow 15s infinite ease-in-out;
  pointer-events: none;
  z-index: 0;
}`);

css = css.replace(/\.premium-text\s*\{[\s\S]*?\}/, `.premium-text {
  background: linear-gradient(90deg, var(--text-gradient-start) 0%, var(--accent) 50%, var(--text-gradient-start) 100%);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: text-shimmer 4s linear infinite;
}`);

fs.writeFileSync('src/app/globals.css', css);
