const path = require("path")

module.exports = {
  productionBrowserSourceMaps: true,
  target: "serverless",
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")]
  },
  webpack: (config) => {
    config.node = {
      child_process: "empty",
      fs: "empty",
      net: "empty",
      tls: "empty",
      externals: "empty"
    }

    return config
  }
}
