# QuickLanka Express

A quick and efficient way to access the QuickLanka Express.

## Features

- Modern React + Vite setup
- Routing with React Router
- Tailwind CSS for styling
- Real-time updates (see [`hooks/useRealTimeUpdates.ts`](src/hooks/useRealTimeUpdates.ts))
- Toast notifications with `react-hot-toast`
- Ready for deployment to GitHub Pages

## Project Structure

```
.
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   └── utils/
├── public/
├── package.json
├── vite.config.ts
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```sh
npm install
```

### Development

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Linting

```sh
npm run lint
```

### Build

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

## Deployment

This project is configured to deploy to GitHub Pages.

- The production build outputs to the `dist` folder.
- The site is published to the `gh-pages` branch.

To deploy manually:

```sh
npm run deploy
```

GitHub Actions will also deploy automatically on push to `main` ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

## Routing

The app uses a basename of `/QuickLanka-Express` for GitHub Pages compatibility. See [`App.tsx`](src/App.tsx):

- `/` – Home
- `/book` – Booking
- `/track` – Tracking
- `/services` – Services
- `/business` – Business
- `/coverage` – Coverage
- `/contact` – Contact
- Any other route – Not Found

##
