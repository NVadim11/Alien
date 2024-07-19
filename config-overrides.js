const webpack = require("webpack");

module.exports = function override(config) {
  // Игнорировать определённые предупреждения, если необходимо
  config.ignoreWarnings = [/Failed to parse source map/];

  // Убедиться, что объект fallback существует в конфигурации resolve
  const fallback = config.resolve.fallback || {};

  // Добавить полифилл для модуля crypto
  fallback.crypto = require.resolve("crypto-browserify");

  // Добавить полифиллы для остальных модулей, если они используются в проекте
  fallback.zlib = require.resolve("browserify-zlib");
  fallback.stream = require.resolve("stream-browserify");
  fallback.assert = require.resolve("assert");
  fallback.http = require.resolve("stream-http");
  fallback.https = require.resolve("https-browserify");
  fallback.os = require.resolve("os-browserify");
  fallback.url = require.resolve("url");
  fallback["process/browser"] = require.resolve("process/browser");
  fallback.path = require.resolve("path-browserify");
  fallback.vm = require.resolve("vm-browserify");

  // Обновить fallback в конфигурации resolve webpack
  config.resolve.fallback = fallback;

  // Убедиться, что массив plugins существует в конфигурации
  config.plugins = config.plugins || [];

  // Предоставить необходимые глобальные переменные
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );
  

  return config;
};
