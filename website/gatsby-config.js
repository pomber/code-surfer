module.exports = {
  siteMetadata: {
    title: "Code Surfer"
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Code Surfer",
        short_name: "code-surfer",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "src/images/favicon.png"
      }
    },
    "gatsby-plugin-offline"
  ]
};
