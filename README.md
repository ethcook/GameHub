# GameHub

GameHub is a responsive, browser-based arcade for finding and playing quick mini-games. Browse a collection of 24 games across Action, Puzzle, Arcade, Strategy, and Casual genres, then launch a game right from its card.

## Features

- Discover 24 built-in mini-games, including Neon Dash, Pocket Pairs, Pixel Pong, and Cloud Nine.
- Search games by title or genre, or filter by genre, trending games, and new releases.
- Sort the collection by featured order, top rating, or title.
- Save games to your personal library and set a player name. These preferences are stored in your browser on this device.
- Browse a featured-games carousel and use the responsive layout on desktop or mobile.

GameHub is a front-end-only project: it does not require an account, backend, package installation, or build step.

## Install GameHub

GameHub is a Progressive Web App (PWA). When it is served from `localhost` or deployed to a site using HTTPS, supported browsers can install it as an app. Open GameHub and choose **Install** in the top bar. If your browser does not offer a one-click install prompt, use its menu and choose **Install GameHub** or **Add to Home Screen**.

The service worker caches the app shell so GameHub can reopen offline after its first successful load. The game library and player name remain saved in that browser on that device.

## Run locally

Serve the project folder locally to enable PWA installation and offline support:

1. Open a terminal in the GameHub project folder.
2. Start Python's built-in static web server:

   ```powershell
   py -m http.server 8000
   ```

3. Visit [http://localhost:8000](http://localhost:8000) in your browser.

To stop the server, press `Ctrl+C` in the terminal.

## Project files

- `index.html` — page structure and app metadata
- `styles.css` — layout, responsive styling, and game presentation
- `app.js` — game catalog, discovery controls, browser storage, and mini-game logic
- `sw.js` — service worker for offline app-shell caching
- `manifest.webmanifest`, app icons, and `apple-touch-icon.png` — install metadata and app icons

The interface loads its DM Sans and Space Grotesk fonts from Google Fonts when available.
