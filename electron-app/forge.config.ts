import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

import path from 'path'
import fs from 'fs'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ForgeExternalsPlugin from '@timfish/forge-externals-plugin';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
    new ForgeExternalsPlugin({
      externals: ['usb', 'drivelist']
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any
  ],
  hooks: {
    packageAfterCopy: async (config, buildPath, electronVersion, platform, arch) => {
      const reactBuild = path.join(__dirname, '../react-app/build/')
      if (!fs.existsSync(reactBuild)) {
        throw new Error('React App needs to be built before building electron! Navigate to react-app folder and run `npm run build`.')
      }
      const dst = buildPath;
      fs.cpSync(reactBuild, dst, { recursive: true });
    }
  }
};

export default config;
