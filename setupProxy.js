const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app){
  app.use(
      createProxyMiddleware('/api', {
          target: "http://3.144.79.235:8080",
          changeOrigin: true
      })
  )
};