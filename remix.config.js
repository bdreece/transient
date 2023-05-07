/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    postcss: true,
    future: {
        v2_routeConvention: true,
        unstable_tailwind: true,
    },
    ignoredRouteFiles: ['**/.*'],
    // appDirectory: "app",
    // assetsBuildDirectory: "public/build",
    // serverBuildPath: "build/index.js",
    // publicPath: "/build/",
};
