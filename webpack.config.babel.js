/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import webpack from 'webpack';
import fs from 'fs';

function readEnv() {
  try {
    return fs.readFileSync('.env', 'utf8')
      .split('\n')
      .reduce((acc, line) => {
        const [key, val] = line.split('=');
        if (key && val) acc[key.trim()] = val.trim();
        return acc;
      }, {});
  } catch (e) {
    return {};
  }
}

const isProd = process.argv.indexOf('-p') !== -1;
const env = readEnv();
const GOOGLE_MAPS_API_KEY = isProd
  ? 'AIzaSyC-g4IcHhhEy8_MZ8s0C5ksg2XI-iQ9ZXg'
  : (env.GOOGLE_MAPS_KEY || '');

export default {
  context: __dirname,
  entry: './index.jsx',
  output: {
    path: `${__dirname}/__build__`,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: (() => {
    const defines = {
      GOOGLE_MAPS_API_KEY: JSON.stringify(GOOGLE_MAPS_API_KEY),
    };
    if (isProd) {
      return [
        new webpack.DefinePlugin({
          'process.env': { NODE_ENV: JSON.stringify('production') },
          ...defines,
        }),
        new webpack.optimize.UglifyJsPlugin({ output: { comments: false } }),
      ];
    }
    return [new webpack.DefinePlugin(defines)];
  })(),
};
