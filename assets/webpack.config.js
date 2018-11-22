var path = require('path');
var pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
var pathToPhoenix = path.join(__dirname, '/../deps/phoenix/');
var phaser = path.join(pathToPhaser, 'dist/phaser.js');
var phoenix = path.join(pathToPhoenix, 'assets/js/phoenix.js');

module.exports = {
  entry: './src/game/app.ts',
  output: {
    path: path.resolve(__dirname + '/../priv/static/', 'js'),
    filename: 'app.js',
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
      { test: /phaser\.js$/, loader: 'expose-loader?Phaser' }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      phaser: phaser,
      phoenix: phoenix
    }
  }
};
