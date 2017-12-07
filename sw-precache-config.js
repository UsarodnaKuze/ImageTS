module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'dist/',
  root: 'dist/',
  staticFileGlobs: [
    'dist/index.html',
    'dist/**.js',
    'dist/**.css'
  ],
  runtimeCaching: [{
    urlPattern: /^https:\/\/andrasczeh\.github\.io/,
    handler: 'networkFirst'
  }, {
    urlPattern: /\/assets\//,
    handler: 'fastest'
  }]
};
