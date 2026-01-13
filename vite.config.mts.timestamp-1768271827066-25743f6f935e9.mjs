// vite.config.mts
import { defineConfig } from "file:///D:/Developments/tslib/@woby/node_modules/.pnpm/vite@5.4.21_@types+node@22._09213d9e136d3d4ffba1a9f7c4e648a3/node_modules/vite/dist/node/index.js";
import { nodePolyfills } from "file:///D:/Developments/tslib/@woby/node_modules/.pnpm/vite-plugin-node-polyfills@_fde39a294202a5b68d540d678f1e49c9/node_modules/vite-plugin-node-polyfills/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "D:\\Developments\\tslib\\@woby\\woby";
var isWatchMode = process.env.WATCH === "true" || process.argv.includes("--watch");
var config = defineConfig({
  build: {
    minify: false,
    lib: {
      entry: {
        index: "./src/index.ts",
        runtime: "./src/jsx/runtime.ts",
        "via-runtime": "./src/via/via-runtime.ts",
        via: "./src/via.ts",
        testing: "./src/testing.ts"
      },
      name: "woby",
      formats: ["cjs", "es"],
      fileName: (format, entryName) => `${entryName}.${format}.js`
    },
    sourcemap: true,
    rollupOptions: {
      external: []
    },
    // Prevent Vite from clearing the output directory only in watch mode
    emptyOutDir: !isWatchMode
  },
  esbuild: {
    jsx: "automatic"
  },
  plugins: [
    nodePolyfills({
      // To exclude specific polyfills, add them to this list.
      exclude: ["net"],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true,
        // can also be 'build', 'dev', or false
        global: true,
        process: true
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true
    })
    // dts({ entryRoot: './src', outputDir: './dist/types' })
  ],
  resolve: {
    alias: {
      "~": path.resolve(__vite_injected_original_dirname, "src"),
      // Fix for stream/web import
      "stream/web": "web-streams-polyfill/dist/ponyfill.mjs",
      // Polyfills for Node.js modules that happy-dom needs
      "net": path.resolve(__vite_injected_original_dirname, "net-polyfill.js"),
      "node:perf_hooks": path.resolve(__vite_injected_original_dirname, "perf_hooks-polyfill.js")
    }
  },
  define: {
    // Provide polyfills for Node.js globals that happy-dom might need
    global: "globalThis"
  }
});
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcRGV2ZWxvcG1lbnRzXFxcXHRzbGliXFxcXEB3b2J5XFxcXHdvYnlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXERldmVsb3BtZW50c1xcXFx0c2xpYlxcXFxAd29ieVxcXFx3b2J5XFxcXHZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRGV2ZWxvcG1lbnRzL3RzbGliL0B3b2J5L3dvYnkvdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHsgbm9kZVBvbHlmaWxscyB9IGZyb20gJ3ZpdGUtcGx1Z2luLW5vZGUtcG9seWZpbGxzJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG4vLyBpbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcclxuXHJcbi8vIENoZWNrIGlmIHdlJ3JlIGluIHdhdGNoIG1vZGVcclxuY29uc3QgaXNXYXRjaE1vZGUgPSBwcm9jZXNzLmVudi5XQVRDSCA9PT0gJ3RydWUnIHx8IHByb2Nlc3MuYXJndi5pbmNsdWRlcygnLS13YXRjaCcpXHJcblxyXG5jb25zdCBjb25maWcgPSBkZWZpbmVDb25maWcoe1xyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgICBtaW5pZnk6IGZhbHNlLFxyXG4gICAgICAgIGxpYjoge1xyXG4gICAgICAgICAgICBlbnRyeToge1xyXG4gICAgICAgICAgICAgICAgaW5kZXg6IFwiLi9zcmMvaW5kZXgudHNcIixcclxuICAgICAgICAgICAgICAgIHJ1bnRpbWU6IFwiLi9zcmMvanN4L3J1bnRpbWUudHNcIixcclxuICAgICAgICAgICAgICAgIFwidmlhLXJ1bnRpbWVcIjogXCIuL3NyYy92aWEvdmlhLXJ1bnRpbWUudHNcIixcclxuICAgICAgICAgICAgICAgIHZpYTogJy4vc3JjL3ZpYS50cycsXHJcbiAgICAgICAgICAgICAgICB0ZXN0aW5nOiAnLi9zcmMvdGVzdGluZy50cycsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5hbWU6ICd3b2J5JyxcclxuICAgICAgICAgICAgZm9ybWF0czogWydjanMnLCAnZXMnXSxcclxuICAgICAgICAgICAgZmlsZU5hbWU6IChmb3JtYXQ6IHN0cmluZywgZW50cnlOYW1lOiBzdHJpbmcpID0+IGAke2VudHJ5TmFtZX0uJHtmb3JtYXR9LmpzYFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc291cmNlbWFwOiB0cnVlLFxyXG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgZXh0ZXJuYWw6IFtdXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBQcmV2ZW50IFZpdGUgZnJvbSBjbGVhcmluZyB0aGUgb3V0cHV0IGRpcmVjdG9yeSBvbmx5IGluIHdhdGNoIG1vZGVcclxuICAgICAgICBlbXB0eU91dERpcjogIWlzV2F0Y2hNb2RlXHJcbiAgICB9LFxyXG4gICAgZXNidWlsZDoge1xyXG4gICAgICAgIGpzeDogJ2F1dG9tYXRpYycsXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIG5vZGVQb2x5ZmlsbHMoe1xyXG4gICAgICAgICAgICAvLyBUbyBleGNsdWRlIHNwZWNpZmljIHBvbHlmaWxscywgYWRkIHRoZW0gdG8gdGhpcyBsaXN0LlxyXG4gICAgICAgICAgICBleGNsdWRlOiBbJ25ldCddLFxyXG4gICAgICAgICAgICAvLyBXaGV0aGVyIHRvIHBvbHlmaWxsIHNwZWNpZmljIGdsb2JhbHMuXHJcbiAgICAgICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgICAgICAgIEJ1ZmZlcjogdHJ1ZSwgLy8gY2FuIGFsc28gYmUgJ2J1aWxkJywgJ2RldicsIG9yIGZhbHNlXHJcbiAgICAgICAgICAgICAgICBnbG9iYWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBXaGV0aGVyIHRvIHBvbHlmaWxsIGBub2RlOmAgcHJvdG9jb2wgaW1wb3J0cy5cclxuICAgICAgICAgICAgcHJvdG9jb2xJbXBvcnRzOiB0cnVlXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgLy8gZHRzKHsgZW50cnlSb290OiAnLi9zcmMnLCBvdXRwdXREaXI6ICcuL2Rpc3QvdHlwZXMnIH0pXHJcbiAgICBdLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAgICd+JzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxyXG4gICAgICAgICAgICAvLyBGaXggZm9yIHN0cmVhbS93ZWIgaW1wb3J0XHJcbiAgICAgICAgICAgICdzdHJlYW0vd2ViJzogJ3dlYi1zdHJlYW1zLXBvbHlmaWxsL2Rpc3QvcG9ueWZpbGwubWpzJyxcclxuICAgICAgICAgICAgLy8gUG9seWZpbGxzIGZvciBOb2RlLmpzIG1vZHVsZXMgdGhhdCBoYXBweS1kb20gbmVlZHNcclxuICAgICAgICAgICAgJ25ldCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICduZXQtcG9seWZpbGwuanMnKSxcclxuICAgICAgICAgICAgJ25vZGU6cGVyZl9ob29rcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdwZXJmX2hvb2tzLXBvbHlmaWxsLmpzJylcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGRlZmluZToge1xyXG4gICAgICAgIC8vIFByb3ZpZGUgcG9seWZpbGxzIGZvciBOb2RlLmpzIGdsb2JhbHMgdGhhdCBoYXBweS1kb20gbWlnaHQgbmVlZFxyXG4gICAgICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLFxyXG4gICAgfSxcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbmZpZyJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFIsU0FBUyxvQkFBb0I7QUFDM1QsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBTXpDLElBQU0sY0FBYyxRQUFRLElBQUksVUFBVSxVQUFVLFFBQVEsS0FBSyxTQUFTLFNBQVM7QUFFbkYsSUFBTSxTQUFTLGFBQWE7QUFBQSxFQUN4QixPQUFPO0FBQUEsSUFDSCxRQUFRO0FBQUEsSUFDUixLQUFLO0FBQUEsTUFDRCxPQUFPO0FBQUEsUUFDSCxPQUFPO0FBQUEsUUFDUCxTQUFTO0FBQUEsUUFDVCxlQUFlO0FBQUEsUUFDZixLQUFLO0FBQUEsUUFDTCxTQUFTO0FBQUEsTUFDYjtBQUFBLE1BQ0EsTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLE9BQU8sSUFBSTtBQUFBLE1BQ3JCLFVBQVUsQ0FBQyxRQUFnQixjQUFzQixHQUFHLFNBQVMsSUFBSSxNQUFNO0FBQUEsSUFDM0U7QUFBQSxJQUNBLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNYLFVBQVUsQ0FBQztBQUFBLElBQ2Y7QUFBQTtBQUFBLElBRUEsYUFBYSxDQUFDO0FBQUEsRUFDbEI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLEtBQUs7QUFBQSxFQUNUO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxjQUFjO0FBQUE7QUFBQSxNQUVWLFNBQVMsQ0FBQyxLQUFLO0FBQUE7QUFBQSxNQUVmLFNBQVM7QUFBQSxRQUNMLFFBQVE7QUFBQTtBQUFBLFFBQ1IsUUFBUTtBQUFBLFFBQ1IsU0FBUztBQUFBLE1BQ2I7QUFBQTtBQUFBLE1BRUEsaUJBQWlCO0FBQUEsSUFDckIsQ0FBQztBQUFBO0FBQUEsRUFFTDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBO0FBQUEsTUFFbEMsY0FBYztBQUFBO0FBQUEsTUFFZCxPQUFPLEtBQUssUUFBUSxrQ0FBVyxpQkFBaUI7QUFBQSxNQUNoRCxtQkFBbUIsS0FBSyxRQUFRLGtDQUFXLHdCQUF3QjtBQUFBLElBQ3ZFO0FBQUEsRUFDSjtBQUFBLEVBQ0EsUUFBUTtBQUFBO0FBQUEsSUFFSixRQUFRO0FBQUEsRUFDWjtBQUNKLENBQUM7QUFFRCxJQUFPLHNCQUFROyIsCiAgIm5hbWVzIjogW10KfQo=
