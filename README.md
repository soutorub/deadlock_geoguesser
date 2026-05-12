# Deadlock GeoGuesser

A SvelteKit prototype for a Deadlock-inspired GeoGuessr game.

## Features

- Login and sign up flow
- Game setup with selectable round length and timer
- Image guessing flow with a Deadlock-style map
- Stored profile statistics by game mode
- Global highscores with filters and podium view
- MongoDB schema notes for later backend integration

## Tech Stack

- SvelteKit
- TypeScript
- Bootstrap 5

## Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Run checks:

```bash
npm run check
```

Build for production:

```bash
npm run build
```

## Project Notes

- App state is currently mocked locally with `localStorage`
- The database is not connected yet
- Suggested MongoDB collections are documented in [mongodb-schema.md](./mongodb-schema.md)
