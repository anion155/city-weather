/* eslint-disable @typescript-eslint/no-var-requires */
import del from 'rollup-plugin-delete';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import typescript from '@wessberg/rollup-plugin-ts';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import html from '@rollup/plugin-html';
import dev from 'rollup-plugin-dev';
import livereload from 'rollup-plugin-livereload';

import stylelint from 'stylelint';
import autoprefixer from 'autoprefixer';
import cssPresetEnv from 'postcss-preset-env';

const PRODUCTION = process.env.NODE_ENV === 'production';
const WATCH = process.env.ROLLUP_WATCH === 'true';

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: !PRODUCTION,
  },
  watch: {
    chokidar: { },
    clearScreen: false,
  },
  plugins: [
    PRODUCTION && del({
      targets: 'dist/*',
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({
      include: 'node_modules/**/*',
      exclude: [
        '**/*.esm.js',
        '**/*.es.js',
        '**/*.browser.js',
        '**/esm/**',
        '**/es/**',
        '**/browser/**',
      ],
      namedExports: {
        'react': Object.keys(require('react')),
        'react-dom': Object.keys(require('react-dom')),
      },
    }),
    json({
      preferConst: true,
    }),
    postcss({
      plugins: [
        stylelint(),
        autoprefixer(),
        cssPresetEnv(),
      ],
    }),
    typescript(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'build.DEV': process.env.NODE_ENV === 'development',
      'build.OPENWEATHER_APPID': JSON.stringify(process.env.OPENWEATHER_APPID),
    }),
    html(),
    WATCH && dev('dist'),
    WATCH && livereload({
      watch: 'dist',
    }),
  ],
};
export default config;
