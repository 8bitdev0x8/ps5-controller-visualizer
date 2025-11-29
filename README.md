# PS5 DualSense Controller Visualizer

Real-time, web-based PS5 DualSense controller visualizer that shows button presses, sticks, triggers, and touchpad input on screen — perfect for adding a live controller overlay to your stream via OBS (browser source).

![Alt text](public/Images/PS5ControllerInterface.png)

![Alt text](public/Images/Gameplay.gif)

---

## Features

- Real-time display of:
  - Buttons (X, O, Δ, ▢)
  - D-Pad
  - L1/R1 and analog L2/R2 triggers
  - Left/Right sticks + press
- Clean, simple on-screen layout

## How to Use

1. Connect your PS5 DualSense controller.  
2. Run the visualizer application.  
3. Press buttons and move sticks — the visualizer updates instantly.

## How to Use in OBS
1. Add a **Browser Source** in OBS.
2. Set URL to `http://localhost:5173/` (or your local file path if built).
3. Set Width: `810`, Height: `810`.
4. Check "Shutdown source when not visible" to save resources.
5. The background will be transparent, showing only the controller.

## How to Customize Styles
1. Edit `style.css` directly for colors, shadows, and positions.
2. To experiment with themes, duplicate `style.css` (e.g., `style-dark.css`), update styles, and change the `<link>` tag in `index.html` to point to your alternate stylesheet.

---

## Deploy to GitHub Pages (gh-pages Branch)

This project can be published at: `https://8bitdev0x8.github.io/ps5-controller-visualizer/` using a `gh-pages` branch.

### One-Time Setup
1. Ensure repository name matches the base path (`ps5-controller-visualizer`).
2. In `vite.config.js` we set: `base: '/ps5-controller-visualizer/'` (already done).
3. Install the deploy dependency:
  ```bash
  npm install --save-dev gh-pages
  ```
4. Commit and push changes.

### Deploy Command
Run:
```bash
npm run deploy
```
This builds to `dist/` then publishes its contents to a `gh-pages` branch.

### Enable Pages in GitHub
1. Go to your repository Settings > Pages.
2. Set Source: `Deploy from a branch`.
3. Select Branch: `gh-pages` and Folder: `/root`.
4. Save. Site appears after a short delay (cache can take a few minutes).

### Updating the Site
Each time you make changes:
```bash
npm run deploy
```

### Verifying Asset Paths
If images or CSS do not load, confirm the URL starts with `/ps5-controller-visualizer/` (handled by Vite `base`).

### Custom Domain (Optional)
Add a `CNAME` file inside `dist/` before deploy or create one in the `gh-pages` branch root containing your domain (e.g., `controller.example.com`). Then configure DNS with a CNAME to `8bitdev0x8.github.io`.

### Fallback (Manual) Deployment
If you prefer manual publishing:
1. Build: `npm run build`
2. Create a new orphan branch `gh-pages` and add `dist` contents at root.
3. Push branch: `git push origin gh-pages --force`.

---