// We have .ts file in node_modules/, but react won't load any .ts
// file other than those in src/, so we extend react's configuration,
// making it load *.ts file.
// const { CracoAliasPlugin } = require("react-app-alias");

// https://craco.js.org/docs/configuration/
module.exports = {
  webpack: {
    // 去掉 ModuleScopePluginc 插件, 解决如下报错:
    // Module not found: Error: You attempted to import /Users/weidows/Desktop/PrivataFrontend/react-app/node_modules/.pnpm/registry.npmmirror.com+path-browserify@1.0.1/node_modules/path-browserify/index.js which falls outside of the project src/ directory. Relative imports outside of src/ are not supported.
    // You can either move it inside src/, or add a symlink to it from project's node_modules/.
    // macos 无效
    configure: (webpackConfig) => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) =>
          constructor && constructor.name === "ModuleScopePlugin"
      );
      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      return webpackConfig;
    },
    configure: (webpackConfig) => ({
      ...webpackConfig,

      module: {
        ...webpackConfig.module,
        rules: webpackConfig.module.rules.map((rule) => {
          if (!rule.oneOf) return rule;
          return {
            ...rule,
            oneOf: rule.oneOf.map((ruleObject) => {
              if (
                !new RegExp(ruleObject.test).test(".ts") ||
                !ruleObject.include
              )
                return ruleObject;
              return { ...ruleObject, include: undefined };
            }),
          };
        }),
      },
      resolve: {
        ...webpackConfig.resolve,
        // 解决 Module not found
        // If you want to include a polyfill, you need to:
        //         - add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
        //         - install 'path-browserify'
        // If you don't want to include a polyfill, you can use an empty module like this:
        //         resolve.fallback: { "path": false }
        fallback: {
          ...webpackConfig.resolve.fallback,
          // macos 无效
          // path: require.resolve("path-browserify"),
          path: false,
          fs: require.resolve("fs"),
          // tls: false,
          // net: false,
          // zlib: false,
          // http: false,
          // https: false,
          // stream: false,
          // crypto: false,
        },
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
        // https://blog.csdn.net/peter_hzq/article/details/120656880
        // alias: {
        // path 在 src 外很难导入
        //   "@": path.resolve(__dirname, "src"),
        // },
        // modules: [webpackPaths.srcPath, "node_modules"],
      },
    }),
  },
  // plugins: [
  //   {
  //     plugin: CracoAliasPlugin,
  //     options: {
  //       source: "tsconfig",
  //       baseUrl: ".",
  //       tsConfigPath: "./tsconfig.path.json",
  //     },
  //   },
  // ],
};
