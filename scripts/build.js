// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

var chalk = require('chalk');
var webpack = require('webpack');
var config = require('../config/webpack.config');

build();
function build() {
  console.log('Creating an optimized production build...');
  webpack(config).run((err, stats) => {
    if (err) {
      console.log(chalk.red('Failed to compile', err));
      process.exit(1);
    }

    if (stats.compilation.errors.length) {
      console.log(
        'Failed to compile.',
        stats.compilation.errors
      );
      process.exit(1);
    }

    console.log(chalk.green('Compiled successfully.'));
    console.log();

  });
}