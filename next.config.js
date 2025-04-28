const nextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        tls: false,
        net: false, // Disables the polyfill for 'net' module
        dgram: false, // Disables the polyfill for 'dgram' module
        dns: false, // Disables the polyfill for 'dgram' module
      };
    }

    if (process.env.VERCEL_ENV === "preview") {
      config.optimization.minimize = false;
    }

    return config;
  },
  reactStrictMode: true,
  images: {
    domains: [
      "assets.infusewallet.xyz",
      "statics.solscan.io",
      "s2.coinmarketcap.com",
    ],
  },
  experimental: {
    turbo: {
      useSwcCss: true,
      root: "..",
      resolveAlias: {
        "@drift-labs/sdk": "../drift-common/protocol/sdk",
        "@drift-labs/icons": "../drift-common/icons/dist/",
        "@drift/common": "../drift-common/common-ts/lib/index.js",
        "@drift-labs/react": "../drift-common/react/lib/index.js",
        react: "./node_modules/@types/react",
        fs: { browser: "./node-browser-compatibility.js" },
        net: { browser: "./node-browser-compatibility.js" },
        dns: { browser: "./node-browser-compatibility.js" },
        tls: { browser: "./node-browser-compatibility.js" },
        crypto: { browser: "crypto-browserify" },
      },
      rules: {},
    },
  },
};

module.exports = nextConfig;
