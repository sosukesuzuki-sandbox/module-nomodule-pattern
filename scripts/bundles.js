const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const baseConfig = {
  mode: process.env.NODE_ENV || "development",
  devtool: "#source-map",
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.m?js(\?.*)?$/i,
        sourceMap: true,
        terserOptions: {
          safari10: true,
        },
      }),
    ],
  },
};

const configureBabelLoader = ({ isModern }) => {
  return {
    test: /\.mjs$/,
    use: {
      loader: "babel-loader",
      options: {
        babelrc: false,
        exclude: [/core-js/, /regenerator-runtime/],
        presets: [
          [
            "@babel/preset-env",
            {
              bugfixes: isModern,
              targets: {
                esmodules: isModern,
              },
            },
          ],
        ],
      },
    },
  };
};

function createModernConfig({ srcPath, distPath }) {
  return Object.assign({}, baseConfig, {
    entry: {
      main: `${srcPath}/index.mjs`,
    },
    output: {
      path: distPath,
      filename: "main.mjs",
    },
    module: {
      rules: [configureBabelLoader({ isModern: true })],
    },
  });
}

function createLegacyConfig({ srcPath, distPath }) {
  return Object.assign({}, baseConfig, {
    entry: {
      main: `${srcPath}/nomodules.js`,
    },
    output: {
      path: distPath,
      filename: "main.es5.js",
    },
    module: {
      rules: [configureBabelLoader({ isModern: false })],
    },
  });
}

function createCompiler(config) {
  const compiler = webpack(config);
  return () => {
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) return reject(err);
        console.log(stats.toString({ colors: true }) + "\n");
        resolve();
      });
    });
  };
}

module.exports = async ({ srcPath, distPath }) => {
  const compileModern = createCompiler(
    createModernConfig({ srcPath, distPath })
  );
  const compileLegacy = createCompiler(
    createLegacyConfig({ srcPath, distPath })
  );
  await Promise.all([compileModern(), compileLegacy()]);
};
