https://github.com/rafrex/spa-github-pages

#### Development environment
I have included `webpack-dev-server` for testing changes locally. It can be accessed by running `$ npm start` (details below), or you can use your own dev setup by running `$ webpack` and serving the `index.html` file and the `404.html` file for 404s. Note that `webpack-dev-server` automatically creates a new bundle whenever the source files change and serves the bundle from memory, so you'll never see the bundle as a file saved to disk.
- `$ npm start` runs the [start script][startScript] in `package.json`, which runs the command `$ webpack-dev-server --devtool eval-source-map --history-api-fallback --open`
  - `-devtool eval-source-map` is for [generating source maps][webpackDevtool] in while in development
  - `--history-api-fallback` allows for frontend routing and will serve `index.html` when the requested file can't be found
  - `--open` will open automatically open the site in your browser
- `webpack-dev-server` will serve `index.html` at `http://localhost:8080` (port `8080` is the default). Note that you must load the `index.html` from the server and not just open it directly in the browser or the scripts won't load.

whenshouldileavefortheairport 
