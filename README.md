# PS5 DualSense Controller Visualizer

Real-time, web-based PS5 DualSense controller visualizer that shows button presses, sticks, triggers, and touchpad input on screen — perfect for adding a live controller overlay to your stream via OBS (browser source).

![Alt text](public/Images/PS5Controller.gif)

![Alt text](public/Images/Gameplay.gif)

![Alt text](public/Images/Controller_Skin.jpg)

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
