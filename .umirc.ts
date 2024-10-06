import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", redirect: "/tool/font" },
    { path: "tool/font", component: "fontCrop" },
  ],
  npmClient: 'yarn',
  favicons: [
    '/502/favicon.png',
  ],
  publicPath: '/502/'
});
