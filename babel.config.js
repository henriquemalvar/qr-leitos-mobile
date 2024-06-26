module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "@components": "./src/shared/components",
          "@hooks": "./src/shared/hooks",
          "@services": "./src/shared/services",
          "@utils": "./src/shared/utils",
          "@styles": "./src/shared/styles",
          "@pages": "./src/pages",
          "@contexts": "./src/shared/contexts",
        },
      },
    ],
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
      },
    ],
  ],
};
