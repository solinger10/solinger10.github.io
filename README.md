# When Should I Leave For The Airport?

## Development

```sh
# Install dependencies
npm install

# Start local dev server (serves existing bundle on port 8080)
npm start

# Watch and rebuild dev bundle while coding
npm test
```

## Testing

```sh
npm run e2e
```

Tests use whatever bundle is already on disk — they do not rebuild it.

## Deploying

**Always build the production bundle before committing:**

```sh
npx webpack -p
git add -f __build__/bundle.js
git commit -m "..."
git push
```

> **Warning:** Never commit `__build__/bundle.js` after running `npm run e2e` or `npx webpack -d`.
> Those commands embed the **dev** API key. Only `npx webpack -p` embeds the production key.
> You can verify the key with:
> ```sh
> grep -o 'AIzaSy[A-Za-z0-9_-]*' __build__/bundle.js | sort -u
> # should output: AIzaSyC-g4IcHhhEy8_MZ8s0C5ksg2XI-iQ9ZXg
> ```

## Environment

A `.env` file is required for local development (never committed):

```
GOOGLE_MAPS_KEY=<dev key>
```
