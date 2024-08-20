export default (env: Record<string, string>) => {
  return {
    // '/api/sys/file': {
    //   changeOrigin: true,
    //   target: env.VITE_APP_UPLOAD_HOST,
    // },
    '/api': {
      changeOrigin: true,
      target: env.VITE_APP_API_HOST,
    },
    '/amap': {
      target: `https://restapi.amap.com`,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/amap/, '/'),
    },
  }
}
