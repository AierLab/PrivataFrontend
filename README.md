# PrivataFrontend

This is Privata Client using electron, typescript & react, and bundled by ElectronForge.

## How is this been set up

- https://www.electronforge.io/templates/typescript-+-webpack-template
- https://www.electronforge.io/guides/framework-integration/react-with-typescript
- https://samdecrock.medium.com/building-electron-js-apps-with-react-js-2022-4d14fb2924ac

## Delevopment

### For Chinese developers

- Windows: Recommand using [Proxifier](https://www.proxifier.com/) as proxy.
- Linux: Use [proxychains-ng](https://github.com/rofl0r/proxychains-ng).
- macOS: Either `proxychains-ng` or Clash Tunneling mode.

### Run in development

1. Navigate to `react-app` and `electron-app`, do both `npm install`.
2. Navigate to `react-app`, run following command, and leave it running.
   ```console
   $ npm run start
   ```
3. Navigate to `electron-app`, run
   ```console
   $ npm run start
   ```

## Build

1. Run `npm run build` at `react-app` folder.
2. Run `npm run make` at `electorn` folder.

