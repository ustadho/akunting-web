
const DEFAULT_TARGET = "http://localhost:10000";

const PROXY_CONFIG = {
  "/api": {
    "target": DEFAULT_TARGET,
    "secure": false,
    "pathRewrite": {
      "^/api": "/api"
    },
    "changeOrigin": true,
    "logLevel": "debug",
  }
};

module.exports = PROXY_CONFIG;
