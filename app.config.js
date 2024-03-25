export default {
  expo: {
    name: "qr-leitos",
    slug: "qr-leitos",
    version: "1.3.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.qrleitos.qrleitos",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.qrleitos.qrleitos",
      enableProguard: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "37ba66ea-dc3a-4735-9fc9-b4575a44802f",
      },
    },
    owner: "henriquemmalvar",
  },
};
