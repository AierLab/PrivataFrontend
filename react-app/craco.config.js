// We have .ts file in node_modules/, but react won't load any .ts
// file other than those in src/, so we extend react's configuration,
// making it load *.ts file.
const path = require("path");

module.exports = {
  webpack: {
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
          // path: require.resolve("path-browserify"),
          // fs: require.resolve("fs"),
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
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
        // modules: [webpackPaths.srcPath, "node_modules"],
      },
    }),
  },
};
