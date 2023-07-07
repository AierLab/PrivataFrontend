import type { Configuration } from 'webpack';
import {ExternalsPlugin} from 'webpack'

import { rules } from './webpack.rules';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },

  plugins: [
    // ...your existing plugins...
   new ExternalsPlugin("commonjs", ["usb"]),
   new ExternalsPlugin("commonjs", ["drivelist"])
  ],

  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  // externals: {
  //   usb: 'usb',
  //   drivelist: 'drivelist',
  // }
};
