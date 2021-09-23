const { createProxyMiddleware } = require("http-proxy-middleware");

//cors차단을 우회하기 위해 만들음
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://localhost:4000",
      changeOrigin: true,
    })
  );
};
