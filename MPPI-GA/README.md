# MPPI-GA

3D pathfinding visualizer built with **Vue 2** and **Three.js**. Explore Dijkstra, A*, BFS, DFS, maze generation, orbit and first-person camera modes, and optional camera-based wall painting.

## Setup

```bash
npm install
npm run serve
```

Open the URL shown in the terminal (usually `http://localhost:8080/`).

## Build

```bash
npm run build
```

Production output is written to `dist/`. If you deploy this repo to GitHub Pages as `https://<user>.github.io/MPPI-GA/`, the app is configured with `publicPath` set to `/MPPI-GA/` in `vue.config.js`.

## Credits

- Rendering: [Three.js](https://threejs.org/)
- Ground textures: [OpenGameArt.org](https://opengameart.org/)
- UI icons: [Freepik](https://www.flaticon.com/authors/freepik) via [Flaticon](https://www.flaticon.com/)

## Note on Three.js version

The grid uses legacy geometry APIs (`faces` / per-face colors). The project pins **three@0.119.1** until that rendering path is migrated to modern `BufferGeometry`.
