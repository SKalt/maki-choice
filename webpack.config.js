/* global __dirname*/
const path = require('path');

module.exports = (env={}) => {
  return {
    entry: './main.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: [
            'file-loader'
          ]
        },
        // {test:/\.svg$/, use:['svg-inline-loader']},
        {
          test:/\.vue$/,
          use: ['vue-loader']
        }
      ]
    }
  };
};
