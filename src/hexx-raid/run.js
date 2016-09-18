const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');

const tasks = new Map();

function run(task) {
  const start = new Date();
  console.log(`Starting '${task}'...`);
  return Promise.resolve()
    .then(() => tasks.get(task)())
    .catch(err => console.error(err.stack))
    .then(() => console.log(`Finished '${task}' after ${new Date().getTime() - start.getTime()}ms`));
}

tasks.set('dev', () => {
  process.env.NODE_ENV = 'development';
  const config = require('./webpack.config');

  new WebpackDevServer(webpack(config), {
    contentBase: 'wwwroot/',
    hot: true,
    stats: 'minimal',
    proxy: {
      '/api': {
        target: 'http://localhost:48581',
        secure: false
      },
      '/token': {
        target: 'http://localhost:48581',
        secure: false
      }
    },
    setup: app => {
      app.use((req, res, next) => {
        const regex = /(\/raids|\/characters)/gi;
        req.url = req.url.replace(regex, '/');
        next();
      });
    }
  }).listen(48580, 'localhost', err => {
    if (err) {
      console.error(err);
    }
    console.log('Starting local dev server at localhost:4858...');
  });

  require('child_process').exec('npm run css-watch');
});

tasks.set('build', () => {
  process.env.NODE_ENV = 'production';
  const config = require('./webpack.config');
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        console.error(err);
        return reject();
      }
      return resolve();
    });
  });
});

run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'dev');
