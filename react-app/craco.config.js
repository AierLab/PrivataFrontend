// We have .ts file in node_modules/, but react won't load any .ts
// file other than those in src/, so we extend react's configuration,
// making it load *.ts file.
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
                  !new RegExp(ruleObject.test).test('.ts') ||
                  !ruleObject.include
                )
                  return ruleObject;
                return { ...ruleObject, include: undefined };
              }),
            };
          }),
        },
      }),
    },
  };