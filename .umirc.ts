import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", redirect: "/font" },
    { path: "/font", component: "fontCrop", layout: false },
  ],
  npmClient: 'yarn',
  favicons: [
    '/502/favicon.png',
  ],
  publicPath: '/502/',
  history: {
    type: 'hash',
  },
});
