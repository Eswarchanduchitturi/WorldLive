Quick Tailwind verification
===========================

Files added:
- `postcss.config.js` — Runs `tailwindcss` and `autoprefixer` when PostCSS is used.
- `src/TestTailwind.jsx` — Small React component that uses Tailwind utility classes.

How to verify locally:

1. Start dev server:

```powershell
npm run dev
```

2. Open the app in your browser (default Vite URL, e.g. `http://localhost:5173`).

3. Temporarily render the test component:

- Option A (temporary): In `src/main.jsx` replace the `App` import with `TestTailwind` and update the render import:

```js
import TestTailwind from './TestTailwind.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestTailwind />
  </React.StrictMode>,
)
```

- Option B (inspect in DevTools): Leave code as-is and open the page; if your app is showing the `App` component, check that utility classes (e.g. `text-3xl`, `bg-red-500`) appear styled. If not, try Option A.

If Tailwind utilities are still not applied:
- Confirm `tailwind.config.js` exists at project root and `content` paths include `./src/**/*.{js,jsx}` (already added).
- Check console for build errors from Vite/PostCSS and share them if present.
- Check console for build errors from Vite/PostCSS and share them if present.

VS Code tips
- Install the `Tailwind CSS IntelliSense` extension for class name completions and linting.
- If you see a yellow underline under `@tailwind` in `src/index.css`, add/confirm the following workspace setting (this repo already includes `.vscode/settings.json`):

```json
{
  "css.lint.unknownAtRules": "ignore",
  "scss.lint.unknownAtRules": "ignore",
  "less.lint.unknownAtRules": "ignore"
}
```
