const {
  override,
  addWebpackAlias,
  addBundleVisualizer, // 可视化并分析bundle大小
  addWebpackPlugin, // 添加其他webpack插件
  setWebpackOptimizationSplitChunks, // 配置分片策略
} = require('customize-cra');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = override(
  addWebpackAlias({
    ['@components']: path.resolve(__dirname, 'src/components'),
  }),

  addBundleVisualizer(),

  setWebpackOptimizationSplitChunks({
    chunks: 'all',
    cacheGroups: {
      vendor: {
        name: 'chunk-vendors',
        test: /[\\/]node_modules[\\/]/,
        priority: 10,
        chunks: 'initial',
      },
      commons: {
        name: 'chunk-commons',
        minChunks: 3, // minimum common number
        priority: 5,
        reuseExistingChunk: true,
      },
      lib: {
        test(module) {
          return module.size() > 52 * 1024 && /node_modules[/\\]/.test(module.nameForCondition() || '');
        },
        name(module) {
          const packageNameArr = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
          const packageName = packageNameArr ? packageNameArr[1] : '';

          // npm package names are URL-safe, but some servers don't like @ symbols
          return `chunk-lib.${packageName.replace('@', '')}`;
        },
        priority: 15,
        minChunks: 1,
        reuseExistingChunk: true,
      },
    },
  }),

  // 使用 CompressionPlugin 插件进行压缩
  addWebpackPlugin(
    new BundleAnalyzerPlugin(),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
    }),
  ),
);
