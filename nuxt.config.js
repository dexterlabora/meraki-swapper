const colors = require("vuetify/es5/util/colors").default;

module.exports = {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s",
    title: "Meraki Swapper",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          process.env.npm_package_description ||
          "A Cisco Meraki tool for replicating devices"
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"
      }
    ]
  },
  manifest: {
    name: "Meraki Swapper",
    short_name: "Meraki Swapper",
    description: "A Cisco Meraki tool to clone and remove devices.",
    theme_color: "#fff",
    start_url: "/"
  },
  env: {
    baseUrl: process.env.BASE_URL || "http://localhost:3000"
  },
  serverMiddleware: ["~/api"],
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/vuetify",
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "@nuxtjs/proxy",
    "@bazzite/nuxt-netlify"
  ],
  netlify: {
    // https://www.netlify.com/docs/redirects/
    redirects: [
      {
        from: "/*",
        to: "/index.html",
        status: 200
      }
    ]
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true
  },
  /*
  proxy: {
    "/api": {
      target: "https://api.meraki.com/api/v0",
      pathRewrite: { "^/api": "" }
    }
  },
  */
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    theme: {
      primary: colors.blue.darken2,
      accent: colors.grey.darken3,
      secondary: "#87b965",
      info: colors.teal.lighten1,
      warning: colors.amber.base,
      error: colors.deepOrange.accent4,
      success: colors.green.accent3
    }
  },

  /*
   ** Build configuration
   */
  build: {
    watch: ["api"],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
      }
      config.node = {
        fs: "empty"
      };
    }
  }
};
