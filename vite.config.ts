import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3001,
    proxy: {
      // 开发模式下将 /api 请求代理到后端服务，避免跨域问题
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // 同时代理 /downloads 静态资源
      '/downloads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
