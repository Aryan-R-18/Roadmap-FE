const { override, addWebpackPlugin } = require('customize-cra');

module.exports = override(
  (config, env) => {
    if (env === 'production') {
      // Remove CSS minimizer to avoid the CSS minimizer error
      config.optimization.minimizer = config.optimization.minimizer.filter(
        plugin => plugin.constructor.name !== 'CssMinimizerPlugin'
      );
    }
    return config;
  }
);