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
    urlPattern: /^https:\/\/usarodnakuze\.github\.io\/api/,
    handler: 'networkFirst'
  }, {
    urlPattern: /\/assets\//,
    handler: 'fastest'
  }]
};
