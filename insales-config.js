'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Настройки поумолчанию
 */
exports.default = {
  account: {
    id: '1e5d0cc66882423987942615ac57d1ab',
    token: '06133ebffec7de0a188dab7adcfc27be',
    url: 'myshop-cvh950.myinsales.ru',
    http: true
  },
  theme: {
    id: '9408193',
    root: '.',
    backup: true,
    assetsSync: true,
    excludeFiles: [],
    onUpdate: function onUpdate() {
      // обновление темы
    },
    assetsDomain: 'https://assets.insales.ru'
  },
  util: {
    openBrowser: true
  },
  plugins: {
    exclude: ['*.min.js', '*.min.css', '*.liquid']
  },
  chokidarOptions: {
    ignored: /[\/\\]\./,
    ignoreInitial: true,
    followSymlinks: true,
    usePolling: false,
    interval: 200,
    delay: 0,
    binaryInterval: 300,
    alwaysStat: true,
    depth: 99,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 100
    },
    ignorePermissionErrors: true
  }
};