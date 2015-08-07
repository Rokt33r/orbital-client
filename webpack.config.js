module.exports = {
  entry: ['./src/index.jsx'],
  output: {
    publicPath: 'http://localhost:8090/assets'
  },
  devtool: '#inline-source-map',
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'jsx-loader?insertPragma=React.DOM&harmony'
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  externals: {
    'react': 'React',
    'react/addons': 'React',
    'react-router': 'ReactRouter',
    'reflux': 'Reflux',
    'moment': 'moment',
    'markdown-it': 'markdownit'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
